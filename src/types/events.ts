
export type EventStatus = 'draft' | 'published' | 'closed' | 'completed';

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
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
}
