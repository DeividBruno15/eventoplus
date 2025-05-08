
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VenueAnnouncement } from "../types";

export const useVenueAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<VenueAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('venue_announcements')
        .select(`
          *,
          user_venues (
            name,
            city,
            state,
            zipcode,
            street,
            number,
            neighborhood
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match our type
      const formattedAnnouncements: VenueAnnouncement[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        venue_name: item.user_venues?.name || "Local não especificado",
        venue_type: item.venue_type,
        price_per_hour: item.price_per_hour,
        created_at: item.created_at,
        views: item.views || 0,
        address: item.user_venues ? 
          `${item.user_venues.city}/${item.user_venues.state}` : 
          undefined,
        user_id: item.user_id,
        social_links: item.social_links,
        user_venues: item.user_venues ? {
          zipcode: item.user_venues.zipcode,
          city: item.user_venues.city,
          state: item.user_venues.state
        } : undefined,
        rating: undefined // We'll add rating data separately
      }));
      
      // Fetch ratings for each venue
      for (const announcement of formattedAnnouncements) {
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('venue_ratings')
          .select('overall_rating')
          .eq('venue_id', announcement.id);
          
        if (!ratingsError && ratingsData && ratingsData.length > 0) {
          const ratings = ratingsData.map(r => r.overall_rating);
          announcement.rating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        }
      }
      
      setAnnouncements(formattedAnnouncements);
    } catch (err) {
      console.error('Error fetching venue announcements:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Refetch announcements function for external calls
  const refetchAnnouncements = () => {
    return fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    refetchAnnouncements
  };
};
