// Auth
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isActive: boolean;
  isBlocked: boolean;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  _count?: { enrollments: number; coursesAsTeacher: number };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

// Course
export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  isPublished: boolean;
  thumbnail?: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher?: { id: string; firstName: string; lastName: string; email?: string };
  lessons?: Lesson[];
  _count?: { lessons: number; enrollments: number };
}

// Lesson
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  materials?: Material[];
  quizzes?: Quiz[];
  course?: { id: string; title: string; teacherId: string };
  _count?: { materials: number; quizzes: number };
}

// Material
export interface Material {
  id: string;
  lessonId: string;
  filename: string;
  filePath: string;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
}

// Quiz
export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  lesson?: { id: string; title: string; courseId: string };
  _count?: { questions: number; attempts: number };
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  order: number;
  answerOptions?: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score?: number;
  totalScore?: number;
  passed?: boolean;
  startedAt: string;
  submittedAt?: string;
  correctCount?: number;
  totalQuestions?: number;
  quiz?: { id: string; title: string; passingScore: number };
  student?: { id: string; firstName: string; lastName: string; email?: string };
  answers?: {
    id: string;
    questionId: string;
    selectedOptionId: string;
    question?: Question;
    selectedOption?: AnswerOption;
  }[];
}

// Enrollment
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  course?: Course;
  student?: { id: string; firstName: string; lastName: string; email: string };
}

// Security
export type SecurityEventType =
  | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'REFRESH_TOKEN'
  | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE' | 'PASSWORD_CHANGE'
  | 'EMAIL_VERIFICATION' | 'ACCOUNT_BLOCKED' | 'ACCOUNT_UNBLOCKED' | 'ROLE_CHANGE'
  | 'RATE_LIMIT_TRIGGERED' | 'SUSPICIOUS_REQUEST' | 'ACCESS_DENIED'
  | 'BRUTE_FORCE_DETECTED' | 'SESSION_REVOKED';

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  occurredAt: string;
  user?: { id: string; email: string; firstName: string; lastName: string };
}

// Session
export interface Session {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  isRevoked: boolean;
  createdAt: string;
  user?: User;
}

// Audit
export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  targetEntity?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
  user?: { id: string; email: string; firstName: string; lastName: string };
}

// Analytics
export interface DashboardMetrics {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    activeSessions: number;
    blockedUsers: number;
  };
  security: {
    failedLogins24h: number;
    failedLogins7d: number;
    totalSecurityEvents24h: number;
  };
  recentSecurityEvents: SecurityEvent[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
