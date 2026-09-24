export type UpdateCategory = 'ui' | 'feature' | 'performance' | 'bugfix' | 'docs' | 'assignment';

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
}

export type FileType = 'pdf' | 'drive' | 'github' | 'figma' | 'archive' | 'link' | 'doc' | 'image';

export interface FileAttachment {
  title: string;
  url: string;
  fileType?: FileType;
  fileSize?: string;
}

export interface UpdateItem {
  id: string;
  category: UpdateCategory;
  title: string;
  description: string;
  tags: string[];
  createdAt?: string; // ISO string or human readable date & time (e.g. 24 Eyl 2026, 11:23)
  codeSnippet?: CodeSnippet;
  impact?: string;
  attachment?: FileAttachment;
}

export interface ProjectLinkItem {
  id: string;
  title: string;
  url: string;
  fileType: FileType;
  description?: string;
  fileSize?: string;
  addedAt: string;
  isUploadedFile?: boolean;
}

export type WeekStatus = 'completed' | 'in_progress' | 'planned';

export interface WeekData {
  id: string;
  weekNumber: number;
  title: string;
  dateRange: string;
  status: WeekStatus;
  summary: string;
  hoursSpent: number;
  gitCommit?: string;
  driveUrl?: string;
  updates: UpdateItem[];
  challengesAndSolutions?: string;
  teacherNote?: string;
  demoComponent?: string;
}

export interface StudentProfile {
  studentName: string;
  studentNumber: string;
  courseCode: string;
  courseName: string;
  term: string;
  instructor: string;
  department: string;
  university: string;
  projectTitle: string;
  projectDescription: string;
  githubUrl: string;
  liveDemoUrl: string;
}
