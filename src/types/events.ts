
export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees?: number;
  contractor_id: string;
  created_at: string;
  updated_at?: string;
  service_type: string;
  status: EventStatus;
  creator?: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  } | null;
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
