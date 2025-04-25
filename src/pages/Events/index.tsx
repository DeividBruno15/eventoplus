
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { EventsContent } from "./components/EventsContent";

const Events = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    navigate('/login');
    return null;
  }

  return <EventsContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
};

export default Events;
