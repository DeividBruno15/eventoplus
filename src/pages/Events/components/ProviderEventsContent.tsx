
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NoServicesWarning } from "./NoServicesWarning";
import { ProviderEventsList } from "./ProviderEventsList";
import { ProviderEventsLoading } from "./provider/ProviderEventsLoading";
import { ProviderEventSearch } from "./provider/ProviderEventSearch";
import { useProviderServices } from "../hooks/useProviderServices";
import { useProviderEvents } from "../hooks/useProviderEvents";

export const ProviderEventsContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get provider services
  const { userServices, loading: servicesLoading } = useProviderServices();
  
  // Get events based on provider services
  const { 
    loading: eventsLoading, 
    availableEvents, 
    appliedEvents 
  } = useProviderEvents(userServices);
  
  // Loading state while fetching services
  if (servicesLoading) {
    return <ProviderEventsLoading />;
  }

  // If provider hasn't configured services yet
  if (userServices.length === 0) {
    return <NoServicesWarning />;
  }

  // Navigation handlers
  const handleApply = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <ProviderEventSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <ProviderEventsList
        loading={eventsLoading}
        availableEvents={availableEvents}
        appliedEvents={appliedEvents}
        searchQuery={searchQuery}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};
