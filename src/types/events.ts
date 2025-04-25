
export type EventStatus = 'open' | 'closed' | 'in_progress' | 'cancelled' | 'finished' | 'published' | 'draft';

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
  updated_at: string | null; // Added this field
  status: EventStatus;
  image_url?: string; // Added this field as optional
  creator?: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
  };
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface EventApplication {
  id: string;
  event_id: string;
  provider_id: string;
  provider_name?: string;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  };
}
