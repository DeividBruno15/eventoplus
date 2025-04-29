
export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  role: 'contractor' | 'provider';
  avatar_url: string | null;
  bio: string | null;
  city?: string;
  state?: string;
  companies?: Array<{
    id: string;
    name: string;
  }>;
  services?: Array<{
    id: string;
    category: string;
  }>;
}

export interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  event_date: string;
  location: string;
  image_url?: string;
}
