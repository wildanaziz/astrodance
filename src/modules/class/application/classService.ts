import type { IClassRepository, EnrolledStudent } from '../domain/interfaces';
import type { Class, StudentClass } from '../domain/entities';

export class ClassService {
  constructor(private repo: IClassRepository) {}

  async createClass(adminId: string, name: string, description?: string): Promise<Class> {
    return this.repo.create({ name, description: description || null, adminId });
  }

  async listAdminClasses(adminId: string): Promise<Class[]> {
    return this.repo.findByAdmin(adminId);
  }

  async getClassDetails(id: string): Promise<Class | null> {
    return this.repo.findById(id);
  }

  async enrollStudent(classId: string, studentId: string): Promise<StudentClass> {
    return this.repo.enrollStudent({ classId, studentId });
  }

  async listStudentClasses(studentId: string): Promise<Class[]> {
    return this.repo.findByStudent(studentId);
  }

  async listEnrolledStudents(classId: string): Promise<EnrolledStudent[]> {
    return this.repo.findEnrolledStudents(classId);
  }
}
