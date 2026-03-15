import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Award, Clock, ChevronRight, Play, FileText, Search, BookMarked, CheckCircle, XCircle, GraduationCap, Target, Layers } from 'lucide-react';
import { coursesApi, enrollmentsApi, quizzesApi, lessonsApi } from '../../api';
import { Button, Badge, StatCard, Input, PageLoader, EmptyState, Pagination, SectionHeader, Modal } from '../../components/ui';
import { SkeletonStats, SkeletonCards } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import type { Course, Lesson, Quiz, QuizAttempt, Question } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── Student Dashboard ─────────────────────────────────────
export function StudentDashboardPage() {
  const { user } = useAuthStore();
  const { t } = useUIStore();
  const { data: enrollments, isLoading: enrollLoading } = useQuery({ queryKey: ['my-enrollments'], queryFn: enrollmentsApi.getMyEnrollments });
  const { data: attempts, isLoading: attemptsLoading } = useQuery({ queryKey: ['my-attempts'], queryFn: quizzesApi.getMyAttempts });
  const passedCount = attempts?.filter(a => a.passed).length || 0;
  const totalAttempts = attempts?.length || 0;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '6px' }}>
          {t.dashboard.welcomeBack} <span style={{ color: 'var(--primary)' }}>{user?.firstName}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>{t.dashboard.continueJourney}</p>
      </div>

      {(enrollLoading || attemptsLoading) ? <SkeletonStats count={4} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard label={t.dashboard.enrolledCourses} value={enrollments?.length || 0} icon={<BookOpen size={22} />} color="primary" delay={0} />
          <StatCard label={t.dashboard.quizzesPassed} value={passedCount} icon={<CheckCircle size={22} />} color="success" delay={0.05} />
          <StatCard label={t.dashboard.totalAttempts} value={totalAttempts} icon={<Target size={22} />} color="secondary" delay={0.1} />
          <StatCard label={t.dashboard.passRate} value={totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) + '%' : '—'} icon={<Award size={22} />} color="warning" delay={0.15} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <SectionHeader title={t.dashboard.myCourses} subtitle={t.dashboard.recentlyEnrolled} action={<Link to="/my-courses"><Button variant="ghost" size="sm">{t.common.viewAll}</Button></Link>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {enrollments?.slice(0, 4).map((e, idx) => (
              <Link key={e.id} to={`/courses/${e.courseId}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all var(--transition-base)', animation: `fadeIn 0.3s ease ${idx * 0.05}s both` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}><BookOpen size={17} /></div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.course?._count?.lessons || 0} {t.common.lessons}</p>
                  </div>
                  <ChevronRight size={15} color="var(--text-muted)" />
                </div>
              </Link>
            ))}
            {(!enrollments || enrollments.length === 0) && <EmptyState icon={<BookOpen size={32} />} title={t.dashboard.noCourses} action={<Link to="/courses"><Button size="sm">{t.dashboard.browseCourses}</Button></Link>} />}
          </div>
        </div>

        <div>
          <SectionHeader title={t.dashboard.recentResults} subtitle={t.dashboard.quizAttempts} action={<Link to="/my-results"><Button variant="ghost" size="sm">{t.common.viewAll}</Button></Link>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {attempts?.slice(0, 4).map((a, idx) => (
              <div key={a.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', animation: `fadeIn 0.3s ease ${idx * 0.05}s both` }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: a.passed ? 'var(--success-dim)' : 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.passed ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                  {a.passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.quiz?.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.quiz.yourScore}: {Math.round(a.score || 0)}%</p>
                </div>
                <Badge variant={a.passed ? 'success' : 'danger'}>{a.passed ? t.quiz.pass : t.quiz.fail}</Badge>
              </div>
            ))}
            {(!attempts || attempts.length === 0) && <EmptyState icon={<Award size={32} />} title={t.dashboard.noAttempts} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Browse Courses ─────────────────────────────────────────
export function CoursesPage() {
  const { t } = useUIStore();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['courses', page, search, category], queryFn: () => coursesApi.getAll({ page, limit: 12, search: search || undefined, category: category || undefined }) });
  const enrollMutation = useMutation({ mutationFn: enrollmentsApi.enroll, onSuccess: () => { toast.success(t.common.enrolled + '!'); qc.invalidateQueries({ queryKey: ['my-enrollments'] }); qc.invalidateQueries({ queryKey: ['enrolled'] }); } });

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <SectionHeader title={t.courses.browseTitle} subtitle={`${data?.meta.total || 0} ${t.courses.available}`} />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input placeholder={`${t.common.search}...`} value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }} leftIcon={<Search size={15} />} />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
          <option value="">{t.courses.allCategories}</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Web Development">Web Development</option>
          <option value="Database">Database</option>
          <option value="Programming">Programming</option>
        </select>
        <Button variant="outline" onClick={() => { setSearch(searchInput); setPage(1); }}>{t.common.search}</Button>
      </div>
      {isLoading ? <SkeletonCards count={6} /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {data?.data.map((course, idx) => <CourseCard key={course.id} course={course} delay={idx * 0.03} onEnroll={() => enrollMutation.mutate(course.id)} enrolling={enrollMutation.isPending} />)}
          </div>
          {data?.data.length === 0 && <EmptyState icon={<GraduationCap size={48} />} title={t.courses.noCoursesFound} description={t.courses.browseDesc} />}
          <Pagination page={page} totalPages={data?.meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function CourseCard({ course, delay, onEnroll, enrolling }: { course: Course; delay?: number; onEnroll?: () => void; enrolling?: boolean }) {
  const { t } = useUIStore();
  const { data: enrollCheck } = useQuery({ queryKey: ['enrolled', course.id], queryFn: () => enrollmentsApi.checkEnrollment(course.id) });
  const PALETTE = ['var(--primary)','var(--secondary)','var(--accent)','var(--warning)','var(--success)'];
  const color = PALETTE[course.title.charCodeAt(0) % PALETTE.length];
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all var(--transition-base)', animation: `fadeInUp 0.4s ease ${delay || 0}s both`, display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color}20`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ height: 110, background: `linear-gradient(135deg, ${color}22, ${color}08)`, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <BookOpen size={38} color={color} style={{ opacity: 0.5 }} />
        {course.category && <div style={{ position: 'absolute', top: '10px', right: '10px' }}><Badge variant="neutral">{course.category}</Badge></div>}
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '6px', lineHeight: 1.4 }}>{course.title}</h3>
        {course.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{course.description}</p>}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={12} />{course._count?.lessons || 0} {t.common.lessons}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GraduationCap size={12} />{course._count?.enrollments || 0} {t.common.students}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to={`/courses/${course.id}`} style={{ flex: 1 }}><Button variant="outline" fullWidth size="sm">{t.courses.viewCourse}</Button></Link>
          {!enrollCheck?.enrolled ? <Button size="sm" onClick={onEnroll} loading={enrolling}>{t.courses.enroll}</Button> : <Badge variant="success" dot>{t.courses.enrolled}</Badge>}
        </div>
      </div>
    </div>
  );
}

// ─── Course Detail ──────────────────────────────────────────
export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useUIStore();
  const qc = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data: course, isLoading } = useQuery({ queryKey: ['course', id], queryFn: () => coursesApi.getOne(id!), enabled: !!id });
  const { data: enrollCheck } = useQuery({ queryKey: ['enrolled', id], queryFn: () => enrollmentsApi.checkEnrollment(id!), enabled: !!id });
  const enrollMutation = useMutation({ mutationFn: () => enrollmentsApi.enroll(id!), onSuccess: () => { toast.success(t.common.enrolled + '!'); qc.invalidateQueries({ queryKey: ['enrolled', id] }); } });

  if (isLoading) return <PageLoader />;
  if (!course) return <EmptyState title="Course not found" />;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '1000px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            {course.category && <span style={{ display: 'inline-block', marginBottom: '10px' }}><Badge variant="primary">{course.category}</Badge></span>}
            <h1 style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{course.title}</h1>
            {course.description && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{course.description}</p>}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={15} />{course._count?.lessons || 0} {t.common.lessons}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={15} />{course._count?.enrollments || 0} {t.common.students}</span>
              {course.teacher && <span>{t.common.by} <span style={{ color: 'var(--primary)' }}>{course.teacher.firstName} {course.teacher.lastName}</span></span>}
            </div>
          </div>
          <div>{enrollCheck?.enrolled ? <Badge variant="success" dot size="md">{t.courses.enrolled}</Badge> : <Button loading={enrollMutation.isPending} onClick={() => enrollMutation.mutate()}>{t.courses.enrollNow}</Button>}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>{t.courses.lessons} ({course.lessons?.length || 0})</h2>
      {course.lessons?.length === 0 ? <EmptyState icon={<BookOpen size={32} />} title="No lessons yet" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {course.lessons?.map((lesson, idx) => (
            <LessonRow key={lesson.id} lesson={lesson} index={idx + 1} locked={!enrollCheck?.enrolled}
              onClick={() => enrollCheck?.enrolled ? setSelectedLesson(lesson) : toast.error('Enroll to access lessons')} />
          ))}
        </div>
      )}

      <Modal open={!!selectedLesson} onClose={() => setSelectedLesson(null)} title={selectedLesson?.title} size="lg">
        {selectedLesson && <LessonContent lessonId={selectedLesson.id} />}
      </Modal>
    </div>
  );
}

function LessonRow({ lesson, index, locked, onClick }: { lesson: Lesson; index: number; locked?: boolean; onClick?: () => void }) {
  const { t } = useUIStore();
  return (
    <div onClick={locked ? undefined : onClick}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.6 : 1, transition: 'all var(--transition-base)' }}
      onMouseEnter={e => { if (!locked) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)', flexShrink: 0 }}>{index}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '2px' }}>{lesson.title}</p>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {(lesson._count?.materials || 0) > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FileText size={11} />{lesson._count!.materials} files</span>}
          {(lesson._count?.quizzes || 0) > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Award size={11} />{lesson._count!.quizzes} quiz</span>}
          {lesson.videoUrl && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Play size={11} />Video</span>}
        </div>
      </div>
      {locked ? <span>🔒</span> : <ChevronRight size={15} color="var(--text-muted)" />}
    </div>
  );
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const { data: lesson, isLoading } = useQuery({ queryKey: ['lesson', lessonId], queryFn: () => lessonsApi.getOne(lessonId) });
  if (isLoading) return <PageLoader />;
  if (!lesson) return null;
  return (
    <div>
      {lesson.videoUrl && <div style={{ marginBottom: '20px' }}><a href={lesson.videoUrl} target="_blank" rel="noreferrer"><Button leftIcon={<Play size={15} />} variant="secondary">Watch Video</Button></a></div>}
      {lesson.content && <div dangerouslySetInnerHTML={{ __html: lesson.content }} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '20px' }} />}
      {lesson.materials && lesson.materials.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Materials</h4>
          {lesson.materials.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}>
              <FileText size={15} color="var(--primary)" /><span style={{ fontSize: '0.875rem' }}>{m.filename}</span>
              {m.fileSize && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{(m.fileSize / 1024).toFixed(0)} KB</span>}
            </div>
          ))}
        </div>
      )}
      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Quizzes</h4>
          {lesson.quizzes.map(q => (
            <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: '8px' }}>
              <div><p style={{ fontWeight: 500, marginBottom: '2px' }}>{q.title}</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pass: {q.passingScore}%{q.timeLimit ? ` • ${q.timeLimit} min` : ''}</p></div>
              <Button size="sm" onClick={() => navigate(`/quiz/${q.id}`)}>Take Quiz</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Enrolled Courses ────────────────────────────────────
export function MyCoursesPage() {
  const { t } = useUIStore();
  const { data: enrollments, isLoading } = useQuery({ queryKey: ['my-enrollments'], queryFn: enrollmentsApi.getMyEnrollments });
  if (isLoading) return <SkeletonCards count={6} />;
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <SectionHeader title={t.courses.myCourseTitle} subtitle={`${enrollments?.length || 0} ${t.courses.myCourseDesc}`} />
      {!enrollments?.length ? <EmptyState icon={<BookMarked size={48} />} title={t.courses.notEnrolledTitle} description={t.courses.notEnrolledDesc} action={<Link to="/courses"><Button>{t.dashboard.browseCourses}</Button></Link>} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {enrollments.map((e, idx) => e.course && (
            <Link key={e.id} to={`/courses/${e.courseId}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all var(--transition-base)', animation: `fadeInUp 0.4s ease ${idx * 0.04}s both` }}
                onMouseEnter={el => { (el.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (el.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={el => { (el.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (el.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ height: 80, background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={28} color="var(--primary)" style={{ opacity: 0.7 }} /></div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{e.course.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.course._count?.lessons || 0} {t.common.lessons}</span>
                    <Badge variant="success" dot>{t.courses.enrolled}</Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Quiz Results ─────────────────────────────────────────
export function MyResultsPage() {
  const { t } = useUIStore();
  const [reviewId, setReviewId] = useState<string | null>(null);
  const { data: attempts, isLoading } = useQuery({ queryKey: ['my-attempts'], queryFn: quizzesApi.getMyAttempts });
  const passed = attempts?.filter(a => a.passed).length || 0;
  const failed = attempts?.filter(a => !a.passed).length || 0;

  if (isLoading) return <PageLoader />;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <SectionHeader title={`My ${t.quiz.title} Results`} subtitle={`${attempts?.length || 0} total attempts`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Attempts" value={attempts?.length || 0} icon={<Target size={20} />} color="primary" />
        <StatCard label={t.dashboard.quizzesPassed} value={passed} icon={<CheckCircle size={20} />} color="success" delay={0.05} />
        <StatCard label="Failed" value={failed} icon={<XCircle size={20} />} color="danger" delay={0.1} />
      </div>
      {!attempts?.length ? <EmptyState icon={<Award size={48} />} title={t.dashboard.noAttempts} description="Take quizzes in your enrolled courses" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {attempts.map((a, idx) => (
            <div key={a.id} style={{ background: 'var(--bg-card)', border: `1px solid ${a.passed ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`, borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: a.passed ? 'var(--success-dim)' : 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.passed ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                {a.passed ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, marginBottom: '3px' }}>{a.quiz?.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.quiz.required}: {a.quiz?.passingScore}% • {a.submittedAt ? format(new Date(a.submittedAt), 'MMM d, yyyy HH:mm') : '—'}</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: a.passed ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>{Math.round(a.score || 0)}%</p>
                  <Badge variant={a.passed ? 'success' : 'danger'}>{a.passed ? t.quiz.pass : t.quiz.fail}</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => setReviewId(a.id)}>Review</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!reviewId} onClose={() => setReviewId(null)} title="Quiz Review" size="lg">
        {reviewId && <AttemptReview attemptId={reviewId} />}
      </Modal>
    </div>
  );
}

function AttemptReview({ attemptId }: { attemptId: string }) {
  const { data: attempt, isLoading } = useQuery({ queryKey: ['attempt', attemptId], queryFn: () => quizzesApi.getAttemptDetails(attemptId) });
  if (isLoading) return <PageLoader />;
  if (!attempt) return null;
  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score</p><p style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: attempt.passed ? 'var(--success)' : 'var(--danger)' }}>{Math.round(attempt.score || 0)}%</p></div>
        <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Result</p><Badge variant={attempt.passed ? 'success' : 'danger'} size="md">{attempt.passed ? 'PASSED' : 'FAILED'}</Badge></div>
        <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct</p><p style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{attempt.correctCount}/{attempt.totalQuestions}</p></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {((attempt as any).quiz?.questions || []).map((q: any, idx: number) => {
          const given = attempt.answers?.find(a => a.questionId === q.id);
          const isCorrect = given?.selectedOption?.isCorrect;
          return (
            <div key={q.id} style={{ background: 'var(--bg-elevated)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: isCorrect ? 'var(--success-dim)' : 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCorrect ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                  {isCorrect ? <CheckCircle size={13} /> : <XCircle size={13} />}
                </div>
                <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{idx + 1}. {q.text}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '32px' }}>
                {q.answerOptions?.map((opt: any) => {
                  const wasSelected = given?.selectedOptionId === opt.id;
                  return (
                    <div key={opt.id} style={{ padding: '7px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', background: opt.isCorrect ? 'var(--success-dim)' : wasSelected && !opt.isCorrect ? 'var(--danger-dim)' : 'var(--bg-card)', border: `1px solid ${opt.isCorrect ? 'rgba(16,185,129,0.3)' : wasSelected && !opt.isCorrect ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`, color: opt.isCorrect ? 'var(--success)' : wasSelected && !opt.isCorrect ? 'var(--danger)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{opt.isCorrect ? '✓' : wasSelected && !opt.isCorrect ? '✗' : '·'}</span>
                      <span>{opt.text}</span>
                      {wasSelected && !opt.isCorrect && <Badge variant="danger" size="sm">Your answer</Badge>}
                      {wasSelected && opt.isCorrect && <Badge variant="success" size="sm">Your answer</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quiz Page ──────────────────────────────────────────────
export function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useUIStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: quiz, isLoading } = useQuery({ queryKey: ['quiz-student', id], queryFn: () => quizzesApi.getOne(id!), enabled: !!id });

  React.useEffect(() => {
    if (quiz?.timeLimit && !result) {
      setTimeLeft(quiz.timeLimit * 60);
      const interval = setInterval(() => setTimeLeft(p => p !== null && p > 0 ? p - 1 : 0), 1000);
      return () => clearInterval(interval);
    }
  }, [quiz?.id]);

  const submitMutation = useMutation({ mutationFn: (a: {questionId:string; selectedOptionId:string}[]) => quizzesApi.submitAttempt(id!, a), onSuccess: setResult });

  if (isLoading) return <PageLoader />;
  if (!quiz) return <EmptyState title="Quiz not found" />;

  const answeredCount = Object.keys(answers).length;
  const totalQ = quiz.questions?.length || 0;

  if (result) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ background: 'var(--bg-card)', border: `2px solid ${result.passed ? 'var(--success)' : 'var(--danger)'}`, borderRadius: 'var(--radius-xl)', padding: '40px', textAlign: 'center', boxShadow: `0 0 40px ${result.passed ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}` }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{result.passed ? '🎉' : '😔'}</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: result.passed ? 'var(--success)' : 'var(--danger)' }}>{result.passed ? t.quiz.congratulations : t.quiz.notQuite}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>{result.passed ? t.quiz.passedMessage : `${t.quiz.required}: ${quiz.passingScore}%`}</p>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '28px', display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{l: t.quiz.yourScore, v: `${Math.round(result.score||0)}%`, c: result.passed ? 'var(--success)' : 'var(--danger)'},{l: t.quiz.correctAnswers, v: `${result.correctCount}/${result.totalQuestions}`, c: 'var(--text-secondary)'},{l: t.quiz.required, v: `${quiz.passingScore}%`, c: 'var(--primary)'}].map(({l,v,c})=>(
              <div key={l}><p style={{fontSize:'2.5rem',fontWeight:800,fontFamily:'var(--font-display)',color:c,lineHeight:1}}>{v}</p><p style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:'4px'}}>{l}</p></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={() => navigate(-1)}>{t.quiz.backToLesson}</Button>
            <Button onClick={() => navigate('/my-results')}>{t.quiz.viewResults}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '22px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '3px' }}>{quiz.title}</h1>
          {quiz.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{quiz.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {timeLeft !== null && <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: timeLeft < 60 ? 'var(--danger)' : 'var(--primary)', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} />{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>}
          <Badge variant="info">{answeredCount}/{totalQ} {t.quiz.answered}</Badge>
          <Badge variant="warning">{t.quiz.required_pct}: {quiz.passingScore}%</Badge>
        </div>
      </div>
      <div style={{ background: 'var(--bg-elevated)', height: 5, borderRadius: 3, marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,var(--primary),var(--accent))', width: `${totalQ > 0 ? (answeredCount/totalQ)*100 : 0}%`, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
        {quiz.questions?.map((q, qi) => <QuestionCard key={q.id} question={q} index={qi+1} selectedOption={answers[q.id]} onSelect={optId => setAnswers(p=>({...p,[q.id]:optId}))} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="ghost" onClick={() => navigate(-1)}>{t.common.cancel}</Button>
        <Button loading={submitMutation.isPending} disabled={answeredCount === 0} onClick={() => submitMutation.mutate(Object.entries(answers).map(([questionId,selectedOptionId])=>({questionId,selectedOptionId})))} size="lg">
          {t.quiz.submitQuiz} ({answeredCount}/{totalQ})
        </Button>
      </div>
    </div>
  );
}

function QuestionCard({ question, index, selectedOption, onSelect }: { question: Question; index: number; selectedOption?: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px', animation: `fadeInUp 0.3s ease ${index*0.03}s both` }}>
      <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '0.95rem', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginRight: '8px' }}>{String(index).padStart(2,'0')}.</span>
        {question.text}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {question.answerOptions?.map(opt => {
          const selected = selectedOption === opt.id;
          return (
            <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`, background: selected ? 'var(--primary-dim)' : 'var(--bg-elevated)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
              <div style={{ width: 19, height: 19, borderRadius: '50%', border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`, background: selected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--transition-fast)' }}>
                {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bg-base)' }} />}
              </div>
              <input type="radio" name={`q-${question.id}`} value={opt.id} checked={selected} onChange={() => onSelect(opt.id)} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.9rem', color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{opt.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
