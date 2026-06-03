export interface User {
  id: string;
  nim: string | null;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'student';
  createdAt: Date;
}
