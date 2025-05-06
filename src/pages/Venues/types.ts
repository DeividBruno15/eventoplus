
// Tipos para avaliações de venues
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
  user_name?: string;
  user_avatar?: string;
  owner_response?: {
    response: string;
    created_at: string;
  };
}
