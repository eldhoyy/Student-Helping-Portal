const dictionary = {
  nav: {
    resources: "Resources",
    academic: "Academic",
    guides: "Guides",
    downloads: "Downloads",
    notices: "Notices",
    articles: "Articles",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    profile: "Profile",
    login: "Log in",
    signup: "Sign up",
    logout: "Log out",
    searchPlaceholder: "Search...",
    mobileSearchPlaceholder: "Search resources, notices, articles...",
    toggleMenu: "Toggle menu",
  },
  footer: {
    description: "KTU Connect brings KTU notices, study resources, academic information, guides, and downloads together in one trusted student ecosystem.",
    explore: "Explore",
    updates: "Updates",
    contact: "Contact",
    studyResources: "Study Resources",
    academicInfo: "Academic Information",
    studentGuides: "Student Guides",
    downloads: "Downloads",
    notices: "Notices",
    articles: "Articles",
    aboutUs: "About KTU Connect",
    contactUs: "Contact",
    copyrightSuffix: "Built for KTU students across Kerala",
  },
  auth: {
    welcomeBack: "Welcome back",
    loginDescription: "Log in to access your dashboard and bookmarks.",
    invalidCredentials: "Invalid email or password.",
    genericError: "Something went wrong. Please try again.",
    email: "Email",
    password: "Password",
    login: "Log in",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    createAccount: "Create an account",
    registerDescription: "Sign up to bookmark resources and track your activity.",
    fullName: "Full Name",
    passwordHint: "At least 6 characters",
    hasAccount: "Already have an account?",
    siteTitle: "KTU Connect",
  },
  dashboard: {
    overview: "Overview",
    bookmarks: "Bookmarks",
    profile: "Profile",
  },
  admin: {
    panel: "Admin Panel",
    overview: "Overview",
    taxonomy: "Taxonomy",
    content: "Content",
    academics: "Academics",
    administration: "Administration",
    dashboard: "Dashboard",
    categories: "Categories",
    departments: "Departments",
    subjects: "Subjects",
    resources: "Resources",
    notices: "Notices",
    articles: "Articles",
    downloads: "Downloads",
    guides: "Guides",
    academicCalendar: "Academic Calendar",
    examSchedule: "Exam Schedule",
    messages: "Messages",
    users: "Users",
    settings: "Settings",
    languages: "Languages",
    backToSite: "Back to site",
    openMenu: "Open menu",
    logout: "Log out",
    detail: "Detail",
  },
  settings: {
    language: "Language",
    languageDescription: "KTU Connect uses English as its platform language.",
    english: "English",
  },
  home: {
    badge: "The KTU student ecosystem",
    title: "Everything KTU students need, connected.",
    description: "Find verified study resources, previous questions, university notices, exam information, academic tools, and student opportunities — organized for KTU.",
    search: "Search KTU",
    quickLinks: {
      resources: "Study Resources",
      notices: "KTU Notices",
      downloads: "Downloads",
      guides: "Student Guides",
      academic: "Academic Info",
    },
    popularResources: "Popular Resources",
    latestNotices: "Latest KTU Notices",
    latestArticles: "Latest Articles",
    viewAll: "View all",
    noResources: "No resources yet",
    noResourcesDescription: "Published KTU study resources will appear here.",
    noNotices: "No notices yet",
    noNoticesDescription: "Published KTU notices will appear here.",
    noArticles: "No articles yet",
    noArticlesDescription: "Published student articles will appear here.",
  },
  about: {
    titlePrefix: "About",
    description: "KTU Connect is a student-first academic ecosystem designed to make KTU resources, notices, academic information, and opportunities easier to find.",
    mission: "Our Mission",
    missionDescription: "Organize KTU's scattered student information into one fast, trustworthy, mobile-first platform.",
    offer: "What We Offer",
    offerDescription: "Study resources, previous questions, assignments, notices, academic information, guides, downloads, and future student tools.",
    builtForStudents: "Built for KTU Students",
    builtForStudentsDescription: "Designed around real KTU student workflows with simple navigation, powerful search, and structured academic content.",
    behindProject: "KTU Connect",
    team: [
      { name: "Academic Content", role: "Verified KTU resources and academic information" },
      { name: "Platform Engineering", role: "Builds and maintains the student ecosystem" },
      { name: "Student Community", role: "Helps improve resources and opportunities for students" },
    ],
  },
  contact: {
    title: "Contact KTU Connect",
    description: "Have a question, correction, resource, or suggestion? Let us know.",
    getInTouch: "Get in Touch",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "How do I download a resource?", a: "Open a resource and use its Download button when available." },
      { q: "Do I need an account to browse?", a: "No. Public KTU resources, notices, and guides can be browsed without an account." },
      { q: "How can I report incorrect information?", a: "Use the contact form and include the page or resource that needs correction." },
      { q: "Can I contribute a resource?", a: "Yes. KTU Connect will support student resource contributions through the platform." },
    ],
  },
  academic: {
    title: "Academic Information",
    description: "KTU departments, subjects, academic calendar, exam schedules, and results.",
    departments: "Departments",
    calendar: "Academic Calendar",
    exams: "Exam Schedule",
    results: "Results",
    noDepartments: "No departments added yet",
    noCalendar: "No upcoming calendar events",
    noExams: "No upcoming exams scheduled",
    subjects: "subjects",
    resources: "resources",
    openResultLink: "Open result link",
  },
  common: {
    home: "Home",
  },
} as const;

type Dictionary = typeof dictionary;

function flattenTranslations(value: unknown, prefix = "", result: Record<string, string> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenTranslations(item, `${prefix}[${index}]`, result));
    return result;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenTranslations(child, nextPrefix, result);
    });
    return result;
  }
  if (prefix) result[prefix] = String(value ?? "");
  return result;
}

export function getDictionary(_language: string): Dictionary {
  return dictionary;
}

export function getDefaultTranslationEntries() {
  return flattenTranslations(dictionary);
}

export function getSeedTranslationsForLanguage(_languageCode: string) {
  return flattenTranslations(dictionary);
}

export async function getRuntimeDictionary(_language: string): Promise<Dictionary> {
  return dictionary;
}
