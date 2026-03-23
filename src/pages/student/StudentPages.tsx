import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    BookOpen,
    Award,
    Clock,
    ChevronRight,
    Play,
    FileText,
    Search,
    BookMarked,
    CheckCircle,
    XCircle,
    GraduationCap,
    Target,
    Layers,
    ArrowLeft,
    ArrowRight,
    Lock,
    ExternalLink,
    Zap,
} from "lucide-react";
import { coursesApi, enrollmentsApi, quizzesApi, lessonsApi } from "../../api";
import {
    Button,
    Badge,
    StatCard,
    Input,
    PageLoader,
    EmptyState,
    Pagination,
    SectionHeader,
    Modal,
} from "../../components/ui";
import { SkeletonStats, SkeletonCards } from "../../components/ui/Skeleton";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../lib/uiStore";
import type { Course, Lesson, QuizAttempt, Question } from "../../types";
import { format } from "date-fns";
import toast from "react-hot-toast";

// ─── Student Dashboard ─────────────────────────────────────
export function StudentDashboardPage() {
    const { user } = useAuthStore();
    const { t } = useUIStore();
    const { data: enrollments, isLoading: enrollLoading } = useQuery({
        queryKey: ["my-enrollments"],
        queryFn: enrollmentsApi.getMyEnrollments,
    });
    const { data: attempts, isLoading: attemptsLoading } = useQuery({
        queryKey: ["my-attempts"],
        queryFn: quizzesApi.getMyAttempts,
    });
    const passedCount = attempts?.filter((a) => a.passed).length || 0;
    const totalAttempts = attempts?.length || 0;

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        fontSize: "clamp(1.25rem, 4vw, 1.875rem)",
                        marginBottom: "6px",
                    }}
                >
                    {t.dashboard.welcomeBack}{" "}
                    <span style={{ color: "var(--primary)" }}>
                        {user?.firstName}
                    </span>{" "}
                    👋
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    {t.dashboard.continueJourney}
                </p>
            </div>

            {enrollLoading || attemptsLoading ? (
                <SkeletonStats count={4} />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "14px",
                        marginBottom: "32px",
                    }}
                >
                    <StatCard
                        label={t.dashboard.enrolledCourses}
                        value={enrollments?.length || 0}
                        icon={<BookOpen size={22} />}
                        color="primary"
                        delay={0}
                    />
                    <StatCard
                        label={t.dashboard.quizzesPassed}
                        value={passedCount}
                        icon={<CheckCircle size={22} />}
                        color="success"
                        delay={0.05}
                    />
                    <StatCard
                        label={t.dashboard.totalAttempts}
                        value={totalAttempts}
                        icon={<Target size={22} />}
                        color="secondary"
                        delay={0.1}
                    />
                    <StatCard
                        label={t.dashboard.passRate}
                        value={
                            totalAttempts > 0
                                ? Math.round(
                                      (passedCount / totalAttempts) * 100,
                                  ) + "%"
                                : "—"
                        }
                        icon={<Award size={22} />}
                        color="warning"
                        delay={0.15}
                    />
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "24px",
                }}
            >
                <div>
                    <SectionHeader
                        title={t.dashboard.myCourses}
                        subtitle={t.dashboard.recentlyEnrolled}
                        action={
                            <Link to="/my-courses">
                                <Button variant="ghost" size="sm">
                                    {t.common.viewAll}
                                </Button>
                            </Link>
                        }
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {enrollments?.slice(0, 4).map((e, idx) => (
                            <Link
                                key={e.id}
                                to={`/courses/${e.courseId}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-lg)",
                                        padding: "14px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        transition:
                                            "all var(--transition-base)",
                                        animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
                                    }}
                                    onMouseEnter={(ev) => {
                                        (
                                            ev.currentTarget as HTMLElement
                                        ).style.borderColor =
                                            "var(--border-strong)";
                                        (
                                            ev.currentTarget as HTMLElement
                                        ).style.transform = "translateX(4px)";
                                    }}
                                    onMouseLeave={(ev) => {
                                        (
                                            ev.currentTarget as HTMLElement
                                        ).style.borderColor = "var(--border)";
                                        (
                                            ev.currentTarget as HTMLElement
                                        ).style.transform = "translateX(0)";
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: "var(--radius-md)",
                                            background: "var(--primary-dim)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--primary)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <BookOpen size={17} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontWeight: 600,
                                                fontSize: "0.875rem",
                                                color: "var(--text-primary)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {e.course?.title}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {e.course?._count?.lessons || 0}{" "}
                                            {t.common.lessons}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        size={15}
                                        color="var(--text-muted)"
                                    />
                                </div>
                            </Link>
                        ))}
                        {(!enrollments || enrollments.length === 0) && (
                            <EmptyState
                                icon={<BookOpen size={32} />}
                                title={t.dashboard.noCourses}
                                action={
                                    <Link to="/courses">
                                        <Button size="sm">
                                            {t.dashboard.browseCourses}
                                        </Button>
                                    </Link>
                                }
                            />
                        )}
                    </div>
                </div>

                <div>
                    <SectionHeader
                        title={t.dashboard.recentResults}
                        subtitle={t.dashboard.quizAttempts}
                        action={
                            <Link to="/my-results">
                                <Button variant="ghost" size="sm">
                                    {t.common.viewAll}
                                </Button>
                            </Link>
                        }
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {attempts?.slice(0, 4).map((a, idx) => (
                            <div
                                key={a.id}
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius-lg)",
                                    padding: "12px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "var(--radius-md)",
                                        background: a.passed
                                            ? "var(--success-dim)"
                                            : "var(--danger-dim)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: a.passed
                                            ? "var(--success)"
                                            : "var(--danger)",
                                        flexShrink: 0,
                                    }}
                                >
                                    {a.passed ? (
                                        <CheckCircle size={16} />
                                    ) : (
                                        <XCircle size={16} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                        style={{
                                            fontSize: "0.8125rem",
                                            fontWeight: 500,
                                            color: "var(--text-primary)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {a.quiz?.title}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        {t.quiz.yourScore}:{" "}
                                        {Math.round(a.score || 0)}%
                                    </p>
                                </div>
                                <Badge
                                    variant={a.passed ? "success" : "danger"}
                                >
                                    {a.passed ? t.quiz.pass : t.quiz.fail}
                                </Badge>
                            </div>
                        ))}
                        {(!attempts || attempts.length === 0) && (
                            <EmptyState
                                icon={<Award size={32} />}
                                title={t.dashboard.noAttempts}
                            />
                        )}
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
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["courses", page, search, category],
        queryFn: () =>
            coursesApi.getAll({
                page,
                limit: 12,
                search: search || undefined,
                category: category || undefined,
            }),
    });
    const enrollMutation = useMutation({
        mutationFn: enrollmentsApi.enroll,
        onSuccess: () => {
            toast.success(t.common.enrolled + "!");
            qc.invalidateQueries({ queryKey: ["my-enrollments"] });
            qc.invalidateQueries({ queryKey: ["enrolled"] });
        },
    });

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.courses.browseTitle}
                subtitle={`${data?.meta.total || 0} ${t.courses.available}`}
            />
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ flex: 1, minWidth: "180px" }}>
                    <Input
                        placeholder={`${t.common.search}...`}
                        value={searchInput}
                        onChange={(ev) => setSearchInput(ev.target.value)}
                        onKeyDown={(ev) => {
                            if (ev.key === "Enter") {
                                setSearch(searchInput);
                                setPage(1);
                            }
                        }}
                        leftIcon={<Search size={15} />}
                    />
                </div>
                <select
                    value={category}
                    onChange={(ev) => {
                        setCategory(ev.target.value);
                        setPage(1);
                    }}
                    style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "10px 14px",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "var(--font-body)",
                        minWidth: "140px",
                    }}
                >
                    <option value="">{t.courses.allCategories}</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database">Database</option>
                    <option value="Programming">Programming</option>
                </select>
                <Button
                    variant="outline"
                    onClick={() => {
                        setSearch(searchInput);
                        setPage(1);
                    }}
                >
                    {t.common.search}
                </Button>
            </div>
            {isLoading ? (
                <SkeletonCards count={6} />
            ) : (
                <>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(290px, 1fr))",
                            gap: "20px",
                            marginBottom: "24px",
                        }}
                    >
                        {data?.data.map((course, idx) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                delay={idx * 0.03}
                                onEnroll={() =>
                                    enrollMutation.mutate(course.id)
                                }
                                enrolling={enrollMutation.isPending}
                            />
                        ))}
                    </div>
                    {data?.data.length === 0 && (
                        <EmptyState
                            icon={<GraduationCap size={48} />}
                            title={t.courses.noCoursesFound}
                            description={t.courses.browseDesc}
                        />
                    )}
                    <Pagination
                        page={page}
                        totalPages={data?.meta.totalPages || 1}
                        onChange={setPage}
                    />
                </>
            )}
        </div>
    );
}

// ─── Course Card — fixed layout, no clipping ────────────
const CARD_COLORS = [
    "#00d4aa",
    "#6366f1",
    "#22d3ee",
    "#f59e0b",
    "#10b981",
    "#f43f5e",
    "#8b5cf6",
];

function CourseCard({
    course,
    delay,
    onEnroll,
    enrolling,
}: {
    course: Course;
    delay?: number;
    onEnroll?: () => void;
    enrolling?: boolean;
}) {
    const { t } = useUIStore();
    const { data: enrollCheck } = useQuery({
        queryKey: ["enrolled", course.id],
        queryFn: () => enrollmentsApi.checkEnrollment(course.id),
    });
    const isEnrolled = enrollCheck?.enrolled;
    const color = CARD_COLORS[course.title.charCodeAt(0) % CARD_COLORS.length];

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                transition: "all 0.25s ease",
                animation: `fadeInUp 0.4s ease ${delay || 0}s both`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(ev) => {
                const el = ev.currentTarget as HTMLElement;
                el.style.borderColor = color;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = `0 12px 40px ${color}22`;
            }}
            onMouseLeave={(ev) => {
                const el = ev.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
            }}
        >
            {/* Header */}
            <div
                style={{
                    height: 108,
                    background: `linear-gradient(135deg,${color}22 0%,${color}06 100%)`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(${color}18 1px, transparent 1px)`,
                        backgroundSize: "18px 18px",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: `linear-gradient(90deg,transparent,${color}55,transparent)`,
                    }}
                />
                <div
                    style={{
                        width: 50,
                        height: 50,
                        background: `${color}18`,
                        border: `2px solid ${color}35`,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 1,
                        boxShadow: `0 4px 14px ${color}22`,
                    }}
                >
                    <BookOpen size={24} color={color} />
                </div>
                {course.category && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 2,
                        }}
                    >
                        <Badge variant="neutral">{course.category}</Badge>
                    </div>
                )}
                {isEnrolled && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 2,
                        }}
                    >
                        <Badge variant="success" dot>
                            {t.courses.enrolled}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Body */}
            <div
                style={{
                    padding: "16px 18px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <h3
                    style={{
                        fontSize: "0.9875rem",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        overflow: "hidden",
                    }}
                >
                    {course.title}
                </h3>
                {course.description && (
                    <p
                        style={{
                            fontSize: "0.79rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical" as any,
                            overflow: "hidden",
                        }}
                    >
                        {course.description}
                    </p>
                )}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "0.74rem",
                        color: "var(--text-muted)",
                        paddingTop: "4px",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        <Layers size={11} color={color} />
                        {course._count?.lessons || 0} {t.common.lessons}
                    </span>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        <GraduationCap size={11} color={color} />
                        {course._count?.enrollments || 0} {t.common.students}
                    </span>
                    {course.teacher && (
                        <span
                            style={{ marginLeft: "auto", fontSize: "0.7rem" }}
                        >
                            {t.common.by} {course.teacher.firstName}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer — fixed, never clips */}
            <div
                style={{
                    padding: "12px 18px 16px",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                }}
            >
                {/* View Course */}
                <Link
                    to={`/courses/${course.id}`}
                    style={{ flex: 1, textDecoration: "none" }}
                >
                    <button
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: `1px solid ${color}45`,
                            borderRadius: "var(--radius-md)",
                            color: color,
                            fontSize: "0.845rem",
                            fontWeight: 500,
                            fontFamily: "var(--font-body)",
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(ev) => {
                            (ev.currentTarget as HTMLElement).style.background =
                                `${color}12`;
                        }}
                        onMouseLeave={(ev) => {
                            (ev.currentTarget as HTMLElement).style.background =
                                "transparent";
                        }}
                    >
                        {t.courses.viewCourse}
                    </button>
                </Link>

                {/* Enroll OR Enrolled */}
                {isEnrolled ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "8px 12px",
                            flexShrink: 0,
                            background: "rgba(16,185,129,0.12)",
                            border: "1px solid rgba(16,185,129,0.3)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--success)",
                            fontSize: "0.81rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <CheckCircle size={13} />
                        {t.courses.enrolled}
                    </div>
                ) : (
                    <button
                        onClick={onEnroll}
                        disabled={enrolling}
                        style={{
                            padding: "8px 16px",
                            flexShrink: 0,
                            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                            border: "none",
                            borderRadius: "var(--radius-md)",
                            color: "#050b14",
                            fontSize: "0.845rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-body)",
                            cursor: enrolling ? "not-allowed" : "pointer",
                            opacity: enrolling ? 0.7 : 1,
                            transition: "transform 0.15s, box-shadow 0.15s",
                            boxShadow: `0 3px 10px ${color}35`,
                            whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(ev) => {
                            if (!enrolling) {
                                (
                                    ev.currentTarget as HTMLElement
                                ).style.transform = "scale(1.05)";
                                (
                                    ev.currentTarget as HTMLElement
                                ).style.boxShadow = `0 5px 16px ${color}50`;
                            }
                        }}
                        onMouseLeave={(ev) => {
                            (ev.currentTarget as HTMLElement).style.transform =
                                "scale(1)";
                            (ev.currentTarget as HTMLElement).style.boxShadow =
                                `0 3px 10px ${color}35`;
                        }}
                    >
                        {enrolling ? "…" : t.courses.enroll}
                    </button>
                )}
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

    const { data: course, isLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: () => coursesApi.getOne(id!),
        enabled: !!id,
    });
    const { data: enrollCheck } = useQuery({
        queryKey: ["enrolled", id],
        queryFn: () => enrollmentsApi.checkEnrollment(id!),
        enabled: !!id,
    });
    const enrollMutation = useMutation({
        mutationFn: () => enrollmentsApi.enroll(id!),
        onSuccess: () => {
            toast.success(t.common.enrolled + "!");
            qc.invalidateQueries({ queryKey: ["enrolled", id] });
        },
    });

    if (isLoading) return <PageLoader />;
    if (!course) return <EmptyState title="Course not found" />;
    const color = CARD_COLORS[course.title.charCodeAt(0) % CARD_COLORS.length];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease", maxWidth: "960px" }}>
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        height: "140px",
                        background: `linear-gradient(135deg,${color}22,${color}06)`,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        padding: "28px 32px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `radial-gradient(${color}12 1px,transparent 1px)`,
                            backgroundSize: "22px 22px",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: `linear-gradient(90deg,transparent,${color}50,transparent)`,
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
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
                                fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
                                marginBottom: "6px",
                            }}
                        >
                            {course.title}
                        </h1>
                        {course.teacher && (
                            <p
                                style={{
                                    fontSize: "0.85rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {t.common.by}{" "}
                                <span style={{ color, fontWeight: 600 }}>
                                    {course.teacher.firstName}{" "}
                                    {course.teacher.lastName}
                                </span>
                            </p>
                        )}
                    </div>
                    <div style={{ flexShrink: 0, marginLeft: "16px" }}>
                        {enrollCheck?.enrolled ? (
                            <Badge variant="success" dot size="md">
                                {t.courses.enrolled}
                            </Badge>
                        ) : (
                            <button
                                onClick={() => enrollMutation.mutate()}
                                disabled={enrollMutation.isPending}
                                style={{
                                    padding: "10px 22px",
                                    background: `linear-gradient(135deg,${color},${color}cc)`,
                                    border: "none",
                                    borderRadius: "var(--radius-md)",
                                    color: "#050b14",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    boxShadow: `0 4px 14px ${color}40`,
                                }}
                            >
                                {enrollMutation.isPending
                                    ? "…"
                                    : t.courses.enrollNow}
                            </button>
                        )}
                    </div>
                </div>
                <div
                    style={{
                        padding: "20px 32px",
                        display: "flex",
                        gap: "24px",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    {course.description && (
                        <p
                            style={{
                                flex: 1,
                                minWidth: "200px",
                                color: "var(--text-secondary)",
                                fontSize: "0.9rem",
                                lineHeight: 1.6,
                            }}
                        >
                            {course.description}
                        </p>
                    )}
                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {[
                            {
                                v: course._count?.lessons || 0,
                                l: t.common.lessons,
                            },
                            {
                                v: course._count?.enrollments || 0,
                                l: t.common.students,
                            },
                        ].map(({ v, l }) => (
                            <div key={l} style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "1.375rem",
                                        color,
                                        fontFamily: "var(--font-display)",
                                        lineHeight: 1,
                                    }}
                                >
                                    {v}
                                </p>
                                <p style={{ marginTop: "2px" }}>{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "8px",
                }}
            >
                <h2 style={{ fontSize: "1.25rem" }}>
                    {t.courses.lessons} ({course.lessons?.length || 0})
                </h2>
                {!enrollCheck?.enrolled && (
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <Lock size={12} /> Enroll to unlock
                    </p>
                )}
            </div>

            {course.lessons?.length === 0 ? (
                <EmptyState
                    icon={<BookOpen size={32} />}
                    title="No lessons yet"
                />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    {course.lessons?.map((lesson, idx) => (
                        <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            index={idx + 1}
                            locked={!enrollCheck?.enrolled}
                            accentColor={color}
                            onClick={() =>
                                enrollCheck?.enrolled
                                    ? setSelectedLesson(lesson)
                                    : toast.error("Enroll to access lessons")
                            }
                        />
                    ))}
                </div>
            )}

            {selectedLesson && (
                <LessonModal
                    lesson={selectedLesson}
                    allLessons={course.lessons || []}
                    onClose={() => setSelectedLesson(null)}
                    onNavigate={setSelectedLesson}
                />
            )}
        </div>
    );
}

function LessonRow({
    lesson,
    index,
    locked,
    onClick,
    accentColor,
}: {
    lesson: Lesson;
    index: number;
    locked?: boolean;
    onClick?: () => void;
    accentColor?: string;
}) {
    const { t } = useUIStore();
    const c = accentColor || "var(--primary)";
    return (
        <div
            onClick={locked ? undefined : onClick}
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.55 : 1,
                transition: "all var(--transition-base)",
            }}
            onMouseEnter={(ev) => {
                if (!locked) {
                    (ev.currentTarget as HTMLElement).style.borderColor = c;
                    (ev.currentTarget as HTMLElement).style.transform =
                        "translateX(4px)";
                }
            }}
            onMouseLeave={(ev) => {
                (ev.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                (ev.currentTarget as HTMLElement).style.transform =
                    "translateX(0)";
            }}
        >
            <div
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: locked ? "var(--bg-elevated)" : `${c}18`,
                    border: `2px solid ${locked ? "var(--border)" : c + "40"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: locked ? "var(--text-muted)" : c,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-display)",
                    flexShrink: 0,
                }}
            >
                {locked ? <Lock size={13} /> : index}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p
                    style={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        marginBottom: "3px",
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
                        gap: "12px",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {(lesson._count?.materials || 0) > 0 && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                            }}
                        >
                            <FileText size={11} />
                            {lesson._count!.materials} files
                        </span>
                    )}
                    {(lesson._count?.quizzes || 0) > 0 && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                            }}
                        >
                            <Award size={11} />
                            {lesson._count!.quizzes}{" "}
                            {t.quiz.title.toLowerCase()}
                        </span>
                    )}
                    {lesson.videoUrl && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                            }}
                        >
                            <Play size={11} />
                            Video
                        </span>
                    )}
                </div>
            </div>
            {!locked && (
                <ChevronRight
                    size={15}
                    color="var(--text-muted)"
                    style={{ flexShrink: 0 }}
                />
            )}
        </div>
    );
}

// ─── Lesson Modal ─────────────────────────────────────────
function LessonModal({
    lesson,
    allLessons,
    onClose,
    onNavigate,
}: {
    lesson: Lesson;
    allLessons: Lesson[];
    onClose: () => void;
    onNavigate: (l: Lesson) => void;
}) {
    const navigate = useNavigate();
    const { data: fullLesson, isLoading } = useQuery({
        queryKey: ["lesson", lesson.id],
        queryFn: () => lessonsApi.getOne(lesson.id),
    });
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
        currentIndex < allLessons.length - 1
            ? allLessons[currentIndex + 1]
            : null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                background: "rgba(5,11,20,0.92)",
                backdropFilter: "blur(12px)",
                animation: "fadeIn 0.2s ease",
            }}
        >
            {/* Sidebar */}
            <div
                style={{
                    width: "240px",
                    background: "var(--bg-surface)",
                    borderRight: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    overflowY: "auto",
                }}
            >
                <div
                    style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <p
                        style={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        Lessons
                    </p>
                    <button
                        onClick={onClose}
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            width: 26,
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "13px",
                        }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ padding: "8px", flex: 1 }}>
                    {allLessons.map((l, idx) => {
                        const active = l.id === lesson.id;
                        return (
                            <button
                                key={l.id}
                                onClick={() => onNavigate(l)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "9px 12px",
                                    borderRadius: "var(--radius-md)",
                                    border: "none",
                                    background: active
                                        ? "var(--primary-dim)"
                                        : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "2px",
                                    transition: "all 0.15s",
                                }}
                            >
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        background: active
                                            ? "var(--primary)"
                                            : "var(--bg-elevated)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                        color: active
                                            ? "#050b14"
                                            : "var(--text-muted)",
                                    }}
                                >
                                    {idx + 1}
                                </div>
                                <span
                                    style={{
                                        fontSize: "0.8rem",
                                        color: active
                                            ? "var(--primary)"
                                            : "var(--text-secondary)",
                                        fontWeight: active ? 600 : 400,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {l.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflowY: "auto",
                    background: "var(--bg-base)",
                }}
            >
                {/* Top nav */}
                <div
                    style={{
                        padding: "13px 24px",
                        borderBottom: "1px solid var(--border)",
                        background: "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                        gap: "12px",
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                            style={{
                                fontSize: "0.7rem",
                                color: "var(--text-muted)",
                                fontFamily: "var(--font-mono)",
                                marginBottom: "2px",
                            }}
                        >
                            Lesson {currentIndex + 1} of {allLessons.length}
                        </p>
                        <h2
                            style={{
                                fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {lesson.title}
                        </h2>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button
                            onClick={() => prevLesson && onNavigate(prevLesson)}
                            disabled={!prevLesson}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "7px 13px",
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-md)",
                                color: prevLesson
                                    ? "var(--text-secondary)"
                                    : "var(--text-muted)",
                                cursor: prevLesson ? "pointer" : "not-allowed",
                                opacity: prevLesson ? 1 : 0.4,
                                fontSize: "0.8rem",
                                fontFamily: "var(--font-body)",
                                transition: "all 0.15s",
                            }}
                        >
                            <ArrowLeft size={13} /> Prev
                        </button>
                        <button
                            onClick={() => nextLesson && onNavigate(nextLesson)}
                            disabled={!nextLesson}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "7px 13px",
                                background: nextLesson
                                    ? "var(--primary)"
                                    : "var(--bg-elevated)",
                                border: `1px solid ${nextLesson ? "var(--primary)" : "var(--border)"}`,
                                borderRadius: "var(--radius-md)",
                                color: nextLesson
                                    ? "#050b14"
                                    : "var(--text-muted)",
                                cursor: nextLesson ? "pointer" : "not-allowed",
                                opacity: nextLesson ? 1 : 0.4,
                                fontSize: "0.8rem",
                                fontFamily: "var(--font-body)",
                                fontWeight: nextLesson ? 600 : 400,
                                transition: "all 0.15s",
                            }}
                        >
                            Next <ArrowRight size={13} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        padding: "clamp(20px, 4vw, 40px)",
                        maxWidth: "820px",
                        margin: "0 auto",
                        width: "100%",
                    }}
                >
                    {isLoading ? (
                        <PageLoader />
                    ) : fullLesson ? (
                        <LessonContent
                            lesson={fullLesson}
                            onNavigateToQuiz={(qId) => {
                                onClose();
                                navigate(`/quiz/${qId}`);
                            }}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

// ─── Lesson Content — vibrant Watch Video + Take Quiz ───
function LessonContent({
    lesson,
    onNavigateToQuiz,
}: {
    lesson: any;
    onNavigateToQuiz: (id: string) => void;
}) {
    const { t } = useUIStore();

    return (
        <div>
            {/* ── Watch Video — purple-to-cyan gradient ── */}
            {lesson.videoUrl && (
                <div style={{ marginBottom: "28px" }}>
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
                                gap: "10px",
                                padding: "11px 22px",
                                background:
                                    "linear-gradient(135deg, #6366f1, #22d3ee)",
                                borderRadius: "var(--radius-lg)",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                fontFamily: "var(--font-body)",
                                boxShadow: "0 4px 18px rgba(99,102,241,0.4)",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <span
                                style={{
                                    width: 28,
                                    height: 28,
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Play size={13} fill="#fff" />
                            </span>
                            Watch Video
                            <ExternalLink size={13} style={{ opacity: 0.7 }} />
                        </span>
                    </a>
                </div>
            )}

            {/* ── HTML lesson body ── */}
            {lesson.content && (
                <div
                    className="lesson-content"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                    style={{
                        color: "var(--text-secondary)",
                        lineHeight: 1.8,
                        fontSize: "0.9375rem",
                        marginBottom: "32px",
                    }}
                />
            )}

            {/* ── Materials ── */}
            {lesson.materials && lesson.materials.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: "var(--info-dim)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FileText size={14} color="var(--info)" />
                        </div>
                        <h4
                            style={{
                                fontSize: "1rem",
                                color: "var(--text-primary)",
                            }}
                        >
                            Materials
                        </h4>
                    </div>
                    {lesson.materials.map((m: any) => (
                        <div
                            key={m.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                background: "var(--bg-elevated)",
                                borderRadius: "var(--radius-md)",
                                marginBottom: "8px",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <FileText size={15} color="var(--info)" />
                            <span style={{ fontSize: "0.875rem", flex: 1 }}>
                                {m.filename}
                            </span>
                            {m.fileSize && (
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--text-muted)",
                                        fontFamily: "var(--font-mono)",
                                    }}
                                >
                                    {(m.fileSize / 1024).toFixed(0)} KB
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Quizzes — orange gradient Take Quiz button ── */}
            {lesson.quizzes && lesson.quizzes.length > 0 && (
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: "var(--warning-dim)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Zap size={14} color="var(--warning)" />
                        </div>
                        <h4
                            style={{
                                fontSize: "1rem",
                                color: "var(--text-primary)",
                            }}
                        >
                            Quizzes
                        </h4>
                    </div>

                    {lesson.quizzes.map((q: any) => (
                        <div
                            key={q.id}
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(245,158,11,0.09) 0%, rgba(245,158,11,0.03) 100%)",
                                border: "1px solid rgba(245,158,11,0.28)",
                                borderRadius: "var(--radius-lg)",
                                padding: "16px 20px",
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--text-primary)",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {q.title}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "14px",
                                        fontSize: "0.75rem",
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
                                        <Award
                                            size={11}
                                            color="var(--warning)"
                                        />
                                        {t.quiz.required_pct}:{" "}
                                        <strong
                                            style={{
                                                color: "var(--warning)",
                                                marginLeft: "2px",
                                            }}
                                        >
                                            {q.passingScore}%
                                        </strong>
                                    </span>
                                    {q.timeLimit && (
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}
                                        >
                                            <Clock
                                                size={11}
                                                color="var(--info)"
                                            />
                                            {q.timeLimit} min
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Take Quiz — vibrant amber→orange gradient */}
                            <button
                                onClick={() => onNavigateToQuiz(q.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 20px",
                                    flexShrink: 0,
                                    background:
                                        "linear-gradient(135deg, #f59e0b, #f97316)",
                                    border: "none",
                                    borderRadius: "var(--radius-md)",
                                    color: "#050b14",
                                    fontWeight: 700,
                                    fontSize: "0.875rem",
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 4px 16px rgba(245,158,11,0.38)",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(ev) => {
                                    (
                                        ev.currentTarget as HTMLElement
                                    ).style.transform = "scale(1.05)";
                                    (
                                        ev.currentTarget as HTMLElement
                                    ).style.boxShadow =
                                        "0 6px 22px rgba(245,158,11,0.55)";
                                }}
                                onMouseLeave={(ev) => {
                                    (
                                        ev.currentTarget as HTMLElement
                                    ).style.transform = "scale(1)";
                                    (
                                        ev.currentTarget as HTMLElement
                                    ).style.boxShadow =
                                        "0 4px 16px rgba(245,158,11,0.38)";
                                }}
                            >
                                <Zap size={14} />
                                {t.quiz.takeQuiz}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── My Enrolled Courses ─────────────────────────────────
export function MyCoursesPage() {
    const { t } = useUIStore();
    const { data: enrollments, isLoading } = useQuery({
        queryKey: ["my-enrollments"],
        queryFn: enrollmentsApi.getMyEnrollments,
    });
    if (isLoading) return <SkeletonCards count={6} />;
    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.courses.myCourseTitle}
                subtitle={`${enrollments?.length || 0} ${t.courses.myCourseDesc}`}
            />
            {!enrollments?.length ? (
                <EmptyState
                    icon={<BookMarked size={48} />}
                    title={t.courses.notEnrolledTitle}
                    description={t.courses.notEnrolledDesc}
                    action={
                        <Link to="/courses">
                            <Button>{t.dashboard.browseCourses}</Button>
                        </Link>
                    }
                />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(270px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {enrollments.map(
                        (e, idx) =>
                            e.course && (
                                <Link
                                    key={e.id}
                                    to={`/courses/${e.courseId}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        style={{
                                            background: "var(--bg-card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "var(--radius-xl)",
                                            overflow: "hidden",
                                            transition:
                                                "all var(--transition-base)",
                                            animation: `fadeInUp 0.4s ease ${idx * 0.04}s both`,
                                        }}
                                        onMouseEnter={(el) => {
                                            (
                                                el.currentTarget as HTMLElement
                                            ).style.borderColor =
                                                "var(--primary)";
                                            (
                                                el.currentTarget as HTMLElement
                                            ).style.transform =
                                                "translateY(-4px)";
                                        }}
                                        onMouseLeave={(el) => {
                                            (
                                                el.currentTarget as HTMLElement
                                            ).style.borderColor =
                                                "var(--border)";
                                            (
                                                el.currentTarget as HTMLElement
                                            ).style.transform = "translateY(0)";
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 80,
                                                background:
                                                    "linear-gradient(135deg,var(--primary-dim),var(--accent-dim))",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <BookOpen
                                                size={28}
                                                color="var(--primary)"
                                                style={{ opacity: 0.8 }}
                                            />
                                        </div>
                                        <div style={{ padding: "16px" }}>
                                            <h3
                                                style={{
                                                    fontSize: "0.95rem",
                                                    marginBottom: "8px",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient:
                                                        "vertical" as any,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {e.course.title}
                                            </h3>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-muted)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <Layers size={12} />
                                                    {e.course._count?.lessons ||
                                                        0}{" "}
                                                    {t.common.lessons}
                                                </span>
                                                <Badge variant="success" dot>
                                                    {t.courses.enrolled}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ),
                    )}
                </div>
            )}
        </div>
    );
}

// ─── My Quiz Results ─────────────────────────────────────
export function MyResultsPage() {
    const { t } = useUIStore();
    const [reviewId, setReviewId] = useState<string | null>(null);
    const { data: attempts, isLoading } = useQuery({
        queryKey: ["my-attempts"],
        queryFn: quizzesApi.getMyAttempts,
    });
    const passed = attempts?.filter((a) => a.passed).length || 0;
    const failed = attempts?.filter((a) => !a.passed).length || 0;
    if (isLoading) return <PageLoader />;
    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={`My ${t.quiz.title} Results`}
                subtitle={`${attempts?.length || 0} total attempts`}
            />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "16px",
                    marginBottom: "28px",
                }}
            >
                <StatCard
                    label="Total Attempts"
                    value={attempts?.length || 0}
                    icon={<Target size={20} />}
                    color="primary"
                />
                <StatCard
                    label={t.dashboard.quizzesPassed}
                    value={passed}
                    icon={<CheckCircle size={20} />}
                    color="success"
                    delay={0.05}
                />
                <StatCard
                    label="Failed"
                    value={failed}
                    icon={<XCircle size={20} />}
                    color="danger"
                    delay={0.1}
                />
            </div>
            {!attempts?.length ? (
                <EmptyState
                    icon={<Award size={48} />}
                    title={t.dashboard.noAttempts}
                />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {attempts.map((a, idx) => (
                        <div
                            key={a.id}
                            style={{
                                background: "var(--bg-card)",
                                border: `1px solid ${a.passed ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
                                borderRadius: "var(--radius-lg)",
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                animation: `fadeIn 0.3s ease ${idx * 0.03}s both`,
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "var(--radius-md)",
                                    background: a.passed
                                        ? "var(--success-dim)"
                                        : "var(--danger-dim)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: a.passed
                                        ? "var(--success)"
                                        : "var(--danger)",
                                    flexShrink: 0,
                                }}
                            >
                                {a.passed ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <XCircle size={20} />
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: "140px" }}>
                                <p
                                    style={{
                                        fontWeight: 600,
                                        marginBottom: "3px",
                                    }}
                                >
                                    {a.quiz?.title}
                                </p>
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {t.quiz.required}: {a.quiz?.passingScore}% •{" "}
                                    {a.submittedAt
                                        ? format(
                                              new Date(a.submittedAt),
                                              "MMM d, yyyy HH:mm",
                                          )
                                        : "—"}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    flexShrink: 0,
                                }}
                            >
                                <div style={{ textAlign: "right" }}>
                                    <p
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            fontFamily: "var(--font-display)",
                                            color: a.passed
                                                ? "var(--success)"
                                                : "var(--danger)",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {Math.round(a.score || 0)}%
                                    </p>
                                    <Badge
                                        variant={
                                            a.passed ? "success" : "danger"
                                        }
                                    >
                                        {a.passed ? t.quiz.pass : t.quiz.fail}
                                    </Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setReviewId(a.id)}
                                >
                                    Review
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Modal
                open={!!reviewId}
                onClose={() => setReviewId(null)}
                title="Quiz Review"
                size="lg"
            >
                {reviewId && <AttemptReview attemptId={reviewId} />}
            </Modal>
        </div>
    );
}

function AttemptReview({ attemptId }: { attemptId: string }) {
    const { data: attempt, isLoading } = useQuery({
        queryKey: ["attempt", attemptId],
        queryFn: () => quizzesApi.getAttemptDetails(attemptId),
    });
    if (isLoading) return <PageLoader />;
    if (!attempt) return null;
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                {[
                    {
                        l: "Score",
                        v: `${Math.round(attempt.score || 0)}%`,
                        c: attempt.passed ? "var(--success)" : "var(--danger)",
                    },
                    {
                        l: "Correct",
                        v: `${attempt.correctCount}/${attempt.totalQuestions}`,
                        c: "var(--text-primary)",
                    },
                ].map(({ l, v, c }) => (
                    <div key={l}>
                        <p
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            {l}
                        </p>
                        <p
                            style={{
                                fontSize: "1.375rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-display)",
                                color: c,
                            }}
                        >
                            {v}
                        </p>
                    </div>
                ))}
                <div>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        Result
                    </p>
                    <Badge
                        variant={attempt.passed ? "success" : "danger"}
                        size="md"
                    >
                        {attempt.passed ? "PASSED" : "FAILED"}
                    </Badge>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                }}
            >
                {((attempt as any).quiz?.questions || []).map(
                    (q: any, idx: number) => {
                        const given = attempt.answers?.find(
                            (a) => a.questionId === q.id,
                        );
                        const isCorrect = given?.selectedOption?.isCorrect;
                        return (
                            <div
                                key={q.id}
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: `1px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                                    borderRadius: "var(--radius-lg)",
                                    padding: "14px 16px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginBottom: "10px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            background: isCorrect
                                                ? "var(--success-dim)"
                                                : "var(--danger-dim)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: isCorrect
                                                ? "var(--success)"
                                                : "var(--danger)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {isCorrect ? (
                                            <CheckCircle size={13} />
                                        ) : (
                                            <XCircle size={13} />
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {idx + 1}. {q.text}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        paddingLeft: "32px",
                                    }}
                                >
                                    {q.answerOptions?.map((opt: any) => {
                                        const wasSelected =
                                            given?.selectedOptionId === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                style={{
                                                    padding: "7px 12px",
                                                    borderRadius:
                                                        "var(--radius-md)",
                                                    fontSize: "0.85rem",
                                                    background: opt.isCorrect
                                                        ? "var(--success-dim)"
                                                        : wasSelected &&
                                                            !opt.isCorrect
                                                          ? "var(--danger-dim)"
                                                          : "var(--bg-card)",
                                                    border: `1px solid ${opt.isCorrect ? "rgba(16,185,129,0.3)" : wasSelected && !opt.isCorrect ? "rgba(244,63,94,0.3)" : "var(--border)"}`,
                                                    color: opt.isCorrect
                                                        ? "var(--success)"
                                                        : wasSelected &&
                                                            !opt.isCorrect
                                                          ? "var(--danger)"
                                                          : "var(--text-secondary)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                <span>
                                                    {opt.isCorrect
                                                        ? "✓"
                                                        : wasSelected &&
                                                            !opt.isCorrect
                                                          ? "✗"
                                                          : "·"}
                                                </span>
                                                <span>{opt.text}</span>
                                                {wasSelected &&
                                                    !opt.isCorrect && (
                                                        <Badge
                                                            variant="danger"
                                                            size="sm"
                                                        >
                                                            Your answer
                                                        </Badge>
                                                    )}
                                                {wasSelected &&
                                                    opt.isCorrect && (
                                                        <Badge
                                                            variant="success"
                                                            size="sm"
                                                        >
                                                            Your answer
                                                        </Badge>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    },
                )}
            </div>
        </div>
    );
}

// ─── Quiz Page ────────────────────────────────────────────
export function QuizPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useUIStore();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<QuizAttempt | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ["quiz-student", id],
        queryFn: () => quizzesApi.getOne(id!),
        enabled: !!id,
    });

    React.useEffect(() => {
        if (quiz?.timeLimit && !result) {
            setTimeLeft(quiz.timeLimit * 60);
            const interval = setInterval(
                () => setTimeLeft((p) => (p !== null && p > 0 ? p - 1 : 0)),
                1000,
            );
            return () => clearInterval(interval);
        }
    }, [quiz?.id]);

    const submitMutation = useMutation({
        mutationFn: (a: { questionId: string; selectedOptionId: string }[]) =>
            quizzesApi.submitAttempt(id!, a),
        onSuccess: setResult,
    });

    if (isLoading) return <PageLoader />;
    if (!quiz) return <EmptyState title="Quiz not found" />;

    const answeredCount = Object.keys(answers).length;
    const totalQ = quiz.questions?.length || 0;

    if (result) {
        return (
            <div
                style={{
                    maxWidth: 620,
                    margin: "0 auto",
                    animation: "fadeInUp 0.4s ease",
                    padding: "0 16px",
                }}
            >
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: `2px solid ${result.passed ? "var(--success)" : "var(--danger)"}`,
                        borderRadius: "var(--radius-xl)",
                        padding: "clamp(24px,5vw,40px)",
                        textAlign: "center",
                        boxShadow: `0 0 40px ${result.passed ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`,
                    }}
                >
                    <div style={{ fontSize: "4rem", marginBottom: "16px" }}>
                        {result.passed ? "🎉" : "😔"}
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(1.5rem,4vw,2rem)",
                            marginBottom: "8px",
                            color: result.passed
                                ? "var(--success)"
                                : "var(--danger)",
                        }}
                    >
                        {result.passed
                            ? t.quiz.congratulations
                            : t.quiz.notQuite}
                    </h1>
                    <p
                        style={{
                            color: "var(--text-muted)",
                            marginBottom: "28px",
                        }}
                    >
                        {result.passed
                            ? t.quiz.passedMessage
                            : `${t.quiz.required}: ${quiz.passingScore}%`}
                    </p>
                    <div
                        style={{
                            background: "var(--bg-elevated)",
                            borderRadius: "var(--radius-lg)",
                            padding: "24px",
                            marginBottom: "28px",
                            display: "flex",
                            gap: "32px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            {
                                l: t.quiz.yourScore,
                                v: `${Math.round(result.score || 0)}%`,
                                c: result.passed
                                    ? "var(--success)"
                                    : "var(--danger)",
                            },
                            {
                                l: t.quiz.correctAnswers,
                                v: `${result.correctCount}/${result.totalQuestions}`,
                                c: "var(--text-secondary)",
                            },
                            {
                                l: t.quiz.required,
                                v: `${quiz.passingScore}%`,
                                c: "var(--primary)",
                            },
                        ].map(({ l, v, c }) => (
                            <div key={l}>
                                <p
                                    style={{
                                        fontSize: "2.5rem",
                                        fontWeight: 800,
                                        fontFamily: "var(--font-display)",
                                        color: c,
                                        lineHeight: 1,
                                    }}
                                >
                                    {v}
                                </p>
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "var(--text-muted)",
                                        marginTop: "4px",
                                    }}
                                >
                                    {l}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            {t.quiz.backToLesson}
                        </Button>
                        <Button onClick={() => navigate("/my-results")}>
                            {t.quiz.viewResults}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: 760,
                margin: "0 auto",
                animation: "fadeInUp 0.4s ease",
                padding: "0 16px",
            }}
        >
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "clamp(16px,3vw,22px) clamp(16px,4vw,28px)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "clamp(1rem,2.5vw,1.25rem)",
                            marginBottom: "3px",
                        }}
                    >
                        {quiz.title}
                    </h1>
                    {quiz.description && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            {quiz.description}
                        </p>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {timeLeft !== null && (
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontWeight: 600,
                                color:
                                    timeLeft < 60
                                        ? "var(--danger)"
                                        : "var(--primary)",
                                fontSize: "1.125rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <Clock size={15} />
                            {Math.floor(timeLeft / 60)}:
                            {String(timeLeft % 60).padStart(2, "0")}
                        </div>
                    )}
                    <Badge variant="info">
                        {answeredCount}/{totalQ} {t.quiz.answered}
                    </Badge>
                    <Badge variant="warning">
                        {t.quiz.required_pct}: {quiz.passingScore}%
                    </Badge>
                </div>
            </div>
            <div
                style={{
                    background: "var(--bg-elevated)",
                    height: 5,
                    borderRadius: 3,
                    marginBottom: "24px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        borderRadius: 3,
                        background:
                            "linear-gradient(90deg,var(--primary),var(--accent))",
                        width: `${totalQ > 0 ? (answeredCount / totalQ) * 100 : 0}%`,
                        transition: "width 0.4s ease",
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    marginBottom: "28px",
                }}
            >
                {quiz.questions?.map((q, qi) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        index={qi + 1}
                        selectedOption={answers[q.id]}
                        onSelect={(optId) =>
                            setAnswers((p) => ({ ...p, [q.id]: optId }))
                        }
                    />
                ))}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    flexWrap: "wrap",
                }}
            >
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    {t.common.cancel}
                </Button>
                <Button
                    loading={submitMutation.isPending}
                    disabled={answeredCount === 0}
                    onClick={() =>
                        submitMutation.mutate(
                            Object.entries(answers).map(
                                ([questionId, selectedOptionId]) => ({
                                    questionId,
                                    selectedOptionId,
                                }),
                            ),
                        )
                    }
                    size="lg"
                >
                    {t.quiz.submitQuiz} ({answeredCount}/{totalQ})
                </Button>
            </div>
        </div>
    );
}

function QuestionCard({
    question,
    index,
    selectedOption,
    onSelect,
}: {
    question: Question;
    index: number;
    selectedOption?: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(16px,3vw,22px) clamp(16px,4vw,24px)",
                animation: `fadeInUp 0.3s ease ${index * 0.03}s both`,
            }}
        >
            <p
                style={{
                    fontWeight: 600,
                    marginBottom: "16px",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                }}
            >
                <span
                    style={{
                        color: "var(--primary)",
                        fontFamily: "var(--font-mono)",
                        marginRight: "8px",
                    }}
                >
                    {String(index).padStart(2, "0")}.
                </span>
                {question.text}
            </p>
            <div
                style={{ display: "flex", flexDirection: "column", gap: "9px" }}
            >
                {question.answerOptions?.map((opt) => {
                    const selected = selectedOption === opt.id;
                    return (
                        <label
                            key={opt.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "11px 16px",
                                borderRadius: "var(--radius-md)",
                                border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                                background: selected
                                    ? "var(--primary-dim)"
                                    : "var(--bg-elevated)",
                                cursor: "pointer",
                                transition: "all var(--transition-fast)",
                            }}
                        >
                            <div
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                                    background: selected
                                        ? "var(--primary)"
                                        : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    transition: "all var(--transition-fast)",
                                }}
                            >
                                {selected && (
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#050b14",
                                        }}
                                    />
                                )}
                            </div>
                            <input
                                type="radio"
                                name={`q-${question.id}`}
                                value={opt.id}
                                checked={selected}
                                onChange={() => onSelect(opt.id)}
                                style={{ display: "none" }}
                            />
                            <span
                                style={{
                                    fontSize: "0.9rem",
                                    color: selected
                                        ? "var(--text-primary)"
                                        : "var(--text-secondary)",
                                }}
                            >
                                {opt.text}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
