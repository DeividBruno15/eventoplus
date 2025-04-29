export interface UserCompany {
  id: string;
  user_id: string;
  name: string;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  person_type: string;
  document_number: string;
  role: 'contractor' | 'provider';
  address?: string | null;
  city: string;
  state: string;
  bio?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  zipcode?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  companies?: UserCompany[];
  email?: string;
}

export interface UserProfileWithRating extends UserProfile {
  average_rating?: number;
  rating_count?: number;
  event_count?: number;
}

export interface UserRating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewer_avatar?: string | null;
}
