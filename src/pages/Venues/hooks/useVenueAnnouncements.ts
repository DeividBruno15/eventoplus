
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { VenueAnnouncement } from "../types";

export const useVenueAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<VenueAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userRole = user?.user_metadata?.role;
        
        // Different queries based on user role
        if (userRole === 'advertiser') {
          // For advertisers, only show their own announcements
          const { data, error } = await supabase
            .from('venue_announcements')
            .select(`
              id, 
              title, 
              description,
              image_url,
              venue_type,
              price_per_hour,
              created_at,
              views,
              venue_id,
              social_links,
              user_venues(name, street, number, neighborhood, city, state)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          // Format data for display
          const formattedData = formatAnnouncementData(data);
          setAnnouncements(formattedData);
        } else {
          // For contractors, show all venues
          const { data, error } = await supabase
            .from('venue_announcements')
            .select(`
              id, 
              title, 
              description,
              image_url,
              venue_type,
              price_per_hour,
              created_at,
              views,
              venue_id,
              social_links,
              user_venues(name, street, number, neighborhood, city, state)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          // Format data for display
          const formattedData = formatAnnouncementData(data);
          
          // Fetch user profile to get location for potential filtering
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('city, state')
            .eq('id', user.id)
            .single();
            
          // If we have location info, prioritize venues in the same location
          // but still show all venues
          if (profileData?.city) {
            // Sort: prioritize venues in same city, then same state
            const sortedData = formattedData.sort((a, b) => {
              const aVenue = a.address || '';
              const bVenue = b.address || '';
              
              const aInSameCity = aVenue.includes(profileData.city);
              const bInSameCity = bVenue.includes(profileData.city);
              
              if (aInSameCity && !bInSameCity) return -1;
              if (!aInSameCity && bInSameCity) return 1;
              
              const aInSameState = aVenue.includes(profileData.state);
              const bInSameState = bVenue.includes(profileData.state);
              
              if (aInSameState && !bInSameState) return -1;
              if (!aInSameState && bInSameState) return 1;
              
              return 0;
            });
            
            setAnnouncements(sortedData);
          } else {
            setAnnouncements(formattedData);
          }
        }
      } catch (error) {
        console.error('Error fetching venue announcements:', error);
        toast.error('Falha ao carregar anúncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user]);

  // Helper function to format announcement data
  const formatAnnouncementData = (data: any[] | null): VenueAnnouncement[] => {
    return data?.map(item => {
      const venueData = item.user_venues as unknown as {
        name: string;
        street?: string;
        number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
      };
      
      // Format address if venue data exists
      const address = venueData ? 
        `${venueData.street}, ${venueData.number} - ${venueData.neighborhood}, ${venueData.city}/${venueData.state}` : 
        undefined;

      // Add a random rating between 3 and 5 for demonstration purposes
      // In a real application, this would come from the database
      const rating = Math.floor(Math.random() * (5 - 3 + 1) + 3);

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        venue_name: venueData ? venueData.name : 'Local não especificado',
        created_at: item.created_at,
        views: item.views,
        venue_type: item.venue_type,
        price_per_hour: item.price_per_hour,
        address: address,
        social_links: item.social_links,
        rating: rating // Add the rating to each announcement
      };
    }) || [];
  };

  return { announcements, loading };
};
