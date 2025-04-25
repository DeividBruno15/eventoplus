
export type EventStatus = 'open' | 'closed' | 'in_progress' | 'cancelled' | 'finished';

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  service_type: string;
  max_attendees: number | null;
  contractor_id: string;
  created_at: string;
  updated_at: string | null;
  status: EventStatus;
  image_url?: string;
}

export interface EventApplication {
  id: string;
  event_id: string;
  provider_id: string;
  provider_name?: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
