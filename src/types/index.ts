export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  url: string;
  abstract?: string;
} 