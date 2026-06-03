import { hashPassword, verifyPassword } from '../../../shared/utils/password';
import { signJWT } from '../../../shared/utils/jwt';
import { isValidNIM, isValidEmail } from '../../../shared/utils/validators';
import { AppError } from '../../../shared/utils/errors';
import type { IAuthService, IUserRepository, RegisterStudentDTO, LoginDTO } from '../domain/interfaces';
import type { User } from '../domain/entities';

export class AuthService implements IAuthService {
  constructor(private repo: IUserRepository) {}

  async registerStudent(data: RegisterStudentDTO): Promise<{ user: User; token: string }> {
    if (!isValidNIM(data.nim)) throw new AppError(400, 'NIM must be 15 digits', 'ValidationError');
    if (!isValidEmail(data.email)) throw new AppError(400, 'Invalid email', 'ValidationError');
    if (data.password.length < 8) throw new AppError(400, 'Password must be at least 8 characters', 'ValidationError');

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new AppError(409, 'Email already registered', 'ConflictError');

    const passwordHash = await hashPassword(data.password);
    const user = await this.repo.create({
      nim: data.nim,
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: 'student'
    });

    const token = await signJWT({ sub: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new AppError(401, 'Invalid credentials', 'UnauthorizedError');

    const valid = await verifyPassword(user.passwordHash, data.password);
    if (!valid) throw new AppError(401, 'Invalid credentials', 'UnauthorizedError');

    const token = await signJWT({ sub: user.id, email: user.email, role: user.role });
    return { user, token };
  }
}
