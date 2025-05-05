
export interface Venue {
  id: string;
  name: string;
  description?: string;
  min_capacity: number;
  max_capacity: number;
  event_types: string[];
  address: string;
  city: string;
  state: string;
  zipcode: string;
  neighborhood?: string;
  amenities: Record<string, boolean>;
  price_min?: number;
  price_max?: number;
  price_type: string;
  terms_conditions?: string;
  is_approved: boolean;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface VenueImage {
  id: string;
  venue_id: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface VenueMetrics {
  id: string;
  venue_id: string;
  views: number;
  contact_requests: number;
  last_updated: string;
}
