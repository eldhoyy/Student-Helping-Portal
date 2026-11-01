export interface KtuStudyIndexEntry {
  scheme: "2024" | "2019";
  semester: number;
  branch: string;
  branchCode: string;
  source: string;
  sourceUrl: string;
  purpose: "notes" | "question-papers" | "syllabus" | "model-papers";
  priority: "primary" | "secondary" | "official";
}

const notesUndoBranches = [
  ["AI", "Artificial Intelligence"],
  ["AD", "Artificial Intelligence & Data Science"],
  ["AM", "Artificial Intelligence & Machine Learning"],
  ["BM", "Biomedical Engineering"],
  ["BT", "Biotechnology"],
  ["CE", "Civil Engineering"],
  ["CB", "Computer Science and Business Systems"],
  ["CSE", "Computer Science and Engineering"],
  ["CA", "Computer Science and Engineering (Artificial Intelligence)"],
  ["EEE", "Electrical and Electronics Engineering"],
  ["EB", "Electronics and Biomedical Engineering"],
  ["ECE", "Electronics and Communication Engineering"],
  ["EV", "Electronics Engineering (VLSI Design and Technology)"],
  ["FT", "Food Technology"],
  ["ME", "Mechanical Engineering"],
  ["IT", "Information Technology"],
] as const;

/**
 * Deterministic discovery index for the 2024 scheme. These URLs point to
 * source catalogues; individual resources are still verified before being
 * promoted into the database.
 */
export const ktu2024StudyIndex: KtuStudyIndexEntry[] = notesUndoBranches.flatMap(([branchCode, branch]) =>
  Array.from({ length: 8 }, (_, index) => {
    const semester = index + 1;
    return [
      {
        scheme: "2024",
        semester,
        branch,
        branchCode,
        source: "KTU Notes / NotesUndo",
        sourceUrl: `https://ktu.notesundo.in/notes/2024/${branchCode.toLowerCase()}/s${semester}`,
        purpose: "notes",
        priority: "primary",
      },
      {
        scheme: "2024",
        semester,
        branch,
        branchCode,
        source: "KTUNOTES",
        sourceUrl: `https://ktunotes.in/ktu-${semester === 1 ? "s1" : `s${semester}`}-${branchCode.toLowerCase()}-question-papers-2024-scheme/`,
        purpose: "question-papers",
        priority: "primary",
      },
      {
        scheme: "2024",
        semester,
        branch,
        branchCode,
        source: "KTU Notes Hub",
        sourceUrl: `https://notes.ramzradio.in/ktu/2024/s${semester}/${branchCode.toLowerCase()}`,
        purpose: "study-material",
        priority: "secondary",
      },
    ] as KtuStudyIndexEntry[];
  }).flat(),
);

/** 2019 is deliberately retained as a legacy layer, with S7/S8 as the main target. */
export const ktu2019LegacyIndex: KtuStudyIndexEntry[] = notesUndoBranches.flatMap(([branchCode, branch]) =>
  [7, 8].map((semester) => ({
    scheme: "2019" as const,
    semester,
    branch,
    branchCode,
    source: "KTU Notes Hub",
    sourceUrl: `https://notes.ramzradio.in/ktu/2019/s${semester}/${branchCode.toLowerCase()}`,
    purpose: "notes" as const,
    priority: "secondary" as const,
  })),
);

export const allHistoricalQuestionPaperSources = [
  {
    name: "KTUNOTES Question Papers",
    url: "https://ktunotes.in/category/question-papers/",
    schemes: ["2024", "2019", "older"],
  },
  {
    name: "KTU Notes Hub",
    url: "https://notes.ramzradio.in/",
    schemes: ["2024", "2019"],
  },
  {
    name: "KTU Archive",
    url: "https://ktu-archive.vercel.app/",
    schemes: ["2024"],
  },
];

export const ktu2024BranchCodes = notesUndoBranches;
