import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Users, Layers,
  GraduationCap, ChevronRight, Save, ArrowLeft, Award, FileText, Link2,
  LayoutDashboard, Move, Sparkles,
} from 'lucide-react';
import { coursesApi, lessonsApi, quizzesApi, enrollmentsApi } from '../../api';
import {
  Button, Badge, StatCard, Input, Textarea, Select, PageLoader, EmptyState,
  SectionHeader, Modal, ConfirmDialog, Table,
} from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import type { Course, Lesson, Quiz } from '../../types';
import toast from 'react-hot-toast';

// ─── Teacher Dashboard ───────────────────────────────────
export function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: coursesApi.getMyCourses,
  });

  const published = courses?.filter(c => c.isPublished).length || 0;
  const totalStudents = courses?.reduce((s, c) => s + (c._count?.enrollments || 0), 0) || 0;
  const totalLessons = courses?.reduce((s, c) => s + (c._count?.lessons || 0), 0) || 0;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '6px' }}>
          Welcome, <span style={{ color: 'var(--warning)' }}>{user?.firstName}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your courses and track student progress</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="My Courses" value={courses?.length || 0} icon={<BookOpen size={22} />} color="warning" />
        <StatCard label="Published" value={published} icon={<Eye size={22} />} color="success" delay={0.05} />
        <StatCard label="Total Students" value={totalStudents} icon={<Users size={22} />} color="primary" delay={0.1} />
        <StatCard label="Total Lessons" value={totalLessons} icon={<Layers size={22} />} color="secondary" delay={0.15} />
      </div>

      <SectionHeader title="My Courses" subtitle="Recently created"
        action={<Link to="/teacher/courses"><Button leftIcon={<BookOpen size={16} />}>Manage Courses</Button></Link>}
      />

      {isLoading ? <PageLoader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {courses?.slice(0, 6).map((course, idx) => (
            <TeacherCourseCard key={course.id} course={course} delay={idx * 0.03} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherCourseCard({ course, delay }: { course: Course; delay?: number }) {
  return (
    <Link to={`/teacher/courses/${course.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '18px',
        transition: 'all var(--transition-base)',
        animation: `fadeInUp 0.4s ease ${delay || 0}s both`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--warning)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.9375rem', lineHeight: 1.4, flex: 1, marginRight: '8px' }}>{course.title}</h3>
          <Badge variant={course.isPublished ? 'success' : 'neutral'} dot>
            {course.isPublished ? 'Live' : 'Draft'}
          </Badge>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{course._count?.lessons || 0} lessons</span>
          <span>{course._count?.enrollments || 0} students</span>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>
    </Link>
  );
}

// ─── Teacher Courses Manager ─────────────────────────────
export function TeacherCoursesPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{
    title: string; description: string; category: string;
  }>();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: coursesApi.getMyCourses,
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      toast.success('Course created!');
      qc.invalidateQueries({ queryKey: ['my-courses'] });
      reset(); setCreateOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: coursesApi.togglePublish,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-courses'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      toast.success('Course deleted');
      qc.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });

  const columns = [
    {
      key: 'title',
      header: 'Course',
      render: (c: Course) => (
        <div>
          <p style={{ fontWeight: 500 }}>{c.title}</p>
          {c.category && <Badge variant="neutral">{c.category}</Badge>}
        </div>
      ),
    },
    {
      key: 'stats',
      header: 'Stats',
      render: (c: Course) => (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{c._count?.lessons || 0} lessons</span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>{c._count?.enrollments || 0} students</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Course) => <Badge variant={c.isPublished ? 'success' : 'neutral'} dot>{c.isPublished ? 'Published' : 'Draft'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c: Course) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/teacher/courses/${c.id}`}>
            <Button size="sm" variant="outline" leftIcon={<Edit size={14} />}>Edit</Button>
          </Link>
          <Button size="sm" variant={c.isPublished ? 'ghost' : 'success'}
            loading={toggleMutation.isPending}
            onClick={(e) => { e.stopPropagation(); toggleMutation.mutate(c.id); }}
            leftIcon={c.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}>
            {c.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button size="sm" variant="danger"
            onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}
            leftIcon={<Trash2 size={14} />}>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <SectionHeader title="My Courses" subtitle={`${courses?.length || 0} courses`}
        action={
          <Button leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
            New Course
          </Button>
        }
      />

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Table columns={columns} data={courses || []} loading={isLoading} emptyMessage="No courses yet" />
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); reset(); }} title="Create New Course">
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input label="Course Title *" placeholder="e.g. Introduction to Cybersecurity" {...register('title', { required: true })} />
          <Textarea label="Description" placeholder="Describe what students will learn..." {...register('description')} />
          <Input label="Category" placeholder="e.g. Cybersecurity, Web Dev, Database" {...register('category')} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => { setCreateOpen(false); reset(); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Create Course</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteMutation.mutate(deleteId!); setDeleteId(null); }}
        title="Delete Course" message="This will permanently delete the course and all its lessons, quizzes, and enrollments. This cannot be undone."
        confirmLabel="Delete" danger
      />
    </div>
  );
}

// ─── Course Edit Page ────────────────────────────────────
export function CourseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addQuizLessonId, setAddQuizLessonId] = useState<string | null>(null);
  const [addQuestionQuizId, setAddQuestionQuizId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getOne(id!),
    enabled: !!id,
  });

  const { register: regEdit, handleSubmit: submitEdit } = useForm<{
    title: string; description: string; category: string;
  }>({ values: { title: course?.title || '', description: course?.description || '', category: course?.category || '' } });

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; description?: string; category?: string }) =>
      coursesApi.update(id!, data),
    onSuccess: () => { toast.success('Updated!'); qc.invalidateQueries({ queryKey: ['course', id] }); setEditMode(false); },
  });

  const toggleMutation = useMutation({
    mutationFn: () => coursesApi.togglePublish(id!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course', id] }),
  });

  const addLessonMutation = useMutation({
    mutationFn: (data: { title: string; content: string; videoUrl: string }) =>
      lessonsApi.create(id!, data),
    onSuccess: () => { toast.success('Lesson added!'); qc.invalidateQueries({ queryKey: ['course', id] }); setAddLessonOpen(false); },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course', id] }),
  });

  const { register: regLesson, handleSubmit: submitLesson, reset: resetLesson } = useForm<{
    title: string; content: string; videoUrl: string;
  }>();

  if (isLoading) return <PageLoader />;
  if (!course) return <EmptyState title="Course not found" />;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '900px' }}>
      {/* Back */}
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}
        onClick={() => navigate('/teacher/courses')} style={{ marginBottom: '20px' }}>
        Back to Courses
      </Button>

      {/* Course header */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '24px',
      }}>
        {editMode ? (
          <form onSubmit={submitEdit(d => updateMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Title" {...regEdit('title', { required: true })} />
            <Textarea label="Description" {...regEdit('description')} />
            <Input label="Category" {...regEdit('category')} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="submit" loading={updateMutation.isPending} leftIcon={<Save size={14} />}>Save</Button>
              <Button type="button" variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                {course.category && <Badge variant="primary">{course.category}</Badge>}
                <h1 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{course.title}</h1>
                {course.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>{course.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Badge variant={course.isPublished ? 'success' : 'neutral'} dot size="md">
                  {course.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <Button size="sm" variant="outline" leftIcon={<Edit size={14} />} onClick={() => setEditMode(true)}>Edit</Button>
                <Button size="sm" variant={course.isPublished ? 'ghost' : 'primary'}
                  loading={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate()}
                  leftIcon={course.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}>
                  {course.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lessons */}
      <SectionHeader
        title={`Lessons (${course.lessons?.length || 0})`}
        subtitle="Manage course content"
        action={
          <Button leftIcon={<Plus size={16} />} onClick={() => setAddLessonOpen(true)} size="sm">
            Add Lesson
          </Button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {course.lessons?.length === 0 && (
          <EmptyState
            icon={<Layers size={32} />}
            title="No lessons yet"
            description="Add your first lesson to get started"
            action={<Button onClick={() => setAddLessonOpen(true)} leftIcon={<Plus size={14} />}>Add Lesson</Button>}
          />
        )}
        {course.lessons?.map((lesson, idx) => (
          <LessonEditorRow
            key={lesson.id}
            lesson={lesson}
            index={idx + 1}
            onDelete={() => deleteLessonMutation.mutate(lesson.id)}
            onAddQuiz={() => setAddQuizLessonId(lesson.id)}
          />
        ))}
      </div>

      {/* Modals */}
      <Modal open={addLessonOpen} onClose={() => { setAddLessonOpen(false); resetLesson(); }} title="Add Lesson">
        <form onSubmit={submitLesson(d => addLessonMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input label="Lesson Title *" placeholder="e.g. Introduction to SQL Injection" {...regLesson('title', { required: true })} />
          <Textarea label="Content (HTML supported)" placeholder="<h2>...</h2><p>...</p>" style={{ minHeight: '140px' }} {...regLesson('content')} />
          <Input label="Video URL" placeholder="https://youtube.com/..." leftIcon={<Link2 size={14} />} {...regLesson('videoUrl')} />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => { setAddLessonOpen(false); resetLesson(); }}>Cancel</Button>
            <Button type="submit" loading={addLessonMutation.isPending}>Add Lesson</Button>
          </div>
        </form>
      </Modal>

      {addQuizLessonId && (
        <AddQuizModal
          lessonId={addQuizLessonId}
          onClose={() => setAddQuizLessonId(null)}
          onSuccess={() => { setAddQuizLessonId(null); qc.invalidateQueries({ queryKey: ['course', id] }); }}
        />
      )}
    </div>
  );
}

function LessonEditorRow({ lesson, index, onDelete, onAddQuiz }: {
  lesson: Lesson; index: number; onDelete: () => void; onAddQuiz: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 18px', cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--warning-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--warning)', fontWeight: 700, fontSize: '0.8rem',
          fontFamily: 'var(--font-display)', flexShrink: 0,
        }}>
          {index}
        </div>
        <p style={{ flex: 1, fontWeight: 500 }}>{lesson.title}</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {lesson._count?.materials !== undefined && lesson._count.materials > 0 && (
            <Badge variant="neutral">{lesson._count.materials} files</Badge>
          )}
          {lesson._count?.quizzes !== undefined && lesson._count.quizzes > 0 && (
            <Badge variant="secondary">{lesson._count.quizzes} quiz</Badge>
          )}
          <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); onAddQuiz(); }}
            leftIcon={<Plus size={12} />}>
            Quiz
          </Button>
          <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); setDeleteOpen(true); }}
            leftIcon={<Trash2 size={12} />}>
          </Button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
          {lesson.content && (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }}
              style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }} />
          )}
          {lesson.videoUrl && (
            <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
              <Button size="sm" variant="outline" leftIcon={<Link2 size={12} />}>View Video</Button>
            </a>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen} onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Lesson"
        message={`Delete "${lesson.title}"? This will also remove all materials and quizzes.`}
        danger confirmLabel="Delete"
      />
    </div>
  );
}

function AddQuizModal({ lessonId, onClose, onSuccess }: {
  lessonId: string; onClose: () => void; onSuccess: () => void;
}) {
  const [step, setStep] = useState<'quiz' | 'questions'>('quiz');
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Array<{
    text: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>>([{ text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{
    title: string; description: string; passingScore: number; timeLimit: number;
  }>({ defaultValues: { passingScore: 70 } });

  const createQuizMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; passingScore?: number; timeLimit?: number }) =>
      quizzesApi.create(lessonId, data),
    onSuccess: (quiz) => { setQuizId(quiz.id); setStep('questions'); },
  });

  const addQuestionMutation = useMutation({
    mutationFn: (data: { quizId: string; text: string; answerOptions: { text: string; isCorrect: boolean }[] }) =>
      quizzesApi.addQuestion(data.quizId, { text: data.text, answerOptions: data.answerOptions }),
  });

  const handleSaveQuestions = async () => {
    if (!quizId) return;
    try {
      for (const q of questions) {
        if (!q.text.trim()) continue;
        await addQuestionMutation.mutateAsync({
          quizId,
          text: q.text,
          answerOptions: q.options.filter(o => o.text.trim()),
        });
      }
      toast.success('Quiz created with questions!');
      onSuccess();
    } catch {}
  };

  return (
    <Modal open title={step === 'quiz' ? 'Create Quiz' : 'Add Questions'} onClose={onClose} size="lg">
      {step === 'quiz' ? (
        <form onSubmit={handleSubmit(d => createQuizMutation.mutate({
          title: d.title,
          description: d.description || undefined,
          passingScore: Number(d.passingScore),
          timeLimit: d.timeLimit ? Number(d.timeLimit) : undefined,
        }))} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input label="Quiz Title *" placeholder="e.g. Cybersecurity Basics Quiz" {...register('title', { required: true })} />
          <Textarea label="Description" placeholder="Brief description..." {...register('description')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Passing Score (%)" type="number" {...register('passingScore')} />
            <Input label="Time Limit (min, optional)" type="number" {...register('timeLimit')} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={createQuizMutation.isPending}>Next: Add Questions</Button>
          </div>
        </form>
      ) : (
        <div>
          {questions.map((q, qi) => (
            <div key={qi} style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
              padding: '16px', marginBottom: '16px', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.875rem' }}>Q{qi + 1}</span>
                <input
                  value={q.text}
                  onChange={e => {
                    const updated = [...questions];
                    updated[qi].text = e.target.value;
                    setQuestions(updated);
                  }}
                  placeholder="Enter question..."
                  style={{
                    flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '8px 12px',
                    color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-body)',
                    outline: 'none',
                  }}
                />
                {questions.length > 1 && (
                  <Button size="sm" variant="danger"
                    onClick={() => setQuestions(questions.filter((_, i) => i !== qi))}>
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
              {q.options.map((opt, oi) => (
                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={opt.isCorrect}
                    onChange={() => {
                      const updated = [...questions];
                      updated[qi].options = updated[qi].options.map((o, i) => ({ ...o, isCorrect: i === oi }));
                      setQuestions(updated);
                    }}
                    style={{ accentColor: 'var(--success)', cursor: 'pointer' }}
                  />
                  <input
                    value={opt.text}
                    onChange={e => {
                      const updated = [...questions];
                      updated[qi].options[oi].text = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder={`Option ${oi + 1}${opt.isCorrect ? ' (correct)' : ''}`}
                    style={{
                      flex: 1, background: opt.isCorrect ? 'var(--success-dim)' : 'var(--bg-card)',
                      border: `1px solid ${opt.isCorrect ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)', padding: '7px 12px',
                      color: 'var(--text-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => {
                      const updated = [...questions];
                      updated[qi].options = updated[qi].options.filter((_, i) => i !== oi);
                      setQuestions(updated);
                    }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      ×
                    </button>
                  )}
                </div>
              ))}
              <Button size="sm" variant="ghost"
                onClick={() => {
                  const updated = [...questions];
                  updated[qi].options.push({ text: '', isCorrect: false });
                  setQuestions(updated);
                }}>
                + Add Option
              </Button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button variant="outline" size="sm"
              onClick={() => setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }])}>
              + Add Question
            </Button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" onClick={onSuccess}>Skip for now</Button>
              <Button loading={addQuestionMutation.isPending} onClick={handleSaveQuestions}>
                Save Quiz & Questions
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
