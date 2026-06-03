export interface Class {
  id: string;
  name: string;
  description: string | null;
  adminId: string;
  createdAt: Date;
}

export interface StudentClass {
  studentId: string;
  classId: string;
  enrolledAt: Date;
}
