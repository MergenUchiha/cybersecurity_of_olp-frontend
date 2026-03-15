import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AppLayout, AuthLayout } from './components/layout/Layout';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/auth/AuthPages';
import { StudentDashboardPage, CoursesPage, CourseDetailPage, MyCoursesPage, MyResultsPage, QuizPage } from './pages/student/StudentPages';
import { TeacherDashboardPage, TeacherCoursesPage, CourseEditPage } from './pages/teacher/TeacherPages';
import { AdminDashboardPage, AdminUsersPage, AdminCoursesPage, SecurityEventsPage, AdminSessionsPage, AuditLogsPage, AnalyticsPage } from './pages/admin/AdminPages';
import { ProfilePage, MySessionsPage } from './pages/profile/ProfilePages';
import { NotFoundPage } from './pages/NotFound';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './lib/uiStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ role, children }: { role: 'ADMIN' | 'TEACHER'; children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role && !(role === 'TEACHER' && user.role === 'ADMIN')) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function RedirectByRole() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { theme } = useUIStore();

  // Sync theme on mount — only call if it differs from what the inline script already set
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current !== theme) {
      useUIStore.getState().setTheme(theme);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ FIX: React Router v6 future flags to silence warnings */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<RedirectByRole />} />
            {/* Student */}
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/my-results" element={<MyResultsPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            {/* Teacher */}
            <Route path="/teacher" element={<RequireRole role="TEACHER"><TeacherDashboardPage /></RequireRole>} />
            <Route path="/teacher/courses" element={<RequireRole role="TEACHER"><TeacherCoursesPage /></RequireRole>} />
            <Route path="/teacher/courses/:id" element={<RequireRole role="TEACHER"><CourseEditPage /></RequireRole>} />
            {/* Admin */}
            <Route path="/admin" element={<RequireRole role="ADMIN"><AdminDashboardPage /></RequireRole>} />
            <Route path="/admin/users" element={<RequireRole role="ADMIN"><AdminUsersPage /></RequireRole>} />
            <Route path="/admin/courses" element={<RequireRole role="ADMIN"><AdminCoursesPage /></RequireRole>} />
            <Route path="/admin/security" element={<RequireRole role="ADMIN"><SecurityEventsPage /></RequireRole>} />
            <Route path="/admin/sessions" element={<RequireRole role="ADMIN"><AdminSessionsPage /></RequireRole>} />
            <Route path="/admin/audit-logs" element={<RequireRole role="ADMIN"><AuditLogsPage /></RequireRole>} />
            <Route path="/admin/analytics" element={<RequireRole role="ADMIN"><AnalyticsPage /></RequireRole>} />
            {/* Shared */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sessions" element={<MySessionsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" toastOptions={{
        duration: 3500,
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          boxShadow: 'var(--shadow-lg)',
        },
        success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--bg-elevated)' } },
        error:   { iconTheme: { primary: 'var(--danger)',  secondary: 'var(--bg-elevated)' } },
      }} />
    </QueryClientProvider>
  );
}
