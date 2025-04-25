
import { EventCard } from "./EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  status: string;
}

interface EventTabsProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  formatDate: (date: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const EventTabs = ({ 
  upcomingEvents, 
  pastEvents, 
  formatDate,
  getStatusBadgeClass,
  getStatusLabel 
}: EventTabsProps) => {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList>
        <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
        <TabsTrigger value="past">Eventos Passados</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="mt-4">
        <div className="grid gap-4">
          {upcomingEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="past" className="mt-4">
        <div className="grid gap-4">
          {pastEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
