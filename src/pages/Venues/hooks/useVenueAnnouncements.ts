
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
        
        // Format data to match the expected component format
        const formattedData = data?.map(item => {
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
            social_links: item.social_links
          };
        }) || [];
        
        setAnnouncements(formattedData);
      } catch (error) {
        console.error('Error fetching venue announcements:', error);
        toast.error('Falha ao carregar anúncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user]);

  return { announcements, loading };
};
