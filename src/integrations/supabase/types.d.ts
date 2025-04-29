
import { Database as DatabaseOriginal } from '@/integrations/supabase/types';

// Extend the original Database type to include the user_companies table
export interface UserCompaniesTable {
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
    created_at?: string;
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
}

// Until the Supabase types are regenerated, we'll use this custom type
export type CustomDatabase = DatabaseOriginal & {
  public: {
    Tables: {
      user_companies: UserCompaniesTable;
    } & DatabaseOriginal['public']['Tables'];
  };
};

// Export a helper type for components that need to use the UserCompany type
export type UserCompany = UserCompaniesTable['Row'];
