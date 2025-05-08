
export interface VenueAnnouncement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  venue_name: string;
  venue_type: string;
  price_per_hour: number;
  created_at: string;
  views: number;
  address?: string;
  user_id: string;
  social_links?: SocialLink[];
  rating?: number;
  user_venues?: {
    zipcode: string;
    city: string;
    state: string;
  };
}

export interface SocialLink {
  type: string;
  url: string;
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
  user_name: string;
  user_avatar?: string;
  owner_response?: {
    response: string;
    created_at: string;
  };
}
