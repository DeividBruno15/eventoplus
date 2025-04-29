
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

export interface CompanyFormValues {
  name: string;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}
