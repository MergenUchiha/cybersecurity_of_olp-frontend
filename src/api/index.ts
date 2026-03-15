import api from '../lib/axios';
import type {
  LoginResponse, User, Course, Lesson, Quiz, QuizAttempt,
  Enrollment, SecurityEvent, Session, AuditLog,
  DashboardMetrics, PaginatedResponse, Material,
} from '../types';

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post<{ message: string; userId: string }>('/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', data).then(r => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then(r => r.data),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then(r => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data).then(r => r.data),

  requestPasswordReset: (email: string) =>
    api.post('/auth/request-password-reset', { email }).then(r => r.data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data).then(r => r.data),

  verifyEmail: (token: string) =>
    api.get('/auth/verify-email', { params: { token } }).then(r => r.data),

  getProfile: () =>
    api.get<User>('/auth/profile').then(r => r.data),
};

// ─── Users ───────────────────────────────────────────────
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    api.get<PaginatedResponse<User>>('/users', { params }).then(r => r.data),

  getOne: (id: string) =>
    api.get<User>(`/users/${id}`).then(r => r.data),

  getProfile: () =>
    api.get<User>('/users/profile').then(r => r.data),

  updateProfile: (data: { firstName?: string; lastName?: string; avatarUrl?: string }) =>
    api.patch<User>('/users/profile', data).then(r => r.data),

  block: (id: string) =>
    api.patch(`/users/${id}/block`).then(r => r.data),

  unblock: (id: string) =>
    api.patch(`/users/${id}/unblock`).then(r => r.data),

  changeRole: (id: string, role: string) =>
    api.patch(`/users/${id}/role`, { role }).then(r => r.data),

  toggleActive: (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/toggle-active`, { isActive }).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/users/${id}`).then(r => r.data),
};

// ─── Courses ─────────────────────────────────────────────
export const coursesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
    api.get<PaginatedResponse<Course>>('/courses', { params }).then(r => r.data),

  getMyCourses: () =>
    api.get<Course[]>('/courses/my-courses').then(r => r.data),

  getOne: (id: string) =>
    api.get<Course>(`/courses/${id}`).then(r => r.data),

  create: (data: { title: string; description?: string; category?: string }) =>
    api.post<Course>('/courses', data).then(r => r.data),

  update: (id: string, data: { title?: string; description?: string; category?: string }) =>
    api.patch<Course>(`/courses/${id}`, data).then(r => r.data),

  togglePublish: (id: string) =>
    api.patch<Course>(`/courses/${id}/toggle-publish`).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/courses/${id}`).then(r => r.data),
};

// ─── Lessons ─────────────────────────────────────────────
export const lessonsApi = {
  getByCourse: (courseId: string) =>
    api.get<Lesson[]>(`/lessons/course/${courseId}`).then(r => r.data),

  getOne: (id: string) =>
    api.get<Lesson>(`/lessons/${id}`).then(r => r.data),

  create: (courseId: string, data: { title: string; content?: string; videoUrl?: string; order?: number }) =>
    api.post<Lesson>(`/lessons/${courseId}`, data).then(r => r.data),

  update: (id: string, data: { title?: string; content?: string; videoUrl?: string; order?: number }) =>
    api.patch<Lesson>(`/lessons/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/lessons/${id}`).then(r => r.data),

  reorder: (courseId: string, lessonIds: string[]) =>
    api.patch(`/lessons/course/${courseId}/reorder`, { lessonIds }).then(r => r.data),

  uploadMaterial: (lessonId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Material>(`/lessons/${lessonId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

// ─── Quizzes ─────────────────────────────────────────────
export const quizzesApi = {
  getOne: (id: string) =>
    api.get<Quiz>(`/quizzes/${id}`).then(r => r.data),

  create: (lessonId: string, data: { title: string; description?: string; passingScore?: number; timeLimit?: number }) =>
    api.post<Quiz>(`/quizzes/lesson/${lessonId}`, data).then(r => r.data),

  update: (id: string, data: { title?: string; description?: string; passingScore?: number }) =>
    api.patch<Quiz>(`/quizzes/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/quizzes/${id}`).then(r => r.data),

  addQuestion: (quizId: string, data: { text: string; order?: number; answerOptions: { text: string; isCorrect: boolean }[] }) =>
    api.post(`/quizzes/${quizId}/questions`, data).then(r => r.data),

  deleteQuestion: (questionId: string) =>
    api.delete(`/quizzes/questions/${questionId}`).then(r => r.data),

  submitAttempt: (quizId: string, answers: { questionId: string; selectedOptionId: string }[]) =>
    api.post<QuizAttempt>(`/quizzes/${quizId}/submit`, { answers }).then(r => r.data),

  getAttempts: (quizId: string) =>
    api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`).then(r => r.data),

  getMyAttempts: () =>
    api.get<QuizAttempt[]>('/quizzes/my-attempts/all').then(r => r.data),

  getAttemptDetails: (attemptId: string) =>
    api.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`).then(r => r.data),
};

// ─── Enrollments ─────────────────────────────────────────
export const enrollmentsApi = {
  enroll: (courseId: string) =>
    api.post<Enrollment>(`/enrollments/${courseId}`).then(r => r.data),

  unenroll: (courseId: string) =>
    api.delete(`/enrollments/${courseId}`).then(r => r.data),

  getMyEnrollments: () =>
    api.get<Enrollment[]>('/enrollments/my-courses').then(r => r.data),

  getCourseEnrollments: (courseId: string) =>
    api.get<Enrollment[]>(`/enrollments/course/${courseId}`).then(r => r.data),

  checkEnrollment: (courseId: string) =>
    api.get<{ enrolled: boolean }>(`/enrollments/check/${courseId}`).then(r => r.data),
};

// ─── Security Events ─────────────────────────────────────
export const securityApi = {
  getAll: (params?: {
    page?: number; limit?: number; eventType?: string;
    userId?: string; ipAddress?: string; startDate?: string; endDate?: string;
  }) =>
    api.get<PaginatedResponse<SecurityEvent>>('/security-events', { params }).then(r => r.data),

  getRecent: (limit?: number) =>
    api.get<SecurityEvent[]>('/security-events/recent', { params: { limit } }).then(r => r.data),
};

// ─── Sessions ─────────────────────────────────────────────
export const sessionsApi = {
  getMySessions: () =>
    api.get<Session[]>('/sessions/my-sessions').then(r => r.data),

  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Session>>('/sessions', { params }).then(r => r.data),

  revoke: (id: string) =>
    api.patch(`/sessions/${id}/revoke`).then(r => r.data),

  revokeAllUser: (userId: string) =>
    api.patch(`/sessions/user/${userId}/revoke-all`).then(r => r.data),
};

// ─── Audit Logs ───────────────────────────────────────────
export const auditApi = {
  getAll: (params?: {
    page?: number; limit?: number; action?: string;
    userId?: string; startDate?: string; endDate?: string;
  }) =>
    api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params }).then(r => r.data),
};

// ─── Analytics ────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: () =>
    api.get<DashboardMetrics>('/analytics/dashboard').then(r => r.data),

  getFailedLogins: (days?: number) =>
    api.get<{ date: string; count: number }[]>('/analytics/failed-logins', { params: { days } }).then(r => r.data),

  getEventsByType: (days?: number) =>
    api.get<{ eventType: string; count: number }[]>('/analytics/events-by-type', { params: { days } }).then(r => r.data),

  getEventsByRole: (days?: number) =>
    api.get<{ role: string; count: number }[]>('/analytics/events-by-role', { params: { days } }).then(r => r.data),

  getUserStats: () =>
    api.get<{ role: string; count: number }[]>('/analytics/user-stats').then(r => r.data),

  getBlockingStats: (days?: number) =>
    api.get<{ blocked: number; bruteForce: number; rateLimited: number }>('/analytics/blocking-stats', { params: { days } }).then(r => r.data),
};
