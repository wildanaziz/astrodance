import { eq } from 'drizzle-orm';
import { db } from '../../../shared/config/db';
import { users } from '../../../shared/config/schema';
import type { IUserRepository } from '../domain/interfaces';
import type { User } from '../domain/entities';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0] ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0] ?? null;
  }

  async findByNim(nim: string): Promise<User | null> {
    const results = await db.select().from(users).where(eq(users.nim, nim)).limit(1);
    return results[0] ?? null;
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const results = await db.insert(users).values(data).returning();
    return results[0];
  }
}
