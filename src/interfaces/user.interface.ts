export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
  status: boolean;
  created_at: string;
  updated_at?: string | null;
  loginAttempts?: number;
}
