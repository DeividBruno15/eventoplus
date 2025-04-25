
export type EventStatus = 'draft' | 'published' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees: number | null;
  contractor_id: string;
  created_at: string;
  updated_at: string | null;
  service_type: string;
  status: EventStatus;
  event_time?: string;
  image_url?: string | null;
}

export interface EventApplication {
  id: string;
  event_id: string;
  provider_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string | null;
  message?: string;
  price?: number;
  provider?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    rating?: number;
  };
}
