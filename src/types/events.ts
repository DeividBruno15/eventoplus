
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished' | 'open' | 'closed' | 'in_progress';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type Event = {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees?: number;
  contractor_id: string;
  created_at: string;
  updated_at: string | null; // Make it nullable to handle the case when it's not present
  service_type: string;
  status: EventStatus;
  creator?: {
    first_name: string;
    last_name: string;
    phone_number?: string | null;
  } | null;
}

export type EventApplication = {
  id: string;
  event_id: string;
  provider_id: string;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  } | null;
}
