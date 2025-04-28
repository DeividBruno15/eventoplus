
export type EventStatus = 'draft' | 'published' | 'closed' | 'completed' | 'cancelled';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface ServiceRequest {
  category: string;
  count: number;
  filled?: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time?: string | null;
  location: string;
  zipcode?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  service_type?: string;
  max_attendees?: number | null;
  service_requests?: ServiceRequest[] | null;
  created_at: string;
  updated_at?: string | null;
  contractor_id: string;
  image_url?: string | null;
  status: EventStatus;
}

export interface CreateEventFormData {
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  zipcode: string;
  location: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  service_requests?: ServiceRequest[];
  image: File | null | string;
}

export interface EventApplication {
  id: string;
  provider_id: string;
  event_id: string;
  status: ApplicationStatus;
  message: string;
  created_at: string;
  updated_at?: string | null;
  price?: number | null;
  provider?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}
