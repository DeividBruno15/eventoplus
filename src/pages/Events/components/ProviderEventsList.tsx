
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types/events";
import { ProviderEventCard } from "./ProviderEventCard";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ProviderEventsListProps {
  loading: boolean;
  availableEvents: Event[];
  appliedEvents: Event[];
  searchQuery: string;
  onApply: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

interface ContractorInfo {
  id: string;
  name: string;
  company_name?: string;
}

export const ProviderEventsList = ({
  loading,
  availableEvents,
  appliedEvents,
  searchQuery,
  onApply,
  onViewDetails,
}: ProviderEventsListProps) => {
  const [contractorNames, setContractorNames] = useState<Record<string, ContractorInfo>>({});
  
  // Fetch contractor names for all events
  useEffect(() => {
    const fetchContractorNames = async () => {
      const allEvents = [...availableEvents, ...appliedEvents];
      const uniqueContractorIds = [...new Set(allEvents.map(event => event.contractor_id))];
      
      if (uniqueContractorIds.length === 0) return;
      
      try {
        console.log("Fetching contractor info for IDs:", uniqueContractorIds);
        
        // Get all user profiles
        const { data: userProfileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', uniqueContractorIds);
          
        if (profileError) {
          console.error('Error fetching contractor profiles:', profileError);
          throw profileError;
        }
        
        console.log("Contractor profiles fetched:", userProfileData);
        
        // Get all companies 
        const { data: companiesData, error: companiesError } = await supabase
          .from('user_companies')
          .select('user_id, name')
          .in('user_id', uniqueContractorIds);
          
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
      }
    };
    
    fetchContractorNames();
  }, [availableEvents, appliedEvents]);

  const filterEvents = (events: Event[]) =>
    events.filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredAvailableEvents = filterEvents(availableEvents);
  const filteredAppliedEvents = filterEvents(appliedEvents);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="available" className="space-y-4">
      <TabsList>
        <TabsTrigger value="available">Disponíveis para Candidatura</TabsTrigger>
        <TabsTrigger value="applied">Minhas Candidaturas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="space-y-4">
        {filteredAvailableEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
              <h3 className="text-lg font-medium mb-2">Nenhum evento disponível</h3>
              <p className="text-muted-foreground text-sm">
                No momento não há eventos disponíveis para os serviços que você oferece.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableEvents.map(event => (
              <ProviderEventCard
                key={event.id}
                event={event}
                onApply={onApply}
                onViewDetails={onViewDetails}
                contractorInfo={contractorNames[event.contractor_id]}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="applied" className="space-y-4">
        {filteredAppliedEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
              <h3 className="text-lg font-medium mb-2">Nenhuma candidatura enviada</h3>
              <p className="text-muted-foreground text-sm">
                Você ainda não se candidatou a nenhum evento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliedEvents.map(event => (
              <ProviderEventCard
                key={event.id}
                event={event}
                isApplied
                onApply={onApply}
                onViewDetails={onViewDetails}
                contractorInfo={contractorNames[event.contractor_id]}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
