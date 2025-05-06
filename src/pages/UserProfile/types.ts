
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
  bio?: string;
  city?: string;
  state?: string;
  role: 'provider' | 'contractor' | 'advertiser';
  companies?: Company[];
  services?: Service[];
}
