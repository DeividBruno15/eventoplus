
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
  // Extended properties from database
  zipcode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export type EventStatus = 'open' | 'closed' | 'published' | 'draft' | 'cancelled';

export interface ExtendedServiceRequest {
  id?: string;
  category: string;
  count: number;
  price: number;
  filled?: number;
  service_type?: string;
  description?: string;
}

export interface ServiceRequest {
  id: string;
  service_type: string;
  description?: string;
  // Extended properties for UI
  category?: string;
  count?: number;
  price?: number;
  filled?: number;
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

// Interfaces para o formulário de criação de eventos
export interface CreateEventFormData {
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  street: string;
  number: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  location?: string;
  company_id?: string;
  service_requests?: ExtendedServiceRequest[];
  image?: File | null;
}
