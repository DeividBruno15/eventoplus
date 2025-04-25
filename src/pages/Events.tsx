
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsSearch } from "@/components/events/EventsSearch";
import { EventTabs } from "@/components/events/EventTabs";
import { formatEventDate, getEventStatusBadgeClass, getEventStatusLabel } from "@/components/events/utils";

const Events = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    navigate('/login');
    return null;
  }

  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Conferência de Marketing Digital',
      date: '2025-05-15',
      location: 'São Paulo, SP',
      participants: 42,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Workshop de Design Thinking',
      date: '2025-05-20',
      location: 'Rio de Janeiro, RJ',
      participants: 25,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Meetup de Desenvolvedores',
      date: '2025-05-25',
      location: 'Belo Horizonte, MG',
      participants: 35,
      status: 'confirmed'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'Palestra sobre Inovação',
      date: '2025-04-10',
      location: 'Curitiba, PR',
      participants: 50,
      status: 'completed'
    },
    {
      id: 5,
      title: 'Curso de Gestão de Projetos',
      date: '2025-04-05',
      location: 'Brasília, DF',
      participants: 30,
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <EventsHeader />
      <EventsSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <EventTabs 
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        formatDate={formatEventDate}
        getStatusBadgeClass={getEventStatusBadgeClass}
        getStatusLabel={getEventStatusLabel}
      />
    </div>
  );
};

export default Events;
