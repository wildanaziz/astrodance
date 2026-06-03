import { pgTable, uuid, varchar, text, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'student']);
export const sessionStatusEnum = pgEnum('session_status', ['active', 'closed']);
export const modeEnum = pgEnum('mode', ['luring', 'daring']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  nim: varchar('nim', { length: 15 }).unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull().default('student'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  adminId: uuid('admin_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const studentClasses = pgTable('student_classes', {
  studentId: uuid('student_id').notNull().references(() => users.id),
  classId: uuid('class_id').notNull().references(() => classes.id),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [unique().on(t.studentId, t.classId)]);

export const attendanceSessions = pgTable('attendance_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  classId: uuid('class_id').notNull().references(() => classes.id),
  name: varchar('name', { length: 255 }),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: sessionStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => attendanceSessions.id),
  studentId: uuid('student_id').notNull().references(() => users.id),
  mode: modeEnum('mode').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [unique().on(t.sessionId, t.studentId)]);
