
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types/events";
import { useContractorInfo } from "@/hooks/useContractorInfo";
import { EmptyEventState } from "./provider/EmptyEventState";
import { EventsLoading } from "./provider/EventsLoading";
import { ProviderEventGrid } from "./provider/ProviderEventGrid";

interface ProviderEventsListProps {
  loading: boolean;
  availableEvents: Event[];
  appliedEvents: Event[];
  searchQuery: string;
  onApply: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

export const ProviderEventsList = ({
  loading,
  availableEvents,
  appliedEvents,
  searchQuery,
  onApply,
  onViewDetails,
}: ProviderEventsListProps) => {
  // Get unique contractor IDs from both event lists
  const contractorIds = React.useMemo(() => {
    const allEvents = [...availableEvents, ...appliedEvents];
    return [...new Set(allEvents.map(event => event.contractor_id))];
  }, [availableEvents, appliedEvents]);
  
  const { contractorNames } = useContractorInfo(contractorIds);
  
  const filterEvents = (events: Event[]) =>
    events.filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredAvailableEvents = filterEvents(availableEvents);
  const filteredAppliedEvents = filterEvents(appliedEvents);

  // For debugging
  useEffect(() => {
    console.log("Available events:", availableEvents);
    console.log("Applied events:", appliedEvents);
  }, [availableEvents, appliedEvents]);

  if (loading) {
    return <EventsLoading />;
  }

  return (
    <Tabs defaultValue="available" className="space-y-4">
      <TabsList>
        <TabsTrigger value="available">Disponíveis para Candidatura</TabsTrigger>
        <TabsTrigger value="applied">Minhas Candidaturas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="space-y-4">
        {filteredAvailableEvents.length === 0 ? (
          <EmptyEventState 
            title="Nenhum evento disponível" 
            description="No momento não há eventos disponíveis para os serviços que você oferece."
          />
        ) : (
          <ProviderEventGrid
            events={filteredAvailableEvents}
            onApply={onApply}
            onViewDetails={onViewDetails}
            contractorNames={contractorNames}
          />
        )}
      </TabsContent>
      
      <TabsContent value="applied" className="space-y-4">
        {filteredAppliedEvents.length === 0 ? (
          <EmptyEventState 
            title="Nenhuma candidatura enviada" 
            description="Você ainda não se candidatou a nenhum evento."
          />
        ) : (
          <ProviderEventGrid
            events={filteredAppliedEvents}
            isApplied={true}
            onApply={onApply}
            onViewDetails={onViewDetails}
            contractorNames={contractorNames}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
