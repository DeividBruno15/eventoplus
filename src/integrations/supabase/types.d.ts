
import { Database as DatabaseOriginal } from '@/integrations/supabase/types';

// Extend the original Database type to include the user_companies table
export interface CustomDatabase extends DatabaseOriginal {
  public: {
    Tables: {
      user_companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          zipcode: string;
          street: string;
          number: string;
          neighborhood: string;
          city: string;
          state: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          zipcode: string;
          street: string;
          number: string;
          neighborhood: string;
          city: string;
          state: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          zipcode?: string;
          street?: string;
          number?: string;
          neighborhood?: string;
          city?: string;
          state?: string;
          created_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          min_capacity: number;
          max_capacity: number;
          event_types: string[];
          address: string;
          city: string;
          state: string;
          zipcode: string;
          neighborhood: string | null;
          amenities: Record<string, boolean>;
          price_min: number | null;
          price_max: number | null;
          price_type: string;
          terms_conditions: string | null;
          is_approved: boolean;
          status: string;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          min_capacity: number;
          max_capacity: number;
          event_types: string[];
          address: string;
          city: string;
          state: string;
          zipcode: string;
          neighborhood?: string | null;
          amenities?: Record<string, boolean>;
          price_min?: number | null;
          price_max?: number | null;
          price_type?: string;
          terms_conditions?: string | null;
          is_approved?: boolean;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          min_capacity?: number;
          max_capacity?: number;
          event_types?: string[];
          address?: string;
          city?: string;
          state?: string;
          zipcode?: string;
          neighborhood?: string | null;
          amenities?: Record<string, boolean>;
          price_min?: number | null;
          price_max?: number | null;
          price_type?: string;
          terms_conditions?: string | null;
          is_approved?: boolean;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      venue_images: {
        Row: {
          id: string;
          venue_id: string;
          url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          venue_id?: string;
          url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      venue_metrics: {
        Row: {
          id: string;
          venue_id: string;
          views: number;
          contact_requests: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          views?: number;
          contact_requests?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          venue_id?: string;
          views?: number;
          contact_requests?: number;
          last_updated?: string;
        };
      } & DatabaseOriginal['public']['Tables'];
    };
  };
};
