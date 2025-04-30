
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

  // Use a stable key that doesn't change constantly
  // Only regenerate the key when refresh=true is in the URL
  const refreshKey = new URLSearchParams(location.search).get('refresh') === 'true' ? 
    'refresh-triggered' : 
    'stable-key';

  return (
    <>
      {userRole === 'provider' ? (
        <ProviderEventsContent key={refreshKey} />
      ) : (
        <EventsContent key={refreshKey} />
      )}
    </>
  );
};

export default Events;
