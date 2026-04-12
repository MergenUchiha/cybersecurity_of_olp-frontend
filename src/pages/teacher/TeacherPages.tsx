import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Users,
    Layers,
    GraduationCap,
    ChevronRight,
    Save,
    ArrowLeft,
    Award,
    FileText,
    Link2,
} from "lucide-react";
import { coursesApi, lessonsApi, quizzesApi } from "../../api";
import {
    Button,
    Badge,
    StatCard,
    Input,
    Textarea,
    PageLoader,
    EmptyState,
    SectionHeader,
    Modal,
    ConfirmDialog,
    Table,
} from "../../components/ui";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../lib/uiStore";
import type { Course, Lesson } from "../../types";
import toast from "react-hot-toast";

// ─── Teacher Dashboard ───────────────────────────────────
export function TeacherDashboardPage() {
    const { user } = useAuthStore();
    const { t } = useUIStore(); // ✅ FIX: use translations
    const { data: courses, isLoading } = useQuery({
        queryKey: ["my-courses"],
        queryFn: coursesApi.getMyCourses,
    });

    const published = courses?.filter((c) => c.isPublished).length || 0;
    const totalStudents =
        courses?.reduce((s, c) => s + (c._count?.enrollments || 0), 0) || 0;
    const totalLessons =
        courses?.reduce((s, c) => s + (c._count?.lessons || 0), 0) || 0;

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        fontSize: "clamp(1.25rem, 4vw, 1.875rem)",
                        marginBottom: "6px",
                    }}
                >
                    {t.auth.welcomeMsg}{" "}
                    <span style={{ color: "var(--warning)" }}>
                        {user?.firstName}
                    </span>
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    {t.dashboard.manageYourCourses}
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "16px",
                    marginBottom: "32px",
                }}
            >
                <StatCard
                    label={t.nav.courses}
                    value={courses?.length || 0}
                    icon={<BookOpen size={22} />}
                    color="warning"
                />
                <StatCard
                    label={t.dashboard.published}
                    value={published}
                    icon={<Eye size={22} />}
                    color="success"
                    delay={0.05}
                />
                <StatCard
                    label={t.dashboard.totalStudents}
                    value={totalStudents}
                    icon={<Users size={22} />}
                    color="primary"
                    delay={0.1}
                />
                <StatCard
                    label={t.dashboard.totalLessons}
                    value={totalLessons}
                    icon={<Layers size={22} />}
                    color="secondary"
                    delay={0.15}
                />
            </div>

            <SectionHeader
                title={t.dashboard.myCourses}
                subtitle={t.dashboard.recentlyEnrolled}
                action={
                    <Link to="/teacher/courses">
                        <Button leftIcon={<BookOpen size={16} />}>
                            {t.courses.manage}
                        </Button>
                    </Link>
                }
            />

            {isLoading ? (
                <PageLoader />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {courses?.slice(0, 6).map((course, idx) => (
                        <TeacherCourseCard
                            key={course.id}
                            course={course}
                            delay={idx * 0.03}
                        />
                    ))}
                    {(!courses || courses.length === 0) && (
                        <EmptyState
                            icon={<BookOpen size={40} />}
                            title={t.courses.createFirst}
                            action={
                                <Link to="/teacher/courses">
                                    <Button leftIcon={<Plus size={14} />}>
                                        {t.courses.newCourse}
                                    </Button>
                                </Link>
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function TeacherCourseCard({
    course,
    delay,
}: {
    course: Course;
    delay?: number;
}) {
    const { t } = useUIStore();
    return (
        <Link
            to={`/teacher/courses/${course.id}`}
            style={{ textDecoration: "none" }}
        >
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "18px",
                    transition: "all var(--transition-base)",
                    animation: `fadeInUp 0.4s ease ${delay || 0}s both`,
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--warning)";
                    (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "0.9375rem",
                            lineHeight: 1.4,
                            flex: 1,
                            marginRight: "8px",
                        }}
                    >
                        {course.title}
                    </h3>
                    <Badge
                        variant={course.isPublished ? "success" : "neutral"}
                        dot
                    >
                        {course.isPublished ? t.common.live : t.common.draft}
                    </Badge>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    <span>
                        {course._count?.lessons || 0} {t.common.lessons}
                    </span>
                    <span>
                        {course._count?.enrollments || 0} {t.common.students}
                    </span>
                </div>
                <div
                    style={{
                        marginTop: "12px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <ChevronRight size={16} color="var(--text-muted)" />
                </div>
            </div>
        </Link>
    );
}

// ─── Teacher Courses Manager ─────────────────────────────
export function TeacherCoursesPage() {
    const { t } = useUIStore(); // ✅ FIX: use translations
    const qc = useQueryClient();
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<{ title: string; description: string; category: string }>();

    const { data: courses, isLoading } = useQuery({
        queryKey: ["my-courses"],
        queryFn: coursesApi.getMyCourses,
    });

    const createMutation = useMutation({
        mutationFn: coursesApi.create,
        onSuccess: () => {
            toast.success(t.courses.courseCreated);
            qc.invalidateQueries({ queryKey: ["my-courses"] });
            reset();
            setCreateOpen(false);
        },
    });
    const toggleMutation = useMutation({
        mutationFn: coursesApi.togglePublish,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-courses"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: coursesApi.delete,
        onSuccess: () => {
            toast.success(t.courses.courseDeletedMsg);
            qc.invalidateQueries({ queryKey: ["my-courses"] });
        },
    });

    const columns = [
        {
            key: "title",
            header: t.courses.courseTitle,
            render: (c: Course) => (
                <div>
                    <p style={{ fontWeight: 500 }}>{c.title}</p>
                    {c.category && (
                        <Badge variant="neutral">{c.category}</Badge>
                    )}
                </div>
            ),
        },
        {
            key: "stats",
            header: "Stats",
            render: (c: Course) => (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span>
                        {c._count?.lessons || 0} {t.common.lessons}
                    </span>
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span>
                        {c._count?.enrollments || 0} {t.common.students}
                    </span>
                </div>
            ),
        },
        {
            key: "status",
            header: t.common.status,
            render: (c: Course) => (
                <Badge variant={c.isPublished ? "success" : "neutral"} dot>
                    {c.isPublished ? t.common.live : t.common.draft}
                </Badge>
            ),
        },
        {
            key: "actions",
            header: t.common.actions,
            render: (c: Course) => (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Link to={`/teacher/courses/${c.id}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Edit size={14} />}
                        >
                            {t.common.edit}
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        variant={c.isPublished ? "ghost" : "success"}
                        loading={toggleMutation.isPending}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMutation.mutate(c.id);
                        }}
                        leftIcon={
                            c.isPublished ? (
                                <EyeOff size={14} />
                            ) : (
                                <Eye size={14} />
                            )
                        }
                    >
                        {c.isPublished ? t.common.unpublish : t.common.publish}
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(c.id);
                        }}
                        leftIcon={<Trash2 size={14} />}
                    />
                </div>
            ),
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.courses.manage}
                subtitle={`${courses?.length || 0} ${t.courses.available}`}
                action={
                    <Button
                        leftIcon={<Plus size={16} />}
                        onClick={() => setCreateOpen(true)}
                    >
                        {t.courses.newCourse}
                    </Button>
                }
            />

            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                }}
            >
                <Table
                    columns={columns}
                    data={courses || []}
                    loading={isLoading}
                    emptyMessage={t.courses.createFirst}
                />
            </div>

            <Modal
                open={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                    reset();
                }}
                title={t.courses.newCourse}
            >
                <form
                    onSubmit={handleSubmit((d) => createMutation.mutate(d))}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    <Input
                        label={`${t.courses.courseTitle} *`}
                        placeholder="e.g. Introduction to Cybersecurity"
                        {...register("title", { required: true })}
                    />
                    <Textarea
                        label={t.courses.description}
                        placeholder="Describe what students will learn..."
                        {...register("description")}
                    />
                    <Input
                        label={t.courses.category}
                        placeholder="e.g. Cybersecurity, Web Dev, Database"
                        {...register("category")}
                    />
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                setCreateOpen(false);
                                reset();
                            }}
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            type="submit"
                            loading={createMutation.isPending}
                        >
                            {t.common.create}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    deleteMutation.mutate(deleteId!);
                    setDeleteId(null);
                }}
                title={t.courses.deleteConfirm}
                message={t.courses.deleteWarning}
                confirmLabel={t.common.delete}
                danger
            />
        </div>
    );
}

// ─── Course Edit Page ────────────────────────────────────
export function CourseEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useUIStore(); // ✅ FIX: use translations
    const qc = useQueryClient();
    const [addLessonOpen, setAddLessonOpen] = useState(false);
    const [addQuizLessonId, setAddQuizLessonId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const { data: course, isLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: () => coursesApi.getOne(id!),
        enabled: !!id,
    });
    const { register: regEdit, handleSubmit: submitEdit } = useForm<{
        title: string;
        description: string;
        category: string;
    }>({
        values: {
            title: course?.title || "",
            description: course?.description || "",
            category: course?.category || "",
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => coursesApi.update(id!, data),
        onSuccess: () => {
            toast.success(t.courses.updated);
            qc.invalidateQueries({ queryKey: ["course", id] });
            setEditMode(false);
        },
    });
    const toggleMutation = useMutation({
        mutationFn: () => coursesApi.togglePublish(id!),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["course", id] }),
    });
    const addLessonMutation = useMutation({
        mutationFn: (data: {
            title: string;
            content: string;
            videoUrl: string;
        }) => lessonsApi.create(id!, data),
        onSuccess: () => {
            toast.success(t.courses.lessonAdded);
            qc.invalidateQueries({ queryKey: ["course", id] });
            setAddLessonOpen(false);
            resetLesson();
        },
    });
    const deleteLessonMutation = useMutation({
        mutationFn: lessonsApi.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["course", id] }),
    });

    const {
        register: regLesson,
        handleSubmit: submitLesson,
        reset: resetLesson,
    } = useForm<{ title: string; content: string; videoUrl: string }>();

    if (isLoading) return <PageLoader />;
    if (!course) return <EmptyState title={t.courses.courseNotFound} />;

    return (
        <div style={{ animation: "fadeInUp 0.4s ease", maxWidth: "900px" }}>
            <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft size={14} />}
                onClick={() => navigate("/teacher/courses")}
                style={{ marginBottom: "20px" }}
            >
                {t.common.back}
            </Button>

            {/* Course header */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "28px",
                    marginBottom: "24px",
                }}
            >
                {editMode ? (
                    <form
                        onSubmit={submitEdit((d) => updateMutation.mutate(d))}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        <Input
                            label={t.courses.courseTitle}
                            {...regEdit("title", { required: true })}
                        />
                        <Textarea
                            label={t.courses.description}
                            {...regEdit("description")}
                        />
                        <Input
                            label={t.courses.category}
                            {...regEdit("category")}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Button
                                type="submit"
                                loading={updateMutation.isPending}
                                leftIcon={<Save size={14} />}
                            >
                                {t.common.save}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEditMode(false)}
                            >
                                {t.common.cancel}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "16px",
                        }}
                    >
                        <div>
                            {course.category && (
                                <Badge
                                    variant="primary"
                                    style={{
                                        marginBottom: "8px",
                                        display: "inline-block",
                                    }}
                                >
                                    {course.category}
                                </Badge>
                            )}
                            <h1
                                style={{
                                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                                    marginBottom: "6px",
                                }}
                            >
                                {course.title}
                            </h1>
                            {course.description && (
                                <p
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "var(--text-secondary)",
                                        maxWidth: "600px",
                                    }}
                                >
                                    {course.description}
                                </p>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "16px",
                                    marginTop: "12px",
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <Layers size={13} />
                                    {course._count?.lessons || 0}{" "}
                                    {t.common.lessons}
                                </span>
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <Users size={13} />
                                    {course.lessons?.reduce(
                                        (s, l) => s + (l._count?.quizzes || 0),
                                        0,
                                    ) || 0}{" "}
                                    quizzes
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            <Badge
                                variant={
                                    course.isPublished ? "success" : "neutral"
                                }
                                dot
                                size="md"
                            >
                                {course.isPublished
                                    ? t.common.live
                                    : t.common.draft}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                leftIcon={<Edit size={14} />}
                                onClick={() => setEditMode(true)}
                            >
                                {t.common.edit}
                            </Button>
                            <Button
                                size="sm"
                                variant={
                                    course.isPublished ? "ghost" : "primary"
                                }
                                loading={toggleMutation.isPending}
                                onClick={() => toggleMutation.mutate()}
                                leftIcon={
                                    course.isPublished ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )
                                }
                            >
                                {course.isPublished
                                    ? t.common.unpublish
                                    : t.common.publish}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Lessons */}
            <SectionHeader
                title={`${t.courses.lessons} (${course.lessons?.length || 0})`}
                subtitle={t.courses.manageCourseContent}
                action={
                    <Button
                        leftIcon={<Plus size={16} />}
                        onClick={() => setAddLessonOpen(true)}
                        size="sm"
                    >
                        {t.courses.addLesson}
                    </Button>
                }
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "24px",
                }}
            >
                {course.lessons?.length === 0 && (
                    <EmptyState
                        icon={<Layers size={32} />}
                        title={`No ${t.common.lessons.toLowerCase()} yet`}
                        action={
                            <Button
                                onClick={() => setAddLessonOpen(true)}
                                leftIcon={<Plus size={14} />}
                            >
                                {t.courses.addLesson}
                            </Button>
                        }
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

            <Modal
                open={addLessonOpen}
                onClose={() => {
                    setAddLessonOpen(false);
                    resetLesson();
                }}
                title={t.courses.addLesson}
            >
                <form
                    onSubmit={submitLesson((d) => addLessonMutation.mutate(d))}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    <Input
                        label={`${t.courses.lessonTitle} *`}
                        placeholder="e.g. Introduction to SQL Injection"
                        {...regLesson("title", { required: true })}
                    />
                    <Textarea
                        label={t.courses.content}
                        placeholder="Write your lesson content here. You can use basic HTML for formatting: <b>bold</b>, <h2>heading</h2>, <ul><li>list</li></ul>"
                        style={{ minHeight: "140px" }}
                        {...regLesson("content")}
                    />
                    <Input
                        label={t.courses.videoUrl}
                        placeholder="https://youtube.com/..."
                        leftIcon={<Link2 size={14} />}
                        {...regLesson("videoUrl")}
                    />
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                setAddLessonOpen(false);
                                resetLesson();
                            }}
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            type="submit"
                            loading={addLessonMutation.isPending}
                        >
                            {t.courses.addLesson}
                        </Button>
                    </div>
                </form>
            </Modal>

            {addQuizLessonId && (
                <AddQuizModal
                    lessonId={addQuizLessonId}
                    onClose={() => setAddQuizLessonId(null)}
                    onSuccess={() => {
                        setAddQuizLessonId(null);
                        qc.invalidateQueries({ queryKey: ["course", id] });
                    }}
                />
            )}
        </div>
    );
}

function LessonEditorRow({
    lesson,
    index,
    onDelete,
    onAddQuiz,
}: {
    lesson: Lesson;
    index: number;
    onDelete: () => void;
    onAddQuiz: () => void;
}) {
    const { t } = useUIStore();
    const [expanded, setExpanded] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 18px",
                    cursor: "pointer",
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--warning-dim)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--warning)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-display)",
                        flexShrink: 0,
                    }}
                >
                    {index}
                </div>
                <p
                    style={{
                        flex: 1,
                        fontWeight: 500,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {lesson.title}
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        flexShrink: 0,
                    }}
                >
                    {lesson._count?.materials !== undefined &&
                        lesson._count.materials > 0 && (
                            <Badge variant="neutral">
                                {lesson._count.materials} files
                            </Badge>
                        )}
                    {lesson._count?.quizzes !== undefined &&
                        lesson._count.quizzes > 0 && (
                            <Badge variant="secondary">
                                {lesson._count.quizzes} quiz
                            </Badge>
                        )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddQuiz();
                        }}
                        leftIcon={<Plus size={12} />}
                    >
                        Quiz
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteOpen(true);
                        }}
                        leftIcon={<Trash2 size={12} />}
                    />
                </div>
            </div>

            {expanded && (
                <div
                    style={{
                        borderTop: "1px solid var(--border)",
                        background: "var(--bg-elevated)",
                    }}
                >
                    {lesson.videoUrl && (
                        <div style={{ padding: "14px 18px 0" }}>
                            <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    textDecoration: "none",
                                    display: "inline-flex",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 16px",
                                        background:
                                            "linear-gradient(135deg,#6366f1,#22d3ee)",
                                        borderRadius: "var(--radius-md)",
                                        color: "#fff",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        fontFamily: "var(--font-body)",
                                        boxShadow:
                                            "0 3px 10px rgba(99,102,241,0.4)",
                                    }}
                                >
                                    <Link2 size={13} />
                                    Video Link
                                </span>
                            </a>
                        </div>
                    )}
                    {lesson.content && (
                        <div
                            className="lesson-content"
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                            style={{
                                padding: "14px 20px 16px",
                                color: "var(--text-secondary)",
                                fontSize: "0.875rem",
                                lineHeight: 1.7,
                            }}
                        />
                    )}
                    {!lesson.content && !lesson.videoUrl && (
                        <p
                            style={{
                                padding: "14px 20px",
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                                fontStyle: "italic",
                            }}
                        >
                            No content added yet.
                        </p>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={onDelete}
                title={t.courses.deleteConfirm}
                message={`Delete "${lesson.title}"?`}
                danger
                confirmLabel={t.common.delete}
            />
        </div>
    );
}

function AddQuizModal({
    lessonId,
    onClose,
    onSuccess,
}: {
    lessonId: string;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { t } = useUIStore();
    const [step, setStep] = useState<"quiz" | "questions">("quiz");
    const [quizId, setQuizId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<
        Array<{
            text: string;
            options: Array<{ text: string; isCorrect: boolean }>;
        }>
    >([
        {
            text: "",
            options: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
            ],
        },
    ]);

    const { register, handleSubmit } = useForm<{
        title: string;
        description: string;
        passingScore: number;
        timeLimit: number;
    }>({ defaultValues: { passingScore: 70 } });

    const createQuizMutation = useMutation({
        mutationFn: (data: any) => quizzesApi.create(lessonId, data),
        onSuccess: (quiz) => {
            setQuizId(quiz.id);
            setStep("questions");
        },
    });
    const addQuestionMutation = useMutation({
        mutationFn: (data: any) =>
            quizzesApi.addQuestion(data.quizId, {
                text: data.text,
                answerOptions: data.answerOptions,
            }),
    });

    const handleSaveQuestions = async () => {
        if (!quizId) return;
        try {
            for (const q of questions) {
                if (!q.text.trim()) continue;
                await addQuestionMutation.mutateAsync({
                    quizId,
                    text: q.text,
                    answerOptions: q.options.filter((o) => o.text.trim()),
                });
            }
            toast.success(t.courses.quizCreated);
            onSuccess();
        } catch {}
    };

    return (
        <Modal
            open
            title={
                step === "quiz" ? t.courses.createQuiz : t.courses.addQuestion
            }
            onClose={onClose}
            size="lg"
        >
            {step === "quiz" ? (
                <form
                    onSubmit={handleSubmit((d) =>
                        createQuizMutation.mutate({
                            title: d.title,
                            description: d.description || undefined,
                            passingScore: Number(d.passingScore),
                            timeLimit: d.timeLimit
                                ? Number(d.timeLimit)
                                : undefined,
                        }),
                    )}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    <Input
                        label={`${t.courses.quizTitle} *`}
                        placeholder="e.g. Cybersecurity Basics Quiz"
                        {...register("title", { required: true })}
                    />
                    <Textarea
                        label={t.courses.description}
                        placeholder="Brief description..."
                        {...register("description")}
                    />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                        }}
                    >
                        <Input
                            label={t.courses.passingScore}
                            type="number"
                            {...register("passingScore")}
                        />
                        <Input
                            label={t.courses.timeLimit}
                            type="number"
                            {...register("timeLimit")}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button variant="ghost" type="button" onClick={onClose}>
                            {t.common.cancel}
                        </Button>
                        <Button
                            type="submit"
                            loading={createQuizMutation.isPending}
                        >
                            Next: Add Questions
                        </Button>
                    </div>
                </form>
            ) : (
                <div>
                    {questions.map((q, qi) => (
                        <div
                            key={qi}
                            style={{
                                background: "var(--bg-elevated)",
                                borderRadius: "var(--radius-lg)",
                                padding: "16px",
                                marginBottom: "16px",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        color: "var(--primary)",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    Q{qi + 1}
                                </span>
                                <input
                                    value={q.text}
                                    onChange={(e) => {
                                        const u = [...questions];
                                        u[qi].text = e.target.value;
                                        setQuestions(u);
                                    }}
                                    placeholder={`${t.courses.question}...`}
                                    style={{
                                        flex: 1,
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-md)",
                                        padding: "8px 12px",
                                        color: "var(--text-primary)",
                                        fontSize: "0.875rem",
                                        fontFamily: "var(--font-body)",
                                        outline: "none",
                                    }}
                                />
                                {questions.length > 1 && (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() =>
                                            setQuestions(
                                                questions.filter(
                                                    (_, i) => i !== qi,
                                                ),
                                            )
                                        }
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                )}
                            </div>
                            {q.options.map((opt, oi) => (
                                <div
                                    key={oi}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "6px",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={`correct-${qi}`}
                                        checked={opt.isCorrect}
                                        onChange={() => {
                                            const u = [...questions];
                                            u[qi].options = u[qi].options.map(
                                                (o, i) => ({
                                                    ...o,
                                                    isCorrect: i === oi,
                                                }),
                                            );
                                            setQuestions(u);
                                        }}
                                        style={{
                                            accentColor: "var(--success)",
                                            cursor: "pointer",
                                        }}
                                    />
                                    <input
                                        value={opt.text}
                                        onChange={(e) => {
                                            const u = [...questions];
                                            u[qi].options[oi].text =
                                                e.target.value;
                                            setQuestions(u);
                                        }}
                                        placeholder={`${t.courses.option} ${oi + 1}${opt.isCorrect ? " ✓" : ""}`}
                                        style={{
                                            flex: 1,
                                            background: opt.isCorrect
                                                ? "var(--success-dim)"
                                                : "var(--bg-card)",
                                            border: `1px solid ${opt.isCorrect ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                                            borderRadius: "var(--radius-md)",
                                            padding: "7px 12px",
                                            color: "var(--text-primary)",
                                            fontSize: "0.8125rem",
                                            fontFamily: "var(--font-body)",
                                            outline: "none",
                                        }}
                                    />
                                    {q.options.length > 2 && (
                                        <button
                                            onClick={() => {
                                                const u = [...questions];
                                                u[qi].options = u[
                                                    qi
                                                ].options.filter(
                                                    (_, i) => i !== oi,
                                                );
                                                setQuestions(u);
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "var(--danger)",
                                                cursor: "pointer",
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    const u = [...questions];
                                    u[qi].options.push({
                                        text: "",
                                        isCorrect: false,
                                    });
                                    setQuestions(u);
                                }}
                            >
                                + {t.courses.option}
                            </Button>
                        </div>
                    ))}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "space-between",
                            marginTop: "16px",
                        }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setQuestions([
                                    ...questions,
                                    {
                                        text: "",
                                        options: [
                                            { text: "", isCorrect: true },
                                            { text: "", isCorrect: false },
                                        ],
                                    },
                                ])
                            }
                        >
                            {t.courses.addQuestion}
                        </Button>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <Button variant="ghost" onClick={onSuccess}>
                                {t.common.skipForNow}
                            </Button>
                            <Button
                                loading={addQuestionMutation.isPending}
                                onClick={handleSaveQuestions}
                            >
                                {t.courses.saveQuiz}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
