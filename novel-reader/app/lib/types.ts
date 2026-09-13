export type Book = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  author: string;
  translator: string;
  copyright: string;
  totalVolumes: number;
  totalChapters: number;
};

export type Volume = {
  id: string;
  number: number;
  title: string;
  firstChapter: number;
  lastChapter: number;
  totalPages: number;
  tone: 'jade' | 'amber' | 'indigo' | 'rose';
};

export type ChapterMeta = {
  id: string;
  slug: string;
  number: number;
  volumeNumber: number;
  title: string;
  sourceFile: string;
  pdfStartPage: number;
  pdfEndPage: number;
  totalPdfPages: number;
  excerpt: string;
};

export type Chapter = ChapterMeta & { content: string[] };

export type ReaderSettings = {
  theme: 'dark' | 'oled' | 'moonlight' | 'forest' | 'sepia' | 'light';
  font: 'sans' | 'noto' | 'serif';
  fontSize: number;
  lineHeight: 1.5 | 1.85 | 2.2;
  width: 'narrow' | 'standard' | 'wide';
  align: 'left' | 'justify';
  spacing: 'normal' | 'comfortable' | 'airy';
  showChapterArt: boolean;
  readingRuler: boolean;
  breakReminder: boolean;
};
