export type KtuScheme = "2024" | "2019" | "all";
export type KtuResourceScope = "notes" | "question-papers" | "syllabus" | "study-material" | "labs" | "tools" | "official";

export interface KtuResourceSource {
  id: string;
  name: string;
  url: string;
  description: string;
  schemes: KtuScheme[];
  scopes: KtuResourceScope[];
  branches: string[];
  semesters: number[];
  priority: "official" | "primary" | "secondary";
  integration: "catalogue" | "deep-link";
  notes?: string;
}

/**
 * Curated discovery registry for KTU study resources.
 *
 * Important: KTU Connect should index metadata and link to legitimate public
 * resources rather than copying third-party copyrighted PDFs into this repo.
 * When a source exposes a public API/repository, an importer can normalize its
 * metadata into the Resource model using the hierarchy:
 * Scheme -> Semester -> Branch -> Subject -> Module -> Resource.
 */
export const ktuResourceSources: KtuResourceSource[] = [
  {
    id: "ktu-official-curriculum",
    name: "KTU Official Curriculum & Syllabus",
    url: "https://ktu.edu.in/academics/branchcurriculum/hardcoded-btech",
    description: "Official B.Tech 2024 curriculum for Groups A, B, C and D.",
    schemes: ["2024"],
    scopes: ["official", "syllabus"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "official",
    integration: "deep-link",
  },
  {
    id: "ktu-official-scheme",
    name: "KTU Official B.Tech Schemes",
    url: "https://ktu.edu.in/academics/scheme",
    description: "Official KTU scheme/regulation entry point.",
    schemes: ["2019", "2024"],
    scopes: ["official", "syllabus"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "official",
    integration: "deep-link",
  },
  {
    id: "ktunotes-live",
    name: "KTUNOTES.LIVE",
    url: "https://www.ktunotes.live/",
    description: "Large student resource hub with 2024-scheme notes, syllabus, PYQs and exam updates.",
    schemes: ["2024", "2019"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
    notes: "Prefer subject-level links when discovered; do not duplicate hosted files without permission.",
  },
  {
    id: "ktunotes-in",
    name: "KTU Notes",
    url: "https://ktunotes.in/",
    description: "Notes, syllabus, exam papers and KTU alerts with both 2019 and 2024 coverage.",
    schemes: ["2019", "2024"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
  },
  {
    id: "ktu-notesundo",
    name: "NotesUndo / KTU Notes",
    url: "https://ktu.notesundo.in/",
    description: "2024-scheme catalogue searchable by branch, semester, subject and resource type.",
    schemes: ["2024"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
    notes: "Includes ME, CSE, ECE, EEE, CE, IT, AI, AD, AM, EB, EV, FT and other mapped programs.",
  },
  {
    id: "ktu-special",
    name: "KTU SPECIAL",
    url: "https://ktuspecial.in/",
    description: "Student ecosystem covering study materials, syllabus, question banks, PYQs and updates.",
    schemes: ["2019", "2024"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
  },
  {
    id: "ktu-assist",
    name: "KTU ASSIST",
    url: "https://www.ktuassist.in/",
    description: "KTU notes, slides, textbooks, question papers, solved papers, syllabus and courses.",
    schemes: ["2019", "2024", "all"],
    scopes: ["notes", "question-papers", "syllabus", "study-material", "labs"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "catalogue",
  },
  {
    id: "ktu-notes-hub",
    name: "KTU Notes Hub",
    url: "https://ktunotes.ramzradio.in/",
    description: "Module-wise notes, important questions, PYQs and quick revision for 2019 and 2024 schemes.",
    schemes: ["2019", "2024"],
    scopes: ["notes", "question-papers", "study-material"],
    branches: ["CSE", "ECE", "EEE", "CE", "ME"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "catalogue",
    notes: "Particularly useful for the 2019 S7/S8 fallback layer and revision material.",
  },
  {
    id: "ktu2024-student-portal",
    name: "KTU 2024 Student Resources Portal",
    url: "https://ktu2024.web.app/help-centre",
    description: "Student-curated 2024 resources with semester-wise modules, papers and syllabus links.",
    schemes: ["2024"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "catalogue",
  },
  {
    id: "disha-gec-kozhikode",
    name: "Disha Student Assistance Cell",
    url: "https://disha.website/",
    description: "Student-curated notes, previous papers, syllabus and scholarship resources.",
    schemes: ["2024", "2019"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "catalogue",
  },
  {
    id: "ktu-archive-github",
    name: "KTU Archive (GitHub)",
    url: "https://github.com/chayotic/ktu-archive",
    description: "Open-source 2024-scheme PYQ/notes downloader plus references to KTU announcement tooling.",
    schemes: ["2024"],
    scopes: ["notes", "question-papers", "official", "tools"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
    notes: "Inspect repository code/data for importable metadata rather than copying hosted files.",
  },
  {
    id: "ktu-resource-github",
    name: "KTU Resources (GitHub)",
    url: "https://github.com/karthikgkumar/Resources",
    description: "Community resource repository containing 2019 and 2024 syllabus/resource collections.",
    schemes: ["2019", "2024"],
    scopes: ["notes", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "catalogue",
  },
  {
    id: "ktunotes-search",
    name: "KTUNOTES Search",
    url: "https://search.ktunotes.live/",
    description: "Search-oriented KTU index for notes, syllabus, PYQs, model papers, important topics and classes.",
    schemes: ["2024", "2019"],
    scopes: ["notes", "question-papers", "syllabus", "study-material"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "secondary",
    integration: "deep-link",
  },
  {
    id: "cet-me-downloads",
    name: "CET Mechanical Engineering Downloads",
    url: "https://me.cet.ac.in/downloads.php",
    description: "College of Engineering Trivandrum Mechanical Engineering archive containing official/college-hosted KTU 2019 and 2024 curriculum and syllabus links.",
    schemes: ["2019", "2024"],
    scopes: ["syllabus", "official"],
    branches: ["ME", "IE"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "deep-link",
    notes: "Useful verification source for Mechanical curriculum mappings.",
  },
  {
    id: "ktu-announcements-api",
    name: "KTU Announcements API",
    url: "https://github.com/ratherpixelate/ktu-announcements-api",
    description: "Open-source project referenced by KTU Archive for KTU announcement data.",
    schemes: ["all"],
    scopes: ["official", "tools"],
    branches: ["all"],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "primary",
    integration: "catalogue",
    notes: "For notices/alerts rather than study PDFs; keep separate from academic resources.",
  },
];

export const ktu2024PrimarySources = ktuResourceSources.filter(
  (source) => source.schemes.includes("2024") && source.priority !== "secondary",
);

export const ktu2019S7S8Sources = ktuResourceSources.filter(
  (source) => source.schemes.includes("2019") && source.semesters.some((semester) => semester === 7 || semester === 8),
);
