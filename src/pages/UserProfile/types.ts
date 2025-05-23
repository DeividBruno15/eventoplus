
export interface Company {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  category: string;
}

export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string;
  bio?: string | null;
  city?: string;
  state?: string;
  role: 'provider' | 'contractor' | 'advertiser';
  companies?: Company[];
  services?: Service[];
  phone_number?: string | null;
  whatsapp_opt_in?: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  image_url?: string;
  status: 'open' | 'closed' | 'published' | 'draft';
}

