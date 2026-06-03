import 'dotenv/config';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { db } from './db';
import { users } from './schema';

const email = process.argv[2] || 'admin@ub.ac.id';
const password = process.argv[3] || 'AdminPass123!';
const fullName = process.argv[4] || 'Admin User';

async function seed() {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length > 0) {
    console.log(`Admin account already exists: ${existing[0].email}`);
    process.exit(0);
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });

  const result = await db.insert(users).values({
    email,
    passwordHash,
    fullName,
    role: 'admin',
    nim: null
  }).returning();

  console.log(`Admin account created:`);
  console.log(`  Email:    ${result[0].email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${result[0].role}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
