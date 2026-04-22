// ─── Translation System ──────────────────────────────────────────────────────

export type Language = 'en' | 'ru' | 'tk';

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    courses: string;
    myCourses: string;
    myResults: string;
    users: string;
    sessions: string;
    auditLogs: string;
    security: string;
    analytics: string;
    profile: string;
    signOut: string;
    management: string;
    learning: string;
    teaching: string;
    explore: string;
    account: string;
    cybersecurity: string;
  };
  // Auth
  auth: {
    welcomeBack: string;
    signIn: string;
    createAccount: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    forgotPassword: string;
    noAccount: string;
    haveAccount: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    resetPassword: string;
    sendResetLink: string;
    newPassword: string;
    demoCredentials: string;
    invalidEmail: string;
    passwordMin: string;
    passwordMatch: string;
    loggedOut: string;
    welcomeMsg: string;
    accountCreated: string;
    required: string;
    mustContainUppercase: string;
    mustContainNumber: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    passwordHint: string;
    repeatPassword: string;
    checkEmail: string;
    resetLinkSent: string;
    useToken: string;
    backToLogin: string;
    passwordResetDone: string;
    secureLms: string;
  };
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    loading: string;
    noData: string;
    confirm: string;
    yes: string;
    no: string;
    add: string;
    back: string;
    next: string;
    submit: string;
    publish: string;
    unpublish: string;
    actions: string;
    status: string;
    role: string;
    email: string;
    name: string;
    date: string;
    viewAll: string;
    by: string;
    of: string;
    total: string;
    page: string;
    enrolled: string;
    draft: string;
    live: string;
    active: string;
    blocked: string;
    verified: string;
    all: string;
    students: string;
    lessons: string;
    categories: string;
    close: string;
    skipForNow: string;
    change: string;
    student: string;
    teacher: string;
    admin: string;
    clear: string;
    user: string;
    details: string;
    expires: string;
    records: string;
    totalEvents: string;
    inactive: string;
  };
  // Dashboard
  dashboard: {
    welcomeBack: string;
    continueJourney: string;
    enrolledCourses: string;
    quizzesPassed: string;
    totalAttempts: string;
    passRate: string;
    myCourses: string;
    recentlyEnrolled: string;
    recentResults: string;
    quizAttempts: string;
    noCourses: string;
    browseCourses: string;
    noAttempts: string;
    manageYourCourses: string;
    published: string;
    totalStudents: string;
    totalLessons: string;
    totalUsers: string;
    totalCourses: string;
    totalEnrollments: string;
    activeSessions: string;
    blockedUsers: string;
    failedLogins: string;
    systemOverview: string;
    securityOverview: string;
  };
  // Courses
  courses: {
    title: string;
    available: string;
    newCourse: string;
    courseTitle: string;
    description: string;
    category: string;
    allCategories: string;
    viewCourse: string;
    enroll: string;
    enrolled: string;
    enrollNow: string;
    noCoursesFound: string;
    createFirst: string;
    manage: string;
    publishConfirm: string;
    deleteConfirm: string;
    deleteWarning: string;
    lessons: string;
    enrollments: string;
    addLesson: string;
    lessonTitle: string;
    content: string;
    videoUrl: string;
    createQuiz: string;
    quizTitle: string;
    passingScore: string;
    timeLimit: string;
    addQuestion: string;
    question: string;
    option: string;
    correct: string;
    saveQuiz: string;
    browseTitle: string;
    browseDesc: string;
    myCourseTitle: string;
    myCourseDesc: string;
    notEnrolledTitle: string;
    notEnrolledDesc: string;
    courseNotFound: string;
    noLessonsYet: string;
    enrollToAccess: string;
    manageCourseContent: string;
    courseCreated: string;
    updated: string;
    lessonAdded: string;
    quizCreated: string;
    courseDeletedMsg: string;
  };
  // Quiz
  quiz: {
    title: string;
    pass: string;
    fail: string;
    yourScore: string;
    required: string;
    correctAnswers: string;
    congratulations: string;
    notQuite: string;
    passedMessage: string;
    failedMessage: string;
    backToLesson: string;
    viewResults: string;
    submitQuiz: string;
    answered: string;
    timeLeft: string;
    takeQuiz: string;
    required_pct: string;
    quizNotFound: string;
    quizReview: string;
    totalAttempts: string;
    failed: string;
    score: string;
  };
  // Admin
  admin: {
    users: string;
    allUsers: string;
    blockUser: string;
    unblockUser: string;
    changeRole: string;
    deleteUser: string;
    blockConfirm: string;
    deleteConfirm: string;
    manageUsers: string;
    securityEvents: string;
    eventType: string;
    ipAddress: string;
    userAgent: string;
    occurredAt: string;
    filterEvents: string;
    recentEvents: string;
    auditLogs: string;
    action: string;
    targetEntity: string;
    analytics: string;
    failedLoginsChart: string;
    eventsByType: string;
    userStats: string;
    blockingStats: string;
    manageSessions: string;
    revokeSession: string;
    revokeAll: string;
    lastSeen: string;
    activeSessions: string;
    userBlocked: string;
    userUnblocked: string;
    userDeleted: string;
    roleChanged: string;
    courseDeleted: string;
    sessionRevoked: string;
    allSessionsRevoked: string;
    filterByIp: string;
    securityAnalytics: string;
    deleteCourse: string;
    deleteCourseMsg: string;
    teacherCol: string;
    statsCol: string;
    accountsBlocked30d: string;
    bruteForce30d: string;
    rateLimited30d: string;
    failedLoginsLabel: string;
    failures: string;
    allEventTypes: string;
    allActions: string;
    changeRoleFor: string;
    realtimeDesc: string;
    eventsByRole: string;
    block: string;
    allRoles: string;
  };
  // Profile
  profile: {
    title: string;
    editProfile: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updateProfile: string;
    accountInfo: string;
    memberSince: string;
    emailVerified: string;
    notVerified: string;
    mySessionsTitle: string;
    current: string;
    revoke: string;
    profileUpdated: string;
    passwordChanged: string;
    keepSecure: string;
    minChars: string;
    noActiveSessions: string;
    sessionRevoked: string;
    onlyAdminsRevoke: string;
    allSessionsRevoked: string;
    revokeAllSessions: string;
    signOutAllDevices: string;
    signOutAllInfo: string;
    sessionsInfo: string;
    activeSessions: string;
    revokeAllConfirm: string;
    gotIt: string;
    expiringSoon: string;
  };
  // Security
  security: {
    events: string;
    loginSuccess: string;
    loginFailure: string;
    logout: string;
    refreshToken: string;
    passwordReset: string;
    passwordChange: string;
    emailVerification: string;
    accountBlocked: string;
    accountUnblocked: string;
    roleChange: string;
    rateLimitTriggered: string;
    suspiciousRequest: string;
    accessDenied: string;
    bruteForceDetected: string;
    sessionRevoked: string;
    last24h: string;
    last7d: string;
    last30d: string;
    days: string;
  };
  // Not Found
  notFound: {
    title: string;
    description: string;
    goBack: string;
    goHome: string;
  };
  // App
  app: {
    fullName: string;
    version: string;
  };
  // Theme / Language
  settings: {
    language: string;
    theme: string;
    darkTheme: string;
    lightTheme: string;
    english: string;
    russian: string;
    turkmen: string;
  };
}

// ─── English ─────────────────────────────────────────────
const en: Translations = {
  nav: {
    dashboard: 'Dashboard', courses: 'Courses', myCourses: 'My Courses',
    myResults: 'My Results', users: 'Users', sessions: 'Sessions',
    auditLogs: 'Audit Logs', security: 'Security Events', analytics: 'Analytics',
    profile: 'Profile', signOut: 'Sign out', management: 'Management',
    learning: 'Learning', teaching: 'Teaching', explore: 'Explore',
    account: 'Account', cybersecurity: 'Cybersecurity',
  },
  auth: {
    welcomeBack: 'Welcome back', signIn: 'Sign in', createAccount: 'Create account',
    register: 'Register', email: 'Email address', password: 'Password',
    confirmPassword: 'Confirm password', firstName: 'First name', lastName: 'Last name',
    forgotPassword: 'Forgot password?', noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?', emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Your password', resetPassword: 'Reset password',
    sendResetLink: 'Send reset link', newPassword: 'New password',
    demoCredentials: 'Demo credentials', invalidEmail: 'Invalid email address',
    passwordMin: 'Password must be at least 8 characters',
    passwordMatch: 'Passwords do not match', loggedOut: 'Logged out successfully',
    welcomeMsg: 'Welcome back,', accountCreated: 'Account created! Please sign in.',
    required: 'Required', mustContainUppercase: 'Must contain uppercase',
    mustContainNumber: 'Must contain number', firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe', passwordHint: 'Min 8 chars, uppercase, number',
    repeatPassword: 'Repeat password', checkEmail: 'Check your email',
    resetLinkSent: 'If an account exists, a reset link has been sent.',
    useToken: 'Use token →', backToLogin: '← Back to login',
    passwordResetDone: 'Password reset! Redirecting…', secureLms: 'Secure LMS',
  },
  common: {
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', create: 'Create',
    search: 'Search', filter: 'Filter', loading: 'Loading...', noData: 'No data found',
    confirm: 'Confirm', yes: 'Yes', no: 'No', add: 'Add', back: 'Back', next: 'Next',
    submit: 'Submit', publish: 'Publish', unpublish: 'Unpublish', actions: 'Actions',
    status: 'Status', role: 'Role', email: 'Email', name: 'Name', date: 'Date',
    viewAll: 'View all', by: 'by', of: 'of', total: 'Total', page: 'Page',
    enrolled: 'Enrolled', draft: 'Draft', live: 'Live', active: 'Active',
    blocked: 'Blocked', verified: 'Verified', all: 'All', students: 'students',
    lessons: 'lessons', categories: 'Categories', close: 'Close', skipForNow: 'Skip for now',
    change: 'Change', student: 'Student', teacher: 'Teacher', admin: 'Admin',
    clear: 'Clear', user: 'User', details: 'Details', expires: 'Expires',
    records: 'records', totalEvents: 'total events', inactive: 'Inactive',
  },
  dashboard: {
    welcomeBack: 'Welcome back,', continueJourney: 'Continue your learning journey',
    enrolledCourses: 'Enrolled Courses', quizzesPassed: 'Quizzes Passed',
    totalAttempts: 'Total Attempts', passRate: 'Pass Rate', myCourses: 'My Courses',
    recentlyEnrolled: 'Recently enrolled', recentResults: 'Recent Results',
    quizAttempts: 'Quiz attempts', noCourses: 'No courses yet',
    browseCourses: 'Browse Courses', noAttempts: 'No quiz attempts yet',
    manageYourCourses: 'Manage your courses and track student progress',
    published: 'Published', totalStudents: 'Total Students', totalLessons: 'Total Lessons',
    totalUsers: 'Total Users', totalCourses: 'Total Courses', totalEnrollments: 'Total Enrollments',
    activeSessions: 'Active Sessions', blockedUsers: 'Blocked Users',
    failedLogins: 'Failed Logins (24h)', systemOverview: 'System Overview',
    securityOverview: 'Security Overview',
  },
  courses: {
    title: 'Browse Courses', available: 'courses available', newCourse: 'New Course',
    courseTitle: 'Course Title', description: 'Description', category: 'Category',
    allCategories: 'All Categories', viewCourse: 'View Course', enroll: 'Enroll',
    enrolled: 'Enrolled', enrollNow: 'Enroll Now', noCoursesFound: 'No courses found',
    createFirst: 'Create your first course', manage: 'Manage Courses',
    publishConfirm: 'Are you sure you want to change publish status?',
    deleteConfirm: 'Delete this course?',
    deleteWarning: 'This will permanently delete the course and all its content.',
    lessons: 'Lessons', enrollments: 'Enrollments', addLesson: 'Add Lesson',
    lessonTitle: 'Lesson Title', content: 'Content (HTML supported)', videoUrl: 'Video URL',
    createQuiz: 'Create Quiz', quizTitle: 'Quiz Title', passingScore: 'Passing Score (%)',
    timeLimit: 'Time Limit (min)', addQuestion: '+ Add Question', question: 'Question',
    option: 'Option', correct: 'Correct', saveQuiz: 'Save Quiz & Questions',
    browseTitle: 'Browse Courses', browseDesc: 'Try different search terms',
    myCourseTitle: 'My Courses', myCourseDesc: 'enrolled',
    notEnrolledTitle: "You haven't enrolled in any courses",
    notEnrolledDesc: 'Browse available courses and start learning today',
    courseNotFound: 'Course not found', noLessonsYet: 'No lessons yet',
    enrollToAccess: 'Enroll to access lessons',
    manageCourseContent: 'Manage course content',
    courseCreated: 'Course created!', updated: 'Updated!',
    lessonAdded: 'Lesson added!', quizCreated: 'Quiz created with questions!',
    courseDeletedMsg: 'Course deleted',
  },
  quiz: {
    title: 'Quiz', pass: 'PASS', fail: 'FAIL', yourScore: 'Your Score',
    required: 'Required', correctAnswers: 'Correct Answers',
    congratulations: 'Congratulations!', notQuite: 'Not quite there',
    passedMessage: 'You passed the quiz!', failedMessage: 'You need {score}% to pass.',
    backToLesson: 'Back to Lesson', viewResults: 'View All Results',
    submitQuiz: 'Submit Quiz', answered: 'answered', timeLeft: 'Time left',
    takeQuiz: 'Take Quiz', required_pct: 'Pass',
    quizNotFound: 'Quiz not found', quizReview: 'Quiz Review',
    totalAttempts: 'Total Attempts', failed: 'Failed', score: 'Score',
  },
  admin: {
    users: 'Users', allUsers: 'All Users', blockUser: 'Block User', unblockUser: 'Unblock User',
    changeRole: 'Change Role', deleteUser: 'Delete User', blockConfirm: 'Block this user?',
    deleteConfirm: 'Delete this user permanently?', manageUsers: 'Manage Users',
    securityEvents: 'Security Events', eventType: 'Event Type', ipAddress: 'IP Address',
    userAgent: 'User Agent', occurredAt: 'Occurred At', filterEvents: 'Filter Events',
    recentEvents: 'Recent Events', auditLogs: 'Audit Logs', action: 'Action',
    targetEntity: 'Entity', analytics: 'Analytics', failedLoginsChart: 'Failed Logins Over Time',
    eventsByType: 'Events by Type', userStats: 'Users by Role', blockingStats: 'Blocking Stats',
    manageSessions: 'Manage Sessions', revokeSession: 'Revoke', revokeAll: 'Revoke All',
    lastSeen: 'Last seen', activeSessions: 'Active Sessions',
    userBlocked: 'User blocked', userUnblocked: 'User unblocked',
    userDeleted: 'User deleted', roleChanged: 'Role changed',
    courseDeleted: 'Course deleted', sessionRevoked: 'Session revoked',
    allSessionsRevoked: 'All sessions revoked', filterByIp: 'Filter by IP...',
    securityAnalytics: 'Security analytics & platform insights',
    deleteCourse: 'Delete Course',
    deleteCourseMsg: 'Permanently delete this course and all its content?',
    teacherCol: 'Teacher', statsCol: 'Stats',
    accountsBlocked30d: 'Accounts Blocked (30d)', bruteForce30d: 'Brute Force (30d)',
    rateLimited30d: 'Rate Limited (30d)', failedLoginsLabel: 'Failed logins',
    failures: 'Failures',
    allEventTypes: 'All Event Types',
    allActions: 'All Actions',
    changeRoleFor: 'Change role for',
    realtimeDesc: 'Real-time security monitoring & platform management',
    eventsByRole: 'Events by Role',
    block: 'Block',
    allRoles: 'All Roles',
  },
  profile: {
    title: 'Profile', editProfile: 'Edit Profile', changePassword: 'Change Password',
    currentPassword: 'Current Password', newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password', updateProfile: 'Update Profile',
    accountInfo: 'Account Info', memberSince: 'Member since', emailVerified: 'Email Verified',
    notVerified: 'Not Verified', mySessionsTitle: 'My Sessions', current: 'Current',
    revoke: 'Revoke',
    profileUpdated: 'Profile updated!', passwordChanged: 'Password changed!',
    keepSecure: 'Keep your account secure', minChars: 'Min 8 characters',
    noActiveSessions: 'No active sessions found', sessionRevoked: 'Session revoked',
    onlyAdminsRevoke: 'Only admins can revoke sessions directly',
    allSessionsRevoked: 'All sessions revoked', revokeAllSessions: 'Revoke All Sessions',
    signOutAllDevices: 'Sign Out All Devices',
    signOutAllInfo: 'To sign out from all devices, you need to change your password. Go to Profile → Change Password.',
    sessionsInfo: 'Sessions shown are your active logins. To force sign-out from all devices, change your password — this automatically revokes all other sessions.',
    activeSessions: 'active sessions',
    revokeAllConfirm: 'This will terminate all your active sessions. You will need to log in again.',
    gotIt: 'Got it', expiringSoon: 'Expiring soon',
  },
  security: {
    events: 'Security Events', loginSuccess: 'Login Success', loginFailure: 'Login Failure',
    logout: 'Logout', refreshToken: 'Token Refresh', passwordReset: 'Password Reset',
    passwordChange: 'Password Change', emailVerification: 'Email Verified',
    accountBlocked: 'Account Blocked', accountUnblocked: 'Account Unblocked',
    roleChange: 'Role Changed', rateLimitTriggered: 'Rate Limit', suspiciousRequest: 'Suspicious',
    accessDenied: 'Access Denied', bruteForceDetected: 'Brute Force', sessionRevoked: 'Session Revoked',
    last24h: 'Last 24h', last7d: 'Last 7 days', last30d: 'Last 30 days', days: 'days',
  },
  notFound: {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    goBack: 'Go Back', goHome: 'Go Home',
  },
  app: {
    fullName: 'Ensuring and Analyzing Cybersecurity of Online Learning Platforms',
    version: 'v1.0 • Secure LMS',
  },
  settings: {
    language: 'Language', theme: 'Theme', darkTheme: 'Dark', lightTheme: 'Light',
    english: 'English', russian: 'Русский', turkmen: 'Türkmen',
  },
};

// ─── Russian ─────────────────────────────────────────────
const ru: Translations = {
  nav: {
    dashboard: 'Главная', courses: 'Курсы', myCourses: 'Мои курсы',
    myResults: 'Мои результаты', users: 'Пользователи', sessions: 'Сессии',
    auditLogs: 'Журнал аудита', security: 'События безопасности', analytics: 'Аналитика',
    profile: 'Профиль', signOut: 'Выйти', management: 'Управление',
    learning: 'Обучение', teaching: 'Преподавание', explore: 'Обзор',
    account: 'Аккаунт', cybersecurity: 'Кибербезопасность',
  },
  auth: {
    welcomeBack: 'С возвращением', signIn: 'Войти', createAccount: 'Создать аккаунт',
    register: 'Регистрация', email: 'Email адрес', password: 'Пароль',
    confirmPassword: 'Подтвердите пароль', firstName: 'Имя', lastName: 'Фамилия',
    forgotPassword: 'Забыли пароль?', noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?', emailPlaceholder: 'вы@example.com',
    passwordPlaceholder: 'Ваш пароль', resetPassword: 'Сброс пароля',
    sendResetLink: 'Отправить ссылку', newPassword: 'Новый пароль',
    demoCredentials: 'Демо данные', invalidEmail: 'Неверный email',
    passwordMin: 'Пароль минимум 8 символов',
    passwordMatch: 'Пароли не совпадают', loggedOut: 'Вы вышли из системы',
    welcomeMsg: 'С возвращением,', accountCreated: 'Аккаунт создан! Войдите в систему.',
    required: 'Обязательно', mustContainUppercase: 'Должен содержать заглавную букву',
    mustContainNumber: 'Должен содержать цифру', firstNamePlaceholder: 'Иван',
    lastNamePlaceholder: 'Иванов', passwordHint: 'Мин 8 символов, заглавная, цифра',
    repeatPassword: 'Повторите пароль', checkEmail: 'Проверьте почту',
    resetLinkSent: 'Если аккаунт существует, ссылка для сброса отправлена.',
    useToken: 'Использовать токен →', backToLogin: '← Назад ко входу',
    passwordResetDone: 'Пароль сброшен! Перенаправление…', secureLms: 'Безопасная LMS',
  },
  common: {
    save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Изменить', create: 'Создать',
    search: 'Поиск', filter: 'Фильтр', loading: 'Загрузка...', noData: 'Данные не найдены',
    confirm: 'Подтвердить', yes: 'Да', no: 'Нет', add: 'Добавить', back: 'Назад', next: 'Далее',
    submit: 'Отправить', publish: 'Опубликовать', unpublish: 'Снять с публикации',
    actions: 'Действия', status: 'Статус', role: 'Роль', email: 'Email', name: 'Имя',
    date: 'Дата', viewAll: 'Смотреть все', by: 'от', of: 'из', total: 'Всего', page: 'Страница',
    enrolled: 'Записан', draft: 'Черновик', live: 'Активен', active: 'Активен',
    blocked: 'Заблокирован', verified: 'Подтверждён', all: 'Все', students: 'студентов',
    lessons: 'уроков', categories: 'Категории', close: 'Закрыть', skipForNow: 'Пропустить',
    change: 'Изменить', student: 'Студент', teacher: 'Преподаватель', admin: 'Администратор',
    clear: 'Очистить', user: 'Пользователь', details: 'Подробности', expires: 'Истекает',
    records: 'записей', totalEvents: 'всего событий', inactive: 'Неактивен',
  },
  dashboard: {
    welcomeBack: 'С возвращением,', continueJourney: 'Продолжайте своё обучение',
    enrolledCourses: 'Записан на курсы', quizzesPassed: 'Пройдено тестов',
    totalAttempts: 'Всего попыток', passRate: 'Процент успеха', myCourses: 'Мои курсы',
    recentlyEnrolled: 'Недавно записан', recentResults: 'Последние результаты',
    quizAttempts: 'Попытки тестов', noCourses: 'Курсов пока нет',
    browseCourses: 'Обзор курсов', noAttempts: 'Попыток тестов пока нет',
    manageYourCourses: 'Управляйте курсами и отслеживайте прогресс',
    published: 'Опубликовано', totalStudents: 'Всего студентов', totalLessons: 'Всего уроков',
    totalUsers: 'Всего пользователей', totalCourses: 'Всего курсов', totalEnrollments: 'Всего записей',
    activeSessions: 'Активные сессии', blockedUsers: 'Заблокированные',
    failedLogins: 'Неудачные входы (24ч)', systemOverview: 'Обзор системы',
    securityOverview: 'Обзор безопасности',
  },
  courses: {
    title: 'Обзор курсов', available: 'курсов доступно', newCourse: 'Новый курс',
    courseTitle: 'Название курса', description: 'Описание', category: 'Категория',
    allCategories: 'Все категории', viewCourse: 'Смотреть курс', enroll: 'Записаться',
    enrolled: 'Записан', enrollNow: 'Записаться сейчас', noCoursesFound: 'Курсы не найдены',
    createFirst: 'Создайте первый курс', manage: 'Управление курсами',
    publishConfirm: 'Изменить статус публикации?', deleteConfirm: 'Удалить курс?',
    deleteWarning: 'Курс и весь контент будут удалены навсегда.',
    lessons: 'Уроки', enrollments: 'Записи', addLesson: 'Добавить урок',
    lessonTitle: 'Название урока', content: 'Содержание (поддерживается HTML)',
    videoUrl: 'Ссылка на видео', createQuiz: 'Создать тест', quizTitle: 'Название теста',
    passingScore: 'Проходной балл (%)', timeLimit: 'Лимит времени (мин)',
    addQuestion: '+ Добавить вопрос', question: 'Вопрос', option: 'Вариант',
    correct: 'Правильный', saveQuiz: 'Сохранить тест и вопросы',
    browseTitle: 'Обзор курсов', browseDesc: 'Попробуйте другие слова для поиска',
    myCourseTitle: 'Мои курсы', myCourseDesc: 'записан',
    notEnrolledTitle: 'Вы не записаны ни на один курс',
    notEnrolledDesc: 'Обзор доступных курсов и начните обучение',
    courseNotFound: 'Курс не найден', noLessonsYet: 'Уроков пока нет',
    enrollToAccess: 'Запишитесь для доступа к урокам',
    manageCourseContent: 'Управление содержимым курса',
    courseCreated: 'Курс создан!', updated: 'Обновлено!',
    lessonAdded: 'Урок добавлен!', quizCreated: 'Тест создан с вопросами!',
    courseDeletedMsg: 'Курс удалён',
  },
  quiz: {
    title: 'Тест', pass: 'СДАН', fail: 'НЕ СДАН', yourScore: 'Ваш результат',
    required: 'Требуется', correctAnswers: 'Правильных ответов',
    congratulations: 'Поздравляем!', notQuite: 'Не хватило',
    passedMessage: 'Вы прошли тест!', failedMessage: 'Нужно {score}% для прохождения.',
    backToLesson: 'Назад к уроку', viewResults: 'Все результаты',
    submitQuiz: 'Отправить тест', answered: 'отвечено', timeLeft: 'Осталось',
    takeQuiz: 'Пройти тест', required_pct: 'Порог',
    quizNotFound: 'Тест не найден', quizReview: 'Обзор теста',
    totalAttempts: 'Всего попыток', failed: 'Неудача', score: 'Балл',
  },
  admin: {
    users: 'Пользователи', allUsers: 'Все пользователи', blockUser: 'Заблокировать',
    unblockUser: 'Разблокировать', changeRole: 'Изменить роль', deleteUser: 'Удалить',
    blockConfirm: 'Заблокировать пользователя?', deleteConfirm: 'Удалить навсегда?',
    manageUsers: 'Управление пользователями', securityEvents: 'События безопасности',
    eventType: 'Тип события', ipAddress: 'IP адрес', userAgent: 'User Agent',
    occurredAt: 'Время', filterEvents: 'Фильтр событий', recentEvents: 'Последние события',
    auditLogs: 'Журнал аудита', action: 'Действие', targetEntity: 'Объект',
    analytics: 'Аналитика', failedLoginsChart: 'Неудачные входы',
    eventsByType: 'По типу события', userStats: 'Пользователи по роли',
    blockingStats: 'Статистика блокировок', manageSessions: 'Управление сессиями',
    revokeSession: 'Отозвать', revokeAll: 'Отозвать все', lastSeen: 'Последний вход',
    activeSessions: 'Активные сессии',
    userBlocked: 'Пользователь заблокирован', userUnblocked: 'Пользователь разблокирован',
    userDeleted: 'Пользователь удалён', roleChanged: 'Роль изменена',
    courseDeleted: 'Курс удалён', sessionRevoked: 'Сессия отозвана',
    allSessionsRevoked: 'Все сессии отозваны', filterByIp: 'Фильтр по IP...',
    securityAnalytics: 'Аналитика безопасности и обзор платформы',
    deleteCourse: 'Удалить курс',
    deleteCourseMsg: 'Удалить этот курс и весь его контент навсегда?',
    teacherCol: 'Преподаватель', statsCol: 'Статистика',
    accountsBlocked30d: 'Заблокировано (30д)', bruteForce30d: 'Атаки перебором (30д)',
    rateLimited30d: 'Ограничения (30д)', failedLoginsLabel: 'Неудачные входы',
    failures: 'Неудачи',
    allEventTypes: 'Все типы событий',
    allActions: 'Все действия',
    changeRoleFor: 'Изменить роль для',
    realtimeDesc: 'Мониторинг безопасности и управление платформой',
    eventsByRole: 'События по роли',
    block: 'Блокировать',
    allRoles: 'Все роли',
  },
  profile: {
    title: 'Профиль', editProfile: 'Редактировать', changePassword: 'Изменить пароль',
    currentPassword: 'Текущий пароль', newPassword: 'Новый пароль',
    confirmNewPassword: 'Подтвердите новый пароль', updateProfile: 'Обновить профиль',
    accountInfo: 'Данные аккаунта', memberSince: 'Участник с', emailVerified: 'Email подтверждён',
    notVerified: 'Не подтверждён', mySessionsTitle: 'Мои сессии', current: 'Текущая',
    revoke: 'Отозвать',
    profileUpdated: 'Профиль обновлён!', passwordChanged: 'Пароль изменён!',
    keepSecure: 'Защитите свой аккаунт', minChars: 'Минимум 8 символов',
    noActiveSessions: 'Активных сессий не найдено', sessionRevoked: 'Сессия отозвана',
    onlyAdminsRevoke: 'Только администраторы могут отзывать сессии',
    allSessionsRevoked: 'Все сессии отозваны', revokeAllSessions: 'Отозвать все сессии',
    signOutAllDevices: 'Выйти со всех устройств',
    signOutAllInfo: 'Чтобы выйти со всех устройств, измените пароль. Перейдите в Профиль → Изменить пароль.',
    sessionsInfo: 'Показаны ваши активные входы. Чтобы выйти со всех устройств, измените пароль — это автоматически завершит все сессии.',
    activeSessions: 'активных сессий',
    revokeAllConfirm: 'Все активные сессии будут завершены. Вам нужно будет войти снова.',
    gotIt: 'Понятно', expiringSoon: 'Скоро истечёт',
  },
  security: {
    events: 'События безопасности', loginSuccess: 'Успешный вход', loginFailure: 'Неудачный вход',
    logout: 'Выход', refreshToken: 'Обновление токена', passwordReset: 'Сброс пароля',
    passwordChange: 'Смена пароля', emailVerification: 'Подтверждение email',
    accountBlocked: 'Аккаунт заблокирован', accountUnblocked: 'Аккаунт разблокирован',
    roleChange: 'Изменение роли', rateLimitTriggered: 'Лимит запросов', suspiciousRequest: 'Подозрительный',
    accessDenied: 'Отказ в доступе', bruteForceDetected: 'Атака перебором', sessionRevoked: 'Сессия отозвана',
    last24h: 'За 24ч', last7d: 'За 7 дней', last30d: 'За 30 дней', days: 'дн.',
  },
  notFound: {
    title: 'Страница не найдена',
    description: 'Страница, которую вы ищете, не существует или была перемещена.',
    goBack: 'Назад', goHome: 'На главную',
  },
  app: {
    fullName: 'Обеспечение и анализ кибербезопасности платформ онлайн-обучения',
    version: 'v1.0 • Безопасная LMS',
  },
  settings: {
    language: 'Язык', theme: 'Тема', darkTheme: 'Тёмная', lightTheme: 'Светлая',
    english: 'English', russian: 'Русский', turkmen: 'Türkmen',
  },
};

// ─── Turkmen ─────────────────────────────────────────────
const tk: Translations = {
  nav: {
    dashboard: 'Baş sahypa', courses: 'Kurslar', myCourses: 'Meniň kurslarym',
    myResults: 'Meniň netijelerim', users: 'Ulanyjylar', sessions: 'Sessiýalar',
    auditLogs: 'Audit žurnaly', security: 'Howpsuzlyk wakalary', analytics: 'Analitika',
    profile: 'Profil', signOut: 'Çykmak', management: 'Dolandyryş',
    learning: 'Öwreniş', teaching: 'Okadyş', explore: 'Gözleg',
    account: 'Hasap', cybersecurity: 'Kiberhowpsuzlyk',
  },
  auth: {
    welcomeBack: 'Hoş geldiňiz', signIn: 'Giriş', createAccount: 'Hasap döretmek',
    register: 'Hasaba almak', email: 'Email salgysy', password: 'Açar söz',
    confirmPassword: 'Açar sözi tassykla', firstName: 'Ady', lastName: 'Familiýasy',
    forgotPassword: 'Açar sözi unutdyňyzmy?', noAccount: 'Hasabyňyz ýokmy?',
    haveAccount: 'Hasabyňyz barmy?', emailPlaceholder: 'siz@mysal.com',
    passwordPlaceholder: 'Açar söziňiz', resetPassword: 'Açar sözi täzele',
    sendResetLink: 'Täzelemek baglanyşygyny iber', newPassword: 'Täze açar söz',
    demoCredentials: 'Demo maglumatlary', invalidEmail: 'Nädogry email salgysy',
    passwordMin: 'Açar söz azyndan 8 simwol bolmaly',
    passwordMatch: 'Açar sözler gabat gelmeýär', loggedOut: 'Üstünlikli çykyldy',
    welcomeMsg: 'Hoş geldiňiz,', accountCreated: 'Hasap döredildi! Giriş ediň.',
    required: 'Zerur', mustContainUppercase: 'Baş harp bolmaly',
    mustContainNumber: 'San bolmaly', firstNamePlaceholder: 'Merdan',
    lastNamePlaceholder: 'Gapurow', passwordHint: 'Iň az 8 simwol, baş harp, san',
    repeatPassword: 'Açar sözi gaýtala', checkEmail: 'Email-yňyzy barlaň',
    resetLinkSent: 'Hasap bar bolsa, täzeleme baglanyşygy iberildi.',
    useToken: 'Tokeni ulan →', backToLogin: '← Girişe gaýdyp git',
    passwordResetDone: 'Açar söz täzelendi! Ugradylýar…', secureLms: 'Howpsuz LMS',
  },
  common: {
    save: 'Ýatda sakla', cancel: 'Ýatyr', delete: 'Poz', edit: 'Üýtget', create: 'Döret',
    search: 'Gözle', filter: 'Süzgüç', loading: 'Ýüklenýär...', noData: 'Maglumat tapylmady',
    confirm: 'Tassykla', yes: 'Hawa', no: 'Ýok', add: 'Goş', back: 'Yza', next: 'Indiki',
    submit: 'Ugrat', publish: 'Çap et', unpublish: 'Çapdan aýyr', actions: 'Hereketler',
    status: 'Ýagdaý', role: 'Rol', email: 'Email', name: 'At', date: 'Sene',
    viewAll: 'Hemmesini gör', by: 'tarapyndan', of: '-dan', total: 'Jemi', page: 'Sahypa',
    enrolled: 'Ýazyldy', draft: 'Taslamak', live: 'Işjeň', active: 'Işjeň',
    blocked: 'Bloklanan', verified: 'Tassyklanan', all: 'Hemme', students: 'talyp',
    lessons: 'sapak', categories: 'Kategoriýalar', close: 'Ýap', skipForNow: 'Geçir',
    change: 'Üýtget', student: 'Talyp', teacher: 'Mugallym', admin: 'Admin',
    clear: 'Arassala', user: 'Ulanyjy', details: 'Jikme-jikler', expires: 'Gutarýar',
    records: 'ýazgy', totalEvents: 'jemi waka', inactive: 'Işjeň däl',
  },
  dashboard: {
    welcomeBack: 'Hoş geldiňiz,', continueJourney: 'Öwreniş syýahatyňyzy dowam ediň',
    enrolledCourses: 'Ýazylgan kurslar', quizzesPassed: 'Geçilen testler',
    totalAttempts: 'Jemi synanyşyk', passRate: 'Geçiş derejesi', myCourses: 'Meniň kurslarym',
    recentlyEnrolled: 'Ýakynda ýazyldy', recentResults: 'Soňky netijeler',
    quizAttempts: 'Test synanyşyklary', noCourses: 'Heniz kurs ýok',
    browseCourses: 'Kurslary gözle', noAttempts: 'Heniz test synanyşygy ýok',
    manageYourCourses: 'Kurslarňyzy dolandyryň we ösüşi yzarlaň',
    published: 'Çap edilen', totalStudents: 'Jemi talyp', totalLessons: 'Jemi sapak',
    totalUsers: 'Jemi ulanyjylar', totalCourses: 'Jemi kurs', totalEnrollments: 'Jemi ýazgylar',
    activeSessions: 'Işjeň sessiýalar', blockedUsers: 'Bloklanan ulanyjylar',
    failedLogins: 'Başarylmadyk girişler (24s)', systemOverview: 'Ulgam syn',
    securityOverview: 'Howpsuzlyk syn',
  },
  courses: {
    title: 'Kurslary gözle', available: 'kurs bar', newCourse: 'Täze kurs',
    courseTitle: 'Kursyň ady', description: 'Düşündiriş', category: 'Kategoriýa',
    allCategories: 'Ähli kategoriýalar', viewCourse: 'Kursy gör', enroll: 'Ýazyl',
    enrolled: 'Ýazyldy', enrollNow: 'Häzir ýazyl', noCoursesFound: 'Kurs tapylmady',
    createFirst: 'Ilkinji kursuňyzy dörediň', manage: 'Kurslary dolandyr',
    publishConfirm: 'Neşir ýagdaýyny üýtgetmek?', deleteConfirm: 'Kursy pozmak?',
    deleteWarning: 'Bu kurs we ähli mazmuny baky pozular.',
    lessons: 'Sapaklary', enrollments: 'Ýazgylar', addLesson: 'Sapak goş',
    lessonTitle: 'Sapagyň ady', content: 'Mazmun (HTML goldanýar)', videoUrl: 'Wideo salgysy',
    createQuiz: 'Test döret', quizTitle: 'Testiň ady', passingScore: 'Geçiş baly (%)',
    timeLimit: 'Wagt çägi (min)', addQuestion: '+ Sorag goş', question: 'Sorag',
    option: 'Jogap', correct: 'Dogry', saveQuiz: 'Testi ýatda sakla',
    browseTitle: 'Kurslary gözle', browseDesc: 'Başga gözleg sözlerini synap görüň',
    myCourseTitle: 'Meniň kurslarym', myCourseDesc: 'ýazyldy',
    notEnrolledTitle: 'Siz hiç bir kursa ýazylmadyňyz',
    notEnrolledDesc: 'Elýeterli kurslara göz aýlaň we öwrenmäge başlaň',
    courseNotFound: 'Kurs tapylmady', noLessonsYet: 'Heniz sapak ýok',
    enrollToAccess: 'Sapaklara girmek üçin ýazylyň',
    manageCourseContent: 'Kurs mazmunyny dolandyryň',
    courseCreated: 'Kurs döredildi!', updated: 'Täzelendi!',
    lessonAdded: 'Sapak goşuldy!', quizCreated: 'Test soraglar bilen döredildi!',
    courseDeletedMsg: 'Kurs pozuldy',
  },
  quiz: {
    title: 'Test', pass: 'GEÇDI', fail: 'GEÇMEDI', yourScore: 'Siziň balyňyz',
    required: 'Zerur', correctAnswers: 'Dogry jogaplar',
    congratulations: 'Gutlaýarys!', notQuite: 'Ýetmedi',
    passedMessage: 'Testi geçdiňiz!', failedMessage: 'Geçmek üçin {score}% gerek.',
    backToLesson: 'Sapaga gaýdyp git', viewResults: 'Ähli netijeleri gör',
    submitQuiz: 'Testi ugrat', answered: 'jogap berildi', timeLeft: 'Galdy',
    takeQuiz: 'Testi geç', required_pct: 'Gerek',
    quizNotFound: 'Test tapylmady', quizReview: 'Test syny',
    totalAttempts: 'Jemi synanyşyk', failed: 'Başarylmady', score: 'Bal',
  },
  admin: {
    users: 'Ulanyjylar', allUsers: 'Ähli ulanyjylar', blockUser: 'Blokla',
    unblockUser: 'Blokdan çykar', changeRole: 'Roly üýtget', deleteUser: 'Poz',
    blockConfirm: 'Ulanyjyny bloklamak?', deleteConfirm: 'Baky pozmak?',
    manageUsers: 'Ulanyjylary dolandyr', securityEvents: 'Howpsuzlyk wakalary',
    eventType: 'Wakanyň görnüşi', ipAddress: 'IP salgysy', userAgent: 'Brauzer',
    occurredAt: 'Wagt', filterEvents: 'Wakalary süz', recentEvents: 'Soňky wakalar',
    auditLogs: 'Audit žurnaly', action: 'Hereket', targetEntity: 'Obýekt',
    analytics: 'Analitika', failedLoginsChart: 'Başarylmadyk girişler',
    eventsByType: 'Wakanyň görnüşi boýunça', userStats: 'Rol boýunça ulanyjylar',
    blockingStats: 'Bloklama statistikasy', manageSessions: 'Sessiýalary dolandyr',
    revokeSession: 'Boz', revokeAll: 'Hemmesini boz', lastSeen: 'Soňky giriş',
    activeSessions: 'Işjeň sessiýalar',
    userBlocked: 'Ulanyjy bloklanan', userUnblocked: 'Ulanyjy blokdan çykarylan',
    userDeleted: 'Ulanyjy pozuldy', roleChanged: 'Rol üýtgedildi',
    courseDeleted: 'Kurs pozuldy', sessionRevoked: 'Sessiýa bozuldy',
    allSessionsRevoked: 'Ähli sessiýalar bozuldy', filterByIp: 'IP boýunça süz...',
    securityAnalytics: 'Howpsuzlyk analitikasy we platforma syn',
    deleteCourse: 'Kursy poz',
    deleteCourseMsg: 'Bu kursy we ähli mazmunyny baky pozmak?',
    teacherCol: 'Mugallym', statsCol: 'Statistika',
    accountsBlocked30d: 'Bloklanan (30g)', bruteForce30d: 'Güýç hüjümi (30g)',
    rateLimited30d: 'Çäklendirilen (30g)', failedLoginsLabel: 'Başarylmadyk girişler',
    failures: 'Şowsuzlyk',
    allEventTypes: 'Ähli waka görnüşleri',
    allActions: 'Ähli hereketler',
    changeRoleFor: 'Roly üýtget:',
    realtimeDesc: 'Howpsuzlyk gözegçiligi we platforma dolandyryşy',
    eventsByRole: 'Rol boýunça wakalar',
    block: 'Blokla',
    allRoles: 'Ähli roller',
  },
  profile: {
    title: 'Profil', editProfile: 'Redaktirle', changePassword: 'Açar sözi üýtget',
    currentPassword: 'Häzirki açar söz', newPassword: 'Täze açar söz',
    confirmNewPassword: 'Täze açar sözi tassykla', updateProfile: 'Profili täzele',
    accountInfo: 'Hasap maglumatlary', memberSince: 'Agza boldy', emailVerified: 'Email tassyklanan',
    notVerified: 'Tassyklanmadyk', mySessionsTitle: 'Meniň sessiýalarym', current: 'Häzirki',
    revoke: 'Boz',
    profileUpdated: 'Profil täzelendi!', passwordChanged: 'Açar söz üýtgedildi!',
    keepSecure: 'Hasabyňyzy goraň', minChars: 'Iň az 8 simwol',
    noActiveSessions: 'Işjeň sessiýa tapylmady', sessionRevoked: 'Sessiýa bozuldy',
    onlyAdminsRevoke: 'Diňe adminler sessiýalary bozup bilýär',
    allSessionsRevoked: 'Ähli sessiýalar bozuldy', revokeAllSessions: 'Ähli sessiýalary boz',
    signOutAllDevices: 'Ähli enjamlardan çyk',
    signOutAllInfo: 'Ähli enjamlardan çykmak üçin açar sözi üýtgediň. Profil → Açar sözi üýtget.',
    sessionsInfo: 'Bu siziň işjeň girişleriňiz. Ähli enjamlardan çykmak üçin açar sözi üýtgediň — bu ähli sessiýalary awtomatik bozar.',
    activeSessions: 'işjeň sessiýa',
    revokeAllConfirm: 'Ähli işjeň sessiýalar bozular. Täzeden giriş etmeli bolarsyňyz.',
    gotIt: 'Düşnükli', expiringSoon: 'Ýakynda gutarýar',
  },
  security: {
    events: 'Howpsuzlyk wakalary', loginSuccess: 'Üstünlikli giriş', loginFailure: 'Başarylmadyk giriş',
    logout: 'Çykyş', refreshToken: 'Token täzelenmesi', passwordReset: 'Açar söz täzeleme',
    passwordChange: 'Açar söz üýtgetme', emailVerification: 'Email tassyklamasy',
    accountBlocked: 'Hasap bloklanan', accountUnblocked: 'Hasap blokdan çykarylan',
    roleChange: 'Rol üýtgetme', rateLimitTriggered: 'Sorag çägi', suspiciousRequest: 'Şübheli',
    accessDenied: 'Giriş gadagan', bruteForceDetected: 'Güýç hüjümi', sessionRevoked: 'Sessiýa bozuldy',
    last24h: 'Soňky 24s', last7d: 'Soňky 7 gün', last30d: 'Soňky 30 gün', days: 'gün',
  },
  notFound: {
    title: 'Sahypa tapylmady',
    description: 'Gözleýän sahypaňyz ýok ýa-da göçürildi.',
    goBack: 'Yza', goHome: 'Baş sahypa',
  },
  app: {
    fullName: 'Onlaýn okuw platformalarynyň kiberhowpsuzlygyny üpjün etmek we seljermek',
    version: 'v1.0 • Howpsuz LMS',
  },
  settings: {
    language: 'Dil', theme: 'Tema', darkTheme: 'Garaňky', lightTheme: 'Ýagty',
    english: 'English', russian: 'Русский', turkmen: 'Türkmen',
  },
};

export const translations: Record<Language, Translations> = { en, ru, tk };
