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
  },
  quiz: {
    title: 'Quiz', pass: 'PASS', fail: 'FAIL', yourScore: 'Your Score',
    required: 'Required', correctAnswers: 'Correct Answers',
    congratulations: 'Congratulations!', notQuite: 'Not quite there',
    passedMessage: 'You passed the quiz!', failedMessage: 'You need {score}% to pass.',
    backToLesson: 'Back to Lesson', viewResults: 'View All Results',
    submitQuiz: 'Submit Quiz', answered: 'answered', timeLeft: 'Time left',
    takeQuiz: 'Take Quiz', required_pct: 'Pass',
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
  },
  profile: {
    title: 'Profile', editProfile: 'Edit Profile', changePassword: 'Change Password',
    currentPassword: 'Current Password', newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password', updateProfile: 'Update Profile',
    accountInfo: 'Account Info', memberSince: 'Member since', emailVerified: 'Email Verified',
    notVerified: 'Not Verified', mySessionsTitle: 'My Sessions', current: 'Current',
    revoke: 'Revoke',
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
  },
  quiz: {
    title: 'Тест', pass: 'СДАН', fail: 'НЕ СДАН', yourScore: 'Ваш результат',
    required: 'Требуется', correctAnswers: 'Правильных ответов',
    congratulations: 'Поздравляем!', notQuite: 'Не хватило',
    passedMessage: 'Вы прошли тест!', failedMessage: 'Нужно {score}% для прохождения.',
    backToLesson: 'Назад к уроку', viewResults: 'Все результаты',
    submitQuiz: 'Отправить тест', answered: 'отвечено', timeLeft: 'Осталось',
    takeQuiz: 'Пройти тест', required_pct: 'Порог',
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
  },
  profile: {
    title: 'Профиль', editProfile: 'Редактировать', changePassword: 'Изменить пароль',
    currentPassword: 'Текущий пароль', newPassword: 'Новый пароль',
    confirmNewPassword: 'Подтвердите новый пароль', updateProfile: 'Обновить профиль',
    accountInfo: 'Данные аккаунта', memberSince: 'Участник с', emailVerified: 'Email подтверждён',
    notVerified: 'Не подтверждён', mySessionsTitle: 'Мои сессии', current: 'Текущая',
    revoke: 'Отозвать',
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
  },
  quiz: {
    title: 'Test', pass: 'GEÇDI', fail: 'GEÇMEDI', yourScore: 'Siziň balyňyz',
    required: 'Zerur', correctAnswers: 'Dogry jogaplar',
    congratulations: 'Gutlaýarys!', notQuite: 'Ýetmedi',
    passedMessage: 'Testi geçdiňiz!', failedMessage: 'Geçmek üçin {score}% gerek.',
    backToLesson: 'Sapaga gaýdyp git', viewResults: 'Ähli netijeleri gör',
    submitQuiz: 'Testi ugrat', answered: 'jogap berildi', timeLeft: 'Galdy',
    takeQuiz: 'Testi geç', required_pct: 'Gerek',
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
  },
  profile: {
    title: 'Profil', editProfile: 'Redaktirle', changePassword: 'Açar sözi üýtget',
    currentPassword: 'Häzirki açar söz', newPassword: 'Täze açar söz',
    confirmNewPassword: 'Täze açar sözi tassykla', updateProfile: 'Profili täzele',
    accountInfo: 'Hasap maglumatlary', memberSince: 'Agza boldy', emailVerified: 'Email tassyklanan',
    notVerified: 'Tassyklanmadyk', mySessionsTitle: 'Meniň sessiýalarym', current: 'Häzirki',
    revoke: 'Boz',
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
  settings: {
    language: 'Dil', theme: 'Tema', darkTheme: 'Garaňky', lightTheme: 'Ýagty',
    english: 'English', russian: 'Русский', turkmen: 'Türkmen',
  },
};

export const translations: Record<Language, Translations> = { en, ru, tk };
