
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
      } & DatabaseOriginal['public']['Tables'];
    };
  };
};
