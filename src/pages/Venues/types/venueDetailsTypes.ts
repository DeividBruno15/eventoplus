
export interface VenueDetails {
  id: string;
  title: string;
  description: string;
  venue_type: string;
  price_per_hour: number;
  max_capacity: number;
  is_rentable: boolean;
  amenities: string[];
  rules: string | null;
  external_link: string | null;
  image_url: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  available_dates: string[];
  user_id: string;
  views: number;
  venue_id: string; // Added venue_id property
  social_links: Array<{
    type: string;
    url: string;
  }> | null;
  venue: {
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  } | null;
}
