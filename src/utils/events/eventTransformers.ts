
import { Event, EventStatus } from "@/types/events";

/**
 * Transforms raw database event data into the Event type
 */
export const transformEventData = (eventData: any): Event => {
  return {
    id: eventData.id,
    name: eventData.name, 
    description: eventData.description,
    event_date: eventData.event_date,
    location: eventData.location,
    max_attendees: eventData.max_attendees || undefined,
    contractor_id: eventData.contractor_id,
    user_id: eventData.user_id || eventData.contractor_id, // Usar contractor_id como fallback caso user_id não esteja disponível
    contractor: {
      id: eventData.contractor_id,
      first_name: '', // We'll fetch this separately if needed
      last_name: '',
    },
    created_at: eventData.created_at,
    updated_at: null,
    service_type: eventData.service_type,
    status: eventData.status as EventStatus,
    event_time: eventData.event_time || undefined,
    image_url: eventData.image_url || undefined,
    service_requests: eventData.service_requests as any || undefined,
    zipcode: eventData.zipcode || undefined,
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  };
};
