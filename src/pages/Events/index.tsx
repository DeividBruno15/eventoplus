
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { EventsContent } from "./components/EventsContent";
import { ProviderEventsContent } from "./components/ProviderEventsContent";
import { useEffect } from "react";

const Events = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
    
    // Force refresh component when navigated to via direct path or when URL changes (like after deletion)
    console.log("Events page mounted/refreshed", location.search);
  }, [session, navigate, location.search]);

  if (!session) {
    return null;
  }

  // Determine user role from session metadata
  const userRole = user?.user_metadata?.role || 'contractor';

  // Remove the dynamic key that was causing continuous re-renders
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
