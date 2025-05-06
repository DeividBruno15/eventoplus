
import { Rating, RatingWithUser } from '@/types/ratings';

export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  person_type?: string;
  document_number?: string;
  role: 'contractor' | 'provider' | 'advertiser';
  address?: string | null;
  city?: string;
  state?: string;
  bio?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  zipcode?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  companies?: Array<{
    id: string;
    name: string;
  }>;
  services?: Array<{
    id: string;
    category: string;
  }>;
}

export {
  type Rating,
  type RatingWithUser
};
