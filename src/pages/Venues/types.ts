
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
}
