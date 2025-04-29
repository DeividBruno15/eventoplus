
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
}

export const useUserProfileData = (id: string | undefined) => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number>(0);

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
        
        // Fetch mock ratings for now (in a real app, this would come from a ratings table)
        // This is placeholder data - you would replace with actual ratings from your database
        const mockRatings = [
          {
            id: '1',
            rating: 5,
            comment: 'Excelente profissional! Recomendo.',
            created_at: '2023-04-15T10:30:00Z',
            reviewer_name: 'Maria Silva',
            reviewer_avatar: null
          },
          {
            id: '2',
            rating: 4,
            comment: 'Bom trabalho, entregou o combinado no prazo.',
            created_at: '2023-03-22T14:15:00Z',
            reviewer_name: 'João Santos',
            reviewer_avatar: null
          },
          {
            id: '3',
            rating: 5,
            comment: 'Superou as expectativas! Muito profissional.',
            created_at: '2023-02-10T09:45:00Z',
            reviewer_name: 'Ana Oliveira',
            reviewer_avatar: null
          }
        ];
        
        setRatings(mockRatings);
        
        // Calculate average rating
        if (mockRatings.length > 0) {
          const sum = mockRatings.reduce((acc, rating) => acc + rating.rating, 0);
          setAverageRating(sum / mockRatings.length);
        }
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
    loading
  };
};
