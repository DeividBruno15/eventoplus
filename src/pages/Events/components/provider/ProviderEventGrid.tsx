
import React from "react";
import { Event } from "@/types/events";
import { ProviderEventCard } from "../ProviderEventCard";

interface ContractorInfo {
  id: string;
  name: string;
  company_name?: string;
}

interface ProviderEventGridProps {
  events: Event[];
  isApplied?: boolean;
  onApply: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  contractorNames: Record<string, ContractorInfo>;
}

export const ProviderEventGrid = ({ 
  events, 
  isApplied = false, 
  onApply, 
  onViewDetails, 
  contractorNames 
}: ProviderEventGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <ProviderEventCard
          key={event.id}
          event={event}
          isApplied={isApplied}
          onApply={onApply}
          onViewDetails={onViewDetails}
          contractorInfo={contractorNames[event.contractor_id]}
        />
      ))}
    </div>
  );
};
