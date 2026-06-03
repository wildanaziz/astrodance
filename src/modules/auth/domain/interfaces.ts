import type { User } from './entities';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByNim(nim: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}

export interface IAuthService {
  registerStudent(data: RegisterStudentDTO): Promise<{ user: User; token: string }>;
  login(data: LoginDTO): Promise<{ user: User; token: string }>;
}

export interface RegisterStudentDTO {
  fullName: string;
  nim: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
