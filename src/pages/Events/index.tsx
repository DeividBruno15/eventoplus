
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { EventsContent } from "./components/EventsContent";
import { ProviderEventsContent } from "./components/ProviderEventsContent";

const Events = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    navigate('/login');
    return null;
  }

  // Determine user role from session metadata
  const userRole = session?.user?.user_metadata?.role || 'contractor';

  // Render different content based on user role
  if (userRole === 'provider') {
    return <ProviderEventsContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
  }

  return <EventsContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
};

export default Events;
