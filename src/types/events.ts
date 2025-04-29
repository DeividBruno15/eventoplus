
export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees?: number;
  contractor_id: string;
  contractor?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at?: string | null;
  service_type: string;
  status: EventStatus;
  event_time?: string;
  image_url?: string;
  service_requests?: ServiceRequest[];
}

export type EventStatus = 'open' | 'closed' | 'published' | 'draft';

export interface ServiceRequest {
  id: string;
  service_type: string;
  description?: string;
}

export interface EventApplication {
  id: string;
  provider_id: string;
  event_id: string;
  status: "pending" | "accepted" | "rejected";
  service_category: string;
  message: string;
  created_at: string;
  provider?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}
