
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRatings } from '@/hooks/useUserRatings';

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  role: 'contractor' | 'provider';
  avatar_url: string | null;
  bio: string | null;
  city?: string;
  state?: string;
  companies?: Array<{
    id: string;
    name: string;
  }>;
  services?: Array<{
    id: string;
    category: string;
  }>;
}

export const useUserProfileData = (id: string | undefined) => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [eventCount, setEventCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Usar o hook de avaliações diretamente
  const { ratings, averageRating, totalRatings, loading: ratingsLoading } = 
    id ? useUserRatings({ userId: id }) : { ratings: [], averageRating: 0, totalRatings: 0, loading: false };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        // Fetch basic user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select(`
            id, 
            first_name, 
            last_name, 
            role, 
            avatar_url, 
            bio,
            city,
            state
          `)
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        let userData: UserProfileData = {
          ...profileData as UserProfileData,
          companies: [],
          services: []
        };

        // If contractor, fetch companies
        if (profileData?.role === 'contractor') {
          const { data: companiesData } = await supabase
            .from('user_companies')
            .select('id, name')
            .eq('user_id', id);
            
          if (companiesData) {
            userData.companies = companiesData;
          }
          
          // For contractors, count events
          const { data: eventCountData } = await supabase
            .from('events')
            .select('id', { count: 'exact' })
            .eq('contractor_id', id);

          if (eventCountData) {
            setEventCount(eventCountData.length);
          }
        } 
        // If provider, fetch services
        else if (profileData?.role === 'provider') {
          const { data: servicesData } = await supabase
            .from('provider_services')
            .select('id, category')
            .eq('provider_id', id);
            
          if (servicesData) {
            userData.services = servicesData;
          }
          
          // For providers, count approved applications
          const { data: applicationCountData } = await supabase
            .from('event_applications')
            .select('id', { count: 'exact' })
            .eq('provider_id', id)
            .eq('status', 'accepted');

          if (applicationCountData) {
            setEventCount(applicationCountData.length);
          }
        }

        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  return {
    userData,
    ratings,
    eventCount,
    averageRating,
    loading: loading || ratingsLoading,
    totalRatings
  };
};
