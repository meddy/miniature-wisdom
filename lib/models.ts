export interface Tag {
  id: number;
  name: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  is_admin: boolean;
}
