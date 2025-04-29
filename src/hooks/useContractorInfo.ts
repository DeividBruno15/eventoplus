
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContractorInfo {
  id: string;
  name: string;
  company_name?: string;
}

export const useContractorInfo = (contractorIds: string[]) => {
  const [contractorNames, setContractorNames] = useState<Record<string, ContractorInfo>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContractorNames = async () => {
      if (contractorIds.length === 0) return;
      
      setLoading(true);
      try {
        console.log("Fetching contractor info for IDs:", contractorIds);
        
        // Get all user profiles
        const { data: userProfileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', contractorIds);
          
        if (profileError) {
          console.error('Error fetching contractor profiles:', profileError);
          throw profileError;
        }
        
        console.log("Contractor profiles fetched:", userProfileData);
        
        // Get all companies 
        const { data: companiesData, error: companiesError } = await supabase
          .from('user_companies')
          .select('user_id, name')
          .in('user_id', contractorIds);
          
        if (companiesError) {
          console.error('Error fetching contractor companies:', companiesError);
          throw companiesError;
        }
        
        console.log("Contractor companies fetched:", companiesData);
        
        // Create a map of companies by user_id
        const companyMap: Record<string, string> = {};
        if (companiesData) {
          companiesData.forEach(company => {
            companyMap[company.user_id] = company.name;
          });
        }
        
        if (userProfileData) {
          const nameMap = userProfileData.reduce((acc: Record<string, ContractorInfo>, contractor) => {
            const displayName = `${contractor.first_name} ${contractor.last_name || ''}`.trim();
            acc[contractor.id] = {
              id: contractor.id,
              name: displayName,
              company_name: companyMap[contractor.id] // Add company name if available
            };
            return acc;
          }, {});
          
          console.log("Processed contractor info map:", nameMap);
          setContractorNames(nameMap);
        }
      } catch (error) {
        console.error('Error fetching contractor names:', error);
        toast.error("Erro ao carregar informações dos contratantes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContractorNames();
  }, [contractorIds]);

  return { contractorNames, loading };
};
