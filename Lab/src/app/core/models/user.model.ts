export interface User {
  id: number;
  uid: string;
  fullName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatarUrl?: string;
}
