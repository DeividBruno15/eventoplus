
export type Event = {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees?: number;
  contractor_id: string;
  created_at: string;
  updated_at: string | null | undefined; // Ensure optional and nullable
  service_type: string;
  status: EventStatus;
  creator?: {
    first_name: string;
    last_name: string;
    phone_number?: string | null;
  } | null;
}
