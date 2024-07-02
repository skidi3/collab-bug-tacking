// shared/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
}

export interface Page {
  id: string;
  name: string;
  htmlContent: string;
  projectId: string;
  bugs: Bug[];
}

export interface Bug {
  id: string;
  x: number;
  y: number;
  selector?: string;
  pageId: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  bugId: string;
}

export interface Chat {
  id: string;
  content: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}