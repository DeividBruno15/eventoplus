
export type EventType = 'wedding' | 'birthday' | 'corporate' | 'graduation' | 'other';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished' | 'open' | 'closed' | 'in_progress';

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees?: number;
  contractor_id: string;
  created_at: string;
  service_type: string;
  status: EventStatus;
  updated_at?: string;
  creator?: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  } | null;
}

export interface CreateEventFormData {
  name: string;
  description: string;
  event_date: string;
  location: string;
  service_type: string;
  max_attendees?: number;
}

export interface EventApplication {
  id: string;
  event_id: string;
  provider_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  } | null;
}
