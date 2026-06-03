export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code: string) {
    super(message);
  }
}

export class AttendanceWindowError extends AppError {
  constructor(message = 'Attendance submission is outside the allowed time window.') {
    super(422, message, 'AttendanceWindowError');
  }
}

export class DuplicateAttendanceError extends AppError {
  constructor(message = 'You have already submitted attendance for this session.') {
    super(409, message, 'DuplicateAttendanceError');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UnauthorizedError');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message, 'ForbiddenError');
  }
}
