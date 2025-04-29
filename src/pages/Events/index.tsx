
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { EventsContent } from "./components/EventsContent";
import { ProviderEventsContent } from "./components/ProviderEventsContent";

const Events = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  // Determine user role from session metadata
  const userRole = user?.user_metadata?.role || 'contractor';

  return (
    <>
      {userRole === 'provider' ? (
        <ProviderEventsContent />
      ) : (
        <EventsContent />
      )}
    </>
  );
};

export default Events;
