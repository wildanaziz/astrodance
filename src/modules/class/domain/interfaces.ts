import type { Class, StudentClass } from './entities';

export interface EnrolledStudent {
  id: string;
  fullName: string;
  nim: string | null;
  email: string;
}

export interface IClassRepository {
  create(data: Omit<Class, 'id' | 'createdAt'>): Promise<Class>;
  findByAdmin(adminId: string): Promise<Class[]>;
  findById(id: string): Promise<Class | null>;
  enrollStudent(data: Omit<StudentClass, 'enrolledAt'>): Promise<StudentClass>;
  findByStudent(studentId: string): Promise<Class[]>;
  findEnrolledStudents(classId: string): Promise<EnrolledStudent[]>;
}
