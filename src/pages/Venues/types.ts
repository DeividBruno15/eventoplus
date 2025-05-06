
export interface VenueAnnouncement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  venue_name: string;
  created_at: string;
  views: number;
  venue_type: string;
  price_per_hour: number;
  address?: string;
  social_links?: {
    type: string;
    url: string;
  }[];
  rating?: number | null;
  ratings_count?: number;
  detailed_ratings?: {
    location: number;
    value: number;
    service: number;
    cleanliness: number;
    amenities: number;
  };
  available_dates?: string[];
}

export interface VenueRating {
  id: string;
  venue_id: string;
  user_id: string;
  overall_rating: number;
  location_rating?: number;
  value_rating?: number;
  service_rating?: number;
  cleanliness_rating?: number;
  amenities_rating?: number;
  comment: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  owner_response?: {
    response: string;
    created_at: string;
  };
}

export interface VenueFiltersState {
  searchQuery: string;
  venueType: string | undefined;
  minRating: string | undefined; 
  priceRange: [number, number];
  sortBy: string;
  amenities?: string[];
  location?: {
    city?: string;
    state?: string;
    zipcode?: string;
  };
  maxDistance?: number;
}
