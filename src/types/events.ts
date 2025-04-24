
export type EventType = 'wedding' | 'birthday' | 'corporate' | 'graduation' | 'other';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished';

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  event_type: EventType;
  target_audience?: string;
  status: EventStatus;
  creator_id: string;
  estimated_budget?: number;
  max_guests?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEventFormData {
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  event_type: EventType;
  target_audience?: string;
  estimated_budget?: number;
  max_guests?: number;
  images?: File[];
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
  };
}
