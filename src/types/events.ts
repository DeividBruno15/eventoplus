export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  service_type: string;
  max_attendees: number | null;
  contractor_id: string;
  status: string;
  created_at: string;
  contractor?: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
}

export interface Application {
  id: string;
  provider_id: string;
  event_id: string;
  message: string;
  status: string;
  created_at: string;
  provider?: {
    first_name: string;
    last_name: string;
  };
}
