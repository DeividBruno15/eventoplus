
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Determines the role of the current user
 */
export const useEventUserRole = (user: User | null | undefined) => {
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      // Get user role from user_metadata or from the database
      const userRole = user.user_metadata?.role;
      if (userRole) {
        setUserRole(userRole as 'provider' | 'contractor');
        console.log("User role from metadata:", userRole);
      } else {
        const { data: userProfileData } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (userProfileData) {
          setUserRole(userProfileData.role as 'provider' | 'contractor');
          console.log("User role from database:", userProfileData.role);
        }
      }
    };
    
    fetchUserRole();
  }, [user]);
  
  return { userRole };
};
