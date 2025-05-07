
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserRoles = (user: any) => {
  const [hasProviderRole, setHasProviderRole] = useState<boolean | null>(null);
  const [hasContractorRole, setHasContractorRole] = useState<boolean | null>(null);
  const [hasAdvertiserRole, setHasAdvertiserRole] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkUserRoles = async () => {
      if (!user) return;
      
      try {
        // First check current user metadata
        const currentRole = user.user_metadata?.role;
        console.log("Current user role from metadata:", currentRole);
        
        if (currentRole === 'provider') {
          setHasProviderRole(true);
        } else if (currentRole === 'contractor') {
          setHasContractorRole(true);
        } else if (currentRole === 'advertiser') {
          setHasAdvertiserRole(true);
        }
        
        // Check if user has a provider profile
        const { data: providerData, error: providerError } = await supabase
          .from('provider_services')
          .select('id')
          .eq('provider_id', user.id)
          .limit(1);
          
        if (!providerError && providerData && providerData.length > 0) {
          setHasProviderRole(true);
          console.log("User has provider services:", providerData);
        }
        
        // Check if user has created any events as a contractor
        const { data: contractorData, error: contractorError } = await supabase
          .from('events')
          .select('id')
          .eq('contractor_id', user.id)
          .limit(1);
          
        if (!contractorError && contractorData && contractorData.length > 0) {
          setHasContractorRole(true);
          console.log("User has contractor events:", contractorData);
        }
        
        // Check if user has created any venues as an advertiser
        try {
          // Using raw query to check if venues table exists before querying
          const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'venues' });
          
          // Only try to query venues if the table exists
          if (data && !error) {
            const { data: venuesData } = await supabase
              .from('venues')
              .select('id')
              .eq('user_id', user.id)
              .limit(1);
              
            if (venuesData && venuesData.length > 0) {
              setHasAdvertiserRole(true);
              console.log("User has advertiser venues:", venuesData);
            }
          }
        } catch (error) {
          console.error('Error checking advertiser role:', error);
        }
        
      } catch (error) {
        console.error('Error checking user roles:', error);
      }
    };
    
    checkUserRoles();
  }, [user]);

  return { hasProviderRole, hasContractorRole, hasAdvertiserRole };
};
