
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types/events";
import { ProviderEventCard } from "./ProviderEventCard";
import { supabase } from "@/integrations/supabase/client";

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
}

export const ProviderEventsList = ({
  loading,
  availableEvents,
  appliedEvents,
  searchQuery,
  onApply,
  onViewDetails,
}: ProviderEventsListProps) => {
  const [contractorNames, setContractorNames] = useState<Record<string, string>>({});
  
  // Fetch contractor names for all events
  useEffect(() => {
    const fetchContractorNames = async () => {
      const allEvents = [...availableEvents, ...appliedEvents];
      const uniqueContractorIds = [...new Set(allEvents.map(event => event.contractor_id))];
      
      if (uniqueContractorIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', uniqueContractorIds);
          
        if (error) throw error;
        
        if (data) {
          const nameMap = data.reduce((acc: Record<string, string>, contractor) => {
            acc[contractor.id] = `${contractor.first_name} ${contractor.last_name || ''}`.trim();
            return acc;
          }, {});
          
          setContractorNames(nameMap);
        }
      } catch (error) {
        console.error('Error fetching contractor names:', error);
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
                contractorName={contractorNames[event.contractor_id]}
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
                contractorName={contractorNames[event.contractor_id]}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
