import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Users,
    BookOpen,
    Shield,
    Activity,
    BarChart3,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Wifi,
    Ban,
    RefreshCw,
    Search,
    Filter,
    ChevronDown,
    Eye,
    Trash2,
    UserCheck,
    UserX,
    GraduationCap,
    Database,
    Globe,
    MonitorOff,
    Cpu,
    Layers,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    analyticsApi,
    usersApi,
    securityApi,
    sessionsApi,
    auditApi,
    coursesApi,
} from "../../api";
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
    ConfirmDialog,
    Select,
    Table,
} from "../../components/ui";
import { useUIStore } from "../../lib/uiStore";
import type {
    User,
    SecurityEvent,
    Session,
    AuditLog,
    Course,
} from "../../types";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const CHART_COLORS = [
    "#00d4aa",
    "#6366f1",
    "#22d3ee",
    "#f59e0b",
    "#f43f5e",
    "#10b981",
    "#8b5cf6",
];

const DarkTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
            }}
        >
            {label && (
                <p style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
                    {label}
                </p>
            )}
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color || "var(--primary)" }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

// ─── Admin Dashboard ─────────────────────────────────────
export function AdminDashboardPage() {
    const { t } = useUIStore();
    const { data: metrics, isLoading } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: analyticsApi.getDashboard,
    });
    const { data: failedLogins } = useQuery({
        queryKey: ["failed-logins", 7],
        queryFn: () => analyticsApi.getFailedLogins(7),
    });

    if (isLoading) return <PageLoader />;

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1
                    style={{
                        fontSize: "clamp(1.25rem, 4vw, 1.875rem)",
                        marginBottom: "6px",
                    }}
                >
                    <span style={{ color: "var(--danger)" }}>Admin</span>{" "}
                    {t.dashboard.systemOverview}
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    {t.admin.realtimeDesc}
                </p>
            </div>

            {/* Overview stats — ✅ FIXED: second card was showing "Total Users" instead of "Total Courses" */}
            <div
                className="grid-stats"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px",
                    marginBottom: "28px",
                }}
            >
                <StatCard
                    label={t.dashboard.totalUsers}
                    value={metrics?.overview.totalUsers || 0}
                    icon={<Users size={20} />}
                    color="primary"
                    delay={0}
                />
                <StatCard
                    label={t.dashboard.totalCourses}
                    value={metrics?.overview.totalCourses || 0}
                    icon={<BookOpen size={20} />}
                    color="secondary"
                    delay={0.04}
                />
                <StatCard
                    label={t.dashboard.totalEnrollments}
                    value={metrics?.overview.totalEnrollments || 0}
                    icon={<GraduationCap size={20} />}
                    color="info"
                    delay={0.08}
                />
                <StatCard
                    label={t.dashboard.activeSessions}
                    value={metrics?.overview.activeSessions || 0}
                    icon={<Activity size={20} />}
                    color="success"
                    delay={0.12}
                />
                <StatCard
                    label={t.dashboard.blockedUsers}
                    value={metrics?.overview.blockedUsers || 0}
                    icon={<Ban size={20} />}
                    color="danger"
                    delay={0.16}
                />
                <StatCard
                    label={t.dashboard.failedLogins}
                    value={metrics?.security.failedLogins24h || 0}
                    icon={<Shield size={20} />}
                    color="warning"
                    delay={0.2}
                />
            </div>

            <div
                className="grid-responsive"
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                {/* Failed Logins Chart */}
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                        minWidth: 0,
                    }}
                >
                    <h3 style={{ marginBottom: "20px", fontSize: "1rem" }}>
                        {t.admin.failedLoginsChart} (7d)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={failedLogins || []}>
                            <defs>
                                <linearGradient
                                    id="failGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#f43f5e"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#f43f5e"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 11,
                                    fontFamily: "var(--font-mono)",
                                }}
                                tickFormatter={(d) => d.slice(5)}
                            />
                            <YAxis
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 11,
                                }}
                            />
                            <Tooltip content={<DarkTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name={t.admin.failedLoginsLabel}
                                stroke="#f43f5e"
                                fill="url(#failGrad)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent security events */}
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    <h3 style={{ marginBottom: "14px", fontSize: "1rem" }}>
                        {t.admin.recentEvents}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            maxHeight: 220,
                            overflowY: "auto",
                        }}
                    >
                        {metrics?.recentSecurityEvents
                            ?.slice(0, 6)
                            .map((ev) => (
                                <div
                                    key={ev.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <SecurityEventBadge
                                        type={ev.eventType}
                                        small
                                    />
                                    <div
                                        style={{ flex: 1, overflow: "hidden" }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-secondary)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {ev.user?.email ||
                                                ev.ipAddress ||
                                                "anonymous"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Security Event Badge ────────────────────────────────
function SecurityEventBadge({
    type,
    small,
}: {
    type: string;
    small?: boolean;
}) {
    const { t } = useUIStore();
    const config: Record<string, { variant: any; label: string }> = {
        LOGIN_SUCCESS: { variant: "success", label: t.security.loginSuccess },
        LOGIN_FAILURE: { variant: "danger", label: t.security.loginFailure },
        LOGOUT: { variant: "neutral", label: t.security.logout },
        BRUTE_FORCE_DETECTED: { variant: "danger", label: t.security.bruteForceDetected },
        ACCOUNT_BLOCKED: { variant: "danger", label: t.security.accountBlocked },
        ACCOUNT_UNBLOCKED: { variant: "info", label: t.security.accountUnblocked },
        SUSPICIOUS_REQUEST: { variant: "warning", label: t.security.suspiciousRequest },
        RATE_LIMIT_TRIGGERED: { variant: "warning", label: t.security.rateLimitTriggered },
        ACCESS_DENIED: { variant: "warning", label: t.security.accessDenied },
        PASSWORD_CHANGE: { variant: "info", label: t.security.passwordChange },
        REFRESH_TOKEN: { variant: "neutral", label: t.security.refreshToken },
        SESSION_REVOKED: { variant: "warning", label: t.security.sessionRevoked },
    };
    const c = config[type] || { variant: "neutral", label: type };
    return (
        <Badge variant={c.variant}>
            {small ? c.label : c.label}
        </Badge>
    );
}

// ─── Admin Users Page ────────────────────────────────────
export function AdminUsersPage() {
    const { t } = useUIStore();
    const qc = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [confirmAction, setConfirmAction] = useState<{
        type: string;
        user: User;
    } | null>(null);
    const [roleModal, setRoleModal] = useState<User | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-users", page, search, roleFilter],
        queryFn: () =>
            usersApi.getAll({
                page,
                limit: 20,
                search: search || undefined,
                role: (roleFilter as any) || undefined,
            }),
    });

    const blockMutation = useMutation({
        mutationFn: usersApi.block,
        onSuccess: () => {
            toast.success(t.admin.userBlocked);
            qc.invalidateQueries({ queryKey: ["admin-users"] });
        },
    });
    const unblockMutation = useMutation({
        mutationFn: usersApi.unblock,
        onSuccess: () => {
            toast.success(t.admin.userUnblocked);
            qc.invalidateQueries({ queryKey: ["admin-users"] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: usersApi.delete,
        onSuccess: () => {
            toast.success(t.admin.userDeleted);
            qc.invalidateQueries({ queryKey: ["admin-users"] });
        },
    });
    const roleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string; role: string }) =>
            usersApi.changeRole(id, role),
        onSuccess: () => {
            toast.success(t.admin.roleChanged);
            qc.invalidateQueries({ queryKey: ["admin-users"] });
            setRoleModal(null);
        },
    });

    const columns = [
        {
            key: "user",
            header: t.common.name,
            render: (u: User) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--primary-dim)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            fontFamily: "var(--font-display)",
                            flexShrink: 0,
                        }}
                    >
                        {u.firstName[0]}
                        {u.lastName[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p
                            style={{
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {u.firstName} {u.lastName}
                        </p>
                        <p
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {u.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            header: t.common.role,
            render: (u: User) => (
                <Badge
                    variant={
                        u.role === "ADMIN"
                            ? "danger"
                            : u.role === "TEACHER"
                              ? "warning"
                              : "primary"
                    }
                    dot
                >
                    {u.role}
                </Badge>
            ),
        },
        {
            key: "status",
            header: t.common.status,
            render: (u: User) => (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {u.isBlocked && (
                        <Badge variant="danger" dot>
                            {t.common.blocked}
                        </Badge>
                    )}
                    {!u.isActive && <Badge variant="neutral">{t.common.inactive}</Badge>}
                    {!u.isBlocked && u.isActive && (
                        <Badge variant="success" dot>
                            {t.common.active}
                        </Badge>
                    )}
                    {u.emailVerified && <Badge variant="info">✓</Badge>}
                </div>
            ),
        },
        {
            key: "createdAt",
            header: t.common.date,
            render: (u: User) => (
                <span
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {format(new Date(u.createdAt), "dd.MM.yyyy")}
                </span>
            ),
        },
        {
            key: "actions",
            header: t.common.actions,
            render: (u: User) => (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRoleModal(u)}
                    >
                        {t.admin.changeRole}
                    </Button>
                    {u.isBlocked ? (
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => unblockMutation.mutate(u.id)}
                            loading={unblockMutation.isPending}
                        >
                            <UserCheck size={12} />
                        </Button>
                    ) : (
                        u.role !== "ADMIN" && (
                            <Button
                                size="sm"
                                variant="warning"
                                onClick={() =>
                                    setConfirmAction({ type: "block", user: u })
                                }
                            >
                                <UserX size={12} />
                            </Button>
                        )
                    )}
                    {u.role !== "ADMIN" && (
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                                setConfirmAction({ type: "delete", user: u })
                            }
                        >
                            <Trash2 size={12} />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.admin.allUsers}
                subtitle={`${data?.meta.total || 0} ${t.admin.users.toLowerCase()}`}
            />

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ flex: 1, minWidth: "180px" }}>
                    <Input
                        placeholder={`${t.common.search} ${t.admin.users.toLowerCase()}...`}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearch(searchInput);
                                setPage(1);
                            }
                        }}
                        leftIcon={<Search size={15} />}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
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
                    }}
                >
                    <option value="">{t.admin.allRoles}</option>
                    <option value="STUDENT">{t.common.student}</option>
                    <option value="TEACHER">{t.common.teacher}</option>
                    <option value="ADMIN">{t.common.admin}</option>
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
                    data={data?.data || []}
                    loading={isLoading}
                />
            </div>
            <Pagination
                page={page}
                totalPages={data?.meta.totalPages || 1}
                onChange={setPage}
            />

            <Modal
                open={!!roleModal}
                onClose={() => setRoleModal(null)}
                title={t.admin.changeRole}
                size="sm"
            >
                {roleModal && (
                    <div>
                        <p
                            style={{
                                marginBottom: "16px",
                                color: "var(--text-secondary)",
                            }}
                        >
                            {t.admin.changeRoleFor}{" "}
                            <strong>
                                {roleModal.firstName} {roleModal.lastName}
                            </strong>
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {(["STUDENT", "TEACHER", "ADMIN"] as const).map(
                                (r) => (
                                    <button
                                        key={r}
                                        onClick={() =>
                                            roleMutation.mutate({
                                                id: roleModal.id,
                                                role: r,
                                            })
                                        }
                                        style={{
                                            padding: "12px",
                                            background:
                                                roleModal.role === r
                                                    ? "var(--primary-dim)"
                                                    : "var(--bg-elevated)",
                                            border: `1px solid ${roleModal.role === r ? "var(--border-strong)" : "var(--border)"}`,
                                            borderRadius: "var(--radius-md)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            color: "var(--text-primary)",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "0.9rem",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {r} {roleModal.role === r && "✓"}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => {
                    if (!confirmAction) return;
                    if (confirmAction.type === "block")
                        blockMutation.mutate(confirmAction.user.id);
                    if (confirmAction.type === "delete")
                        deleteMutation.mutate(confirmAction.user.id);
                }}
                title={
                    confirmAction?.type === "block"
                        ? t.admin.blockUser
                        : t.admin.deleteUser
                }
                message={
                    confirmAction?.type === "block"
                        ? `${t.admin.blockUser} ${confirmAction?.user.email}?`
                        : `${t.admin.deleteUser} ${confirmAction?.user.email}?`
                }
                confirmLabel={
                    confirmAction?.type === "block" ? t.admin.block : t.common.delete
                }
                danger
            />
        </div>
    );
}

// ─── Admin Courses Page ──────────────────────────────────
export function AdminCoursesPage() {
    const { t } = useUIStore();
    const qc = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["all-courses", page, search],
        queryFn: () =>
            coursesApi.getAll({ page, limit: 20, search: search || undefined }),
    });

    const toggleMutation = useMutation({
        mutationFn: coursesApi.togglePublish,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["all-courses"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: coursesApi.delete,
        onSuccess: () => {
            toast.success(t.admin.courseDeleted);
            qc.invalidateQueries({ queryKey: ["all-courses"] });
        },
    });
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
            key: "teacher",
            header: t.admin.teacherCol,
            render: (c: Course) => (
                <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                    {c.teacher?.firstName} {c.teacher?.lastName}
                </span>
            ),
        },
        {
            key: "stats",
            header: t.admin.statsCol,
            render: (c: Course) => (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span>{c._count?.lessons || 0} {t.common.lessons}</span>
                    <span style={{ margin: "0 6px" }}>•</span>
                    <span>{c._count?.enrollments || 0} {t.common.students}</span>
                </div>
            ),
        },
        {
            key: "status",
            header: t.common.status,
            render: (c: Course) => (
                <Badge variant={c.isPublished ? "success" : "neutral"} dot>
                    {c.isPublished ? t.dashboard.published : t.common.draft}
                </Badge>
            ),
        },
        {
            key: "actions",
            header: t.common.actions,
            render: (c: Course) => (
                <div style={{ display: "flex", gap: "6px" }}>
                    <Button
                        size="sm"
                        variant={c.isPublished ? "ghost" : "outline"}
                        onClick={() => toggleMutation.mutate(c.id)}
                    >
                        {c.isPublished ? t.common.unpublish : t.common.publish}
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteId(c.id)}
                    >
                        <Trash2 size={12} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={`${t.common.all} ${t.nav.courses}`}
                subtitle={`${data?.meta.total || 0} ${t.common.total.toLowerCase()}`}
            />
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                    <Input
                        placeholder={`${t.common.search} ${t.nav.courses.toLowerCase()}...`}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setSearch(searchInput);
                        }}
                        leftIcon={<Search size={15} />}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setSearch(searchInput)}
                >
                    {t.common.search}
                </Button>
            </div>
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
                    data={data?.data || []}
                    loading={isLoading}
                />
            </div>
            <Pagination
                page={page}
                totalPages={data?.meta.totalPages || 1}
                onChange={setPage}
            />
            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    deleteMutation.mutate(deleteId!);
                    setDeleteId(null);
                }}
                title={t.admin.deleteCourse}
                message={t.admin.deleteCourseMsg}
                confirmLabel={t.common.delete}
                danger
            />
        </div>
    );
}

// ─── Security Events Page ────────────────────────────────
export function SecurityEventsPage() {
    const { t } = useUIStore();
    const [page, setPage] = useState(1);
    const [eventType, setEventType] = useState("");
    const [ipFilter, setIpFilter] = useState("");
    const [ipInput, setIpInput] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: [
            "security-events",
            page,
            eventType,
            ipFilter,
            startDate,
            endDate,
        ],
        queryFn: () =>
            securityApi.getAll({
                page,
                limit: 25,
                eventType: eventType || undefined,
                ipAddress: ipFilter || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            }),
    });

    const eventTypes = [
        "LOGIN_SUCCESS",
        "LOGIN_FAILURE",
        "LOGOUT",
        "REFRESH_TOKEN",
        "PASSWORD_CHANGE",
        "ACCOUNT_BLOCKED",
        "ACCOUNT_UNBLOCKED",
        "BRUTE_FORCE_DETECTED",
        "RATE_LIMIT_TRIGGERED",
        "SUSPICIOUS_REQUEST",
        "ACCESS_DENIED",
        "SESSION_REVOKED",
    ];

    const columns = [
        {
            key: "eventType",
            header: t.admin.eventType,
            render: (e: SecurityEvent) => (
                <SecurityEventBadge type={e.eventType} />
            ),
        },
        {
            key: "user",
            header: t.common.user,
            render: (e: SecurityEvent) =>
                e.user ? (
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-primary)",
                        }}
                    >
                        {e.user.email}
                    </p>
                ) : (
                    <span
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                        }}
                    >
                        anonymous
                    </span>
                ),
        },
        {
            key: "ipAddress",
            header: t.admin.ipAddress,
            render: (e: SecurityEvent) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {e.ipAddress || "—"}
                </span>
            ),
        },
        {
            key: "occurredAt",
            header: t.admin.occurredAt,
            render: (e: SecurityEvent) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {format(new Date(e.occurredAt), "dd.MM.yy HH:mm:ss")}
                </span>
            ),
        },
        {
            key: "details",
            header: t.common.details,
            render: (e: SecurityEvent) =>
                e.details ? (
                    <span
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-mono)",
                            maxWidth: "200px",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {JSON.stringify(e.details)}
                    </span>
                ) : null,
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.admin.securityEvents}
                subtitle={`${data?.meta.total || 0} ${t.common.totalEvents}`}
            />

            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px",
                    marginBottom: "20px",
                }}
            >
                <div
                    className="grid-responsive"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "12px",
                    }}
                >
                    <select
                        value={eventType}
                        onChange={(e) => {
                            setEventType(e.target.value);
                            setPage(1);
                        }}
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            padding: "9px 14px",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        <option value="">{t.admin.allEventTypes}</option>
                        {eventTypes.map((et) => {
                            const eventLabels: Record<string, string> = {
                                LOGIN_SUCCESS: t.security.loginSuccess,
                                LOGIN_FAILURE: t.security.loginFailure,
                                LOGOUT: t.security.logout,
                                REFRESH_TOKEN: t.security.refreshToken,
                                PASSWORD_CHANGE: t.security.passwordChange,
                                ACCOUNT_BLOCKED: t.security.accountBlocked,
                                ACCOUNT_UNBLOCKED: t.security.accountUnblocked,
                                BRUTE_FORCE_DETECTED: t.security.bruteForceDetected,
                                RATE_LIMIT_TRIGGERED: t.security.rateLimitTriggered,
                                SUSPICIOUS_REQUEST: t.security.suspiciousRequest,
                                ACCESS_DENIED: t.security.accessDenied,
                                SESSION_REVOKED: t.security.sessionRevoked,
                            };
                            return (
                                <option key={et} value={et}>
                                    {eventLabels[et] || et.replace(/_/g, " ")}
                                </option>
                            );
                        })}
                    </select>
                    <Input
                        placeholder={t.admin.filterByIp}
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIpFilter(ipInput);
                                setPage(1);
                            }
                        }}
                        leftIcon={<Globe size={14} />}
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            padding: "9px 14px",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            fontFamily: "var(--font-body)",
                            outline: "none",
                        }}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            padding: "9px 14px",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            fontFamily: "var(--font-body)",
                            outline: "none",
                        }}
                    />
                    <Button
                        variant="outline"
                        onClick={() => {
                            setEventType("");
                            setIpFilter("");
                            setIpInput("");
                            setStartDate("");
                            setEndDate("");
                            setPage(1);
                        }}
                    >
                        {t.common.clear}
                    </Button>
                </div>
            </div>

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
                    data={data?.data || []}
                    loading={isLoading}
                />
            </div>
            <Pagination
                page={page}
                totalPages={data?.meta.totalPages || 1}
                onChange={setPage}
            />
        </div>
    );
}

// ─── Admin Sessions ──────────────────────────────────────
export function AdminSessionsPage() {
    const { t } = useUIStore();
    const qc = useQueryClient();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-sessions", page],
        queryFn: () => sessionsApi.getAll({ page, limit: 20 }),
    });
    const revokeMutation = useMutation({
        mutationFn: sessionsApi.revoke,
        onSuccess: () => {
            toast.success(t.admin.sessionRevoked);
            qc.invalidateQueries({ queryKey: ["admin-sessions"] });
        },
    });
    const revokeAllMutation = useMutation({
        mutationFn: sessionsApi.revokeAllUser,
        onSuccess: () => {
            toast.success(t.admin.allSessionsRevoked);
            qc.invalidateQueries({ queryKey: ["admin-sessions"] });
        },
    });

    const columns = [
        {
            key: "user",
            header: t.common.user,
            render: (s: Session) => (
                <div>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        {s.user?.firstName} {s.user?.lastName}
                    </p>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {s.user?.email}
                    </p>
                </div>
            ),
        },
        {
            key: "role",
            header: t.common.role,
            render: (s: Session) =>
                s.user && (
                    <Badge
                        variant={
                            s.user.role === "ADMIN"
                                ? "danger"
                                : s.user.role === "TEACHER"
                                  ? "warning"
                                  : "primary"
                        }
                        dot
                    >
                        {s.user.role}
                    </Badge>
                ),
        },
        {
            key: "ip",
            header: t.admin.ipAddress,
            render: (s: Session) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {s.ipAddress || "—"}
                </span>
            ),
        },
        {
            key: "ua",
            header: t.admin.userAgent,
            render: (s: Session) => (
                <span
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        maxWidth: 200,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {s.userAgent ? s.userAgent.slice(0, 40) + "…" : "—"}
                </span>
            ),
        },
        {
            key: "expires",
            header: t.common.expires,
            render: (s: Session) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {format(new Date(s.expiresAt), "dd.MM HH:mm")}
                </span>
            ),
        },
        {
            key: "actions",
            header: t.common.actions,
            render: (s: Session) => (
                <div style={{ display: "flex", gap: "6px" }}>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => revokeMutation.mutate(s.id)}
                        loading={revokeMutation.isPending}
                    >
                        {t.admin.revokeSession}
                    </Button>
                    {s.userId && (
                        <Button
                            size="sm"
                            variant="warning"
                            onClick={() => revokeAllMutation.mutate(s.userId!)}
                        >
                            {t.admin.revokeAll}
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.admin.activeSessions}
                subtitle={`${data?.meta.total || 0} ${t.common.active.toLowerCase()}`}
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
                    data={data?.data || []}
                    loading={isLoading}
                />
            </div>
            <Pagination
                page={page}
                totalPages={data?.meta.totalPages || 1}
                onChange={setPage}
            />
        </div>
    );
}

// ─── Audit Logs Page ─────────────────────────────────────
export function AuditLogsPage() {
    const { t } = useUIStore();
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["audit-logs", page, actionFilter],
        queryFn: () =>
            auditApi.getAll({
                page,
                limit: 25,
                action: actionFilter || undefined,
            }),
    });

    const actionColors: Record<string, any> = {
        CREATE: "success",
        UPDATE: "info",
        DELETE: "danger",
        PUBLISH: "primary",
        UNPUBLISH: "neutral",
        ENROLL: "success",
        UNENROLL: "warning",
        SUBMIT: "primary",
        BLOCK: "danger",
        UNBLOCK: "success",
        ROLE_CHANGE: "warning",
        LOGIN: "neutral",
        LOGOUT: "neutral",
    };

    const columns = [
        {
            key: "action",
            header: t.admin.action,
            render: (l: AuditLog) => (
                <Badge variant={actionColors[l.action] || "neutral"}>
                    {l.action}
                </Badge>
            ),
        },
        {
            key: "user",
            header: t.common.user,
            render: (l: AuditLog) =>
                l.user ? (
                    <span
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {l.user.email}
                    </span>
                ) : (
                    <span
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                        }}
                    >
                        system
                    </span>
                ),
        },
        {
            key: "entity",
            header: t.admin.targetEntity,
            render: (l: AuditLog) =>
                l.targetEntity ? (
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {l.targetEntity}:{l.targetId?.slice(0, 8)}
                    </span>
                ) : null,
        },
        {
            key: "ip",
            header: t.admin.ipAddress,
            render: (l: AuditLog) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {l.ipAddress || "—"}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: t.common.date,
            render: (l: AuditLog) => (
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {format(new Date(l.createdAt), "dd.MM.yy HH:mm")}
                </span>
            ),
        },
    ];

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.admin.auditLogs}
                subtitle={`${data?.meta.total || 0} ${t.common.records}`}
            />
            <div style={{ marginBottom: "16px" }}>
                <select
                    value={actionFilter}
                    onChange={(e) => {
                        setActionFilter(e.target.value);
                        setPage(1);
                    }}
                    style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "9px 14px",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "var(--font-body)",
                    }}
                >
                    <option value="">{t.admin.allActions}</option>
                    {[
                        "CREATE",
                        "UPDATE",
                        "DELETE",
                        "PUBLISH",
                        "UNPUBLISH",
                        "ENROLL",
                        "BLOCK",
                        "UNBLOCK",
                        "LOGIN",
                        "LOGOUT",
                    ].map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>
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
                    data={data?.data || []}
                    loading={isLoading}
                />
            </div>
            <Pagination
                page={page}
                totalPages={data?.meta.totalPages || 1}
                onChange={setPage}
            />
        </div>
    );
}

// ─── Analytics Page ──────────────────────────────────────
export function AnalyticsPage() {
    const { t } = useUIStore();
    const [days, setDays] = useState(7);

    const { data: failedLogins } = useQuery({
        queryKey: ["failed-logins", days],
        queryFn: () => analyticsApi.getFailedLogins(days),
    });
    const { data: eventsByType } = useQuery({
        queryKey: ["events-type", 30],
        queryFn: () => analyticsApi.getEventsByType(30),
    });
    const { data: userStats } = useQuery({
        queryKey: ["user-stats"],
        queryFn: analyticsApi.getUserStats,
    });
    const { data: blockingStats } = useQuery({
        queryKey: ["blocking-stats", 30],
        queryFn: () => analyticsApi.getBlockingStats(30),
    });
    const { data: eventsByRole } = useQuery({
        queryKey: ["events-role", 30],
        queryFn: () => analyticsApi.getEventsByRole(30),
    });

    return (
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <SectionHeader
                title={t.admin.analytics}
                subtitle={t.admin.securityAnalytics}
            />

            <div
                className="grid-stats"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "16px",
                    marginBottom: "28px",
                }}
            >
                <StatCard
                    label={t.admin.accountsBlocked30d}
                    value={blockingStats?.blocked || 0}
                    icon={<Ban size={20} />}
                    color="danger"
                />
                <StatCard
                    label={t.admin.bruteForce30d}
                    value={blockingStats?.bruteForce || 0}
                    icon={<AlertTriangle size={20} />}
                    color="warning"
                    delay={0.05}
                />
                <StatCard
                    label={t.admin.rateLimited30d}
                    value={blockingStats?.rateLimited || 0}
                    icon={<Shield size={20} />}
                    color="info"
                    delay={0.1}
                />
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {[7, 14, 30].map((d) => (
                    <button
                        key={d}
                        onClick={() => setDays(d)}
                        style={{
                            padding: "6px 16px",
                            borderRadius: "var(--radius-md)",
                            border: `1px solid ${days === d ? "var(--primary)" : "var(--border)"}`,
                            background:
                                days === d
                                    ? "var(--primary-dim)"
                                    : "var(--bg-elevated)",
                            color:
                                days === d
                                    ? "var(--primary)"
                                    : "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "0.8125rem",
                            fontFamily: "var(--font-body)",
                            transition: "all 0.15s",
                        }}
                    >
                        {d} {t.security.days}
                    </button>
                ))}
            </div>

            <div
                className="grid-responsive"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>
                        {t.admin.failedLoginsChart}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={failedLogins || []}>
                            <defs>
                                <linearGradient
                                    id="g1"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#f43f5e"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#f43f5e"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 10,
                                    fontFamily: "var(--font-mono)",
                                }}
                                tickFormatter={(d) => d.slice(5)}
                            />
                            <YAxis
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 10,
                                }}
                            />
                            <Tooltip content={<DarkTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name={t.admin.failures}
                                stroke="#f43f5e"
                                fill="url(#g1)"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#f43f5e" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>
                        {t.admin.eventsByType} (30d)
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={eventsByType || []} layout="vertical">
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 10,
                                }}
                            />
                            <YAxis
                                type="category"
                                dataKey="eventType"
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 9,
                                    fontFamily: "var(--font-mono)",
                                }}
                                width={110}
                                tickFormatter={(s) => s.replace(/_/g, " ")}
                            />
                            <Tooltip content={<DarkTooltip />} />
                            <Bar
                                dataKey="count"
                                name="Count"
                                radius={[0, 4, 4, 0]}
                            >
                                {(eventsByType || []).map(
                                    (_: any, i: number) => (
                                        <Cell
                                            key={i}
                                            fill={
                                                CHART_COLORS[
                                                    i % CHART_COLORS.length
                                                ]
                                            }
                                        />
                                    ),
                                )}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div
                className="grid-responsive"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>
                        {t.admin.userStats}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie
                                    data={userStats || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    dataKey="count"
                                    nameKey="role"
                                    paddingAngle={3}
                                >
                                    {(userStats || []).map(
                                        (_: any, i: number) => (
                                            <Cell
                                                key={i}
                                                fill={CHART_COLORS[i]}
                                            />
                                        ),
                                    )}
                                </Pie>
                                <Tooltip content={<DarkTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {(userStats || []).map((u: any, i: number) => (
                                <div
                                    key={u.role}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: CHART_COLORS[i],
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        {u.role}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.875rem",
                                            fontWeight: 700,
                                            color: "var(--text-primary)",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {u.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>
                        {t.admin.eventsByRole} (30d)
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={eventsByRole || []}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                            />
                            <XAxis
                                dataKey="role"
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 11,
                                }}
                            />
                            <YAxis
                                tick={{
                                    fill: "var(--text-muted)",
                                    fontSize: 11,
                                }}
                            />
                            <Tooltip content={<DarkTooltip />} />
                            <Bar
                                dataKey="count"
                                name="Events"
                                radius={[4, 4, 0, 0]}
                            >
                                {(eventsByRole || []).map(
                                    (_: any, i: number) => (
                                        <Cell key={i} fill={CHART_COLORS[i]} />
                                    ),
                                )}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
