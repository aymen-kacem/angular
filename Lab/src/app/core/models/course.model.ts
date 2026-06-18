export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf_chapter' | 'summary' | 'exercise' | 'correction';
  url: string;
  fileName?: string;
  isLocalFile?: boolean;
}

export interface Course {
  id: string | number;
  title: string;
  description: string;
  level: string; // e.g., '1ère année Licence', '1ère année Master'
  teacherIds: (string | number)[];
  resources: CourseResource[];
  createdAt: string;
}
