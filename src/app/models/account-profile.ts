import { Profile } from "./profile";

export interface AccountProfile {
  id?: string;
  email: string;
  password: string;
  account_id: string;
  purchase_date: string; 
  renewal_date: string;
  profiles: Profile[];
}