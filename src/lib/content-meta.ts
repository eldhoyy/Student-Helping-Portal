import {
  NotebookText,
  BookText,
  FileQuestion,
  ClipboardCheck,
  Video,
  FileText,
  ClipboardList,
  ScrollText,
  ListChecks,
  HelpCircle,
  FlaskConical,
  BookOpen,
  PlayCircle,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import type { ResourceType, NoticeType, GuideType } from "@prisma/client";

export const resourceTypeMeta: Record<
  ResourceType,
  { label: string; icon: LucideIcon }
> = {
  NOTES: { label: "Notes", icon: NotebookText },
  PDF_BOOK: { label: "PDF Book", icon: BookText },
  PREVIOUS_QUESTION: { label: "Previous Question", icon: FileQuestion },
  MODEL_QUESTION_PAPER: { label: "Model Question Paper", icon: FileText },
  ASSIGNMENT: { label: "Assignment", icon: ClipboardCheck },
  ASSIGNMENT_SOLUTION: { label: "Assignment Solution", icon: ClipboardList },
  SYLLABUS: { label: "Syllabus", icon: ScrollText },
  IMPORTANT_QUESTIONS: { label: "Important Questions", icon: ListChecks },
  QUESTION_BANK: { label: "Question Bank", icon: HelpCircle },
  LAB_MANUAL: { label: "Lab Manual", icon: FlaskConical },
  STUDY_MATERIAL: { label: "Study Material", icon: BookOpen },
  TEXTBOOK: { label: "Textbook", icon: BookText },
  VIDEO_TUTORIAL: { label: "Video Tutorial", icon: Video },
  OTHER: { label: "Other", icon: FolderOpen },
};

export const noticeTypeLabel: Record<NoticeType, string> = {
  UNIVERSITY: "University",
  EXAM: "Exam",
  SCHOLARSHIP: "Scholarship",
  GENERAL: "General",
};

export const guideTypeLabel: Record<GuideType, string> = {
  ADMISSION: "Admission",
  SCHOLARSHIP: "Scholarship",
  INTERNSHIP: "Internship",
  CAREER: "Career",
  RESEARCH: "Research",
};
