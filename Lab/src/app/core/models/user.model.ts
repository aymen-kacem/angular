export interface User {
  id: string | number;
  uid: string;
  fullName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatarUrl?: string;
}
