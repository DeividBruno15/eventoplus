
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { EventsContent } from "./components/EventsContent";
import { ProviderEventsContent } from "./components/ProviderEventsContent";
import DashboardLayout from "@/layouts/DashboardLayout";

const Events = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    navigate('/login');
    return null;
  }

  // Determine user role from session metadata
  const userRole = user?.user_metadata?.role || 'contractor';

  return (
    <DashboardLayout>
      {userRole === 'provider' ? (
        <ProviderEventsContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ) : (
        <EventsContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
    </DashboardLayout>
  );
};

export default Events;
