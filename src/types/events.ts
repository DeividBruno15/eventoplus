
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
  event_time: string;
  location: string;
  zipcode?: string;
  service_type?: string;
  max_attendees?: number | null;
  service_requests?: ServiceRequest[];
  created_at: string;
  updated_at?: string;
  contractor_id: string;
  image_url?: string;
  status: EventStatus;
}

export interface EventApplication {
  id: string;
  provider_id: string;
  event_id: string;
  status: ApplicationStatus;
  message: string;
  created_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  };
}
