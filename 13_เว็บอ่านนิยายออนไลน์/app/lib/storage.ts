import type { ReaderSettings } from './types';

export const STORAGE_KEY = 'aksara-reader-v1';
export const defaultSettings: ReaderSettings = { theme:'sepia', font:'sans', fontSize:20, lineHeight:1.85, width:'standard', align:'left', spacing:'normal', showChapterArt:true, readingRuler:false, breakReminder:false };

export type ReaderState = {
  version: 1;
  lastChapter: number;
  readChapters: number[];
  bookmarks: number[];
  scrollPositions: Record<string, number>;
  settings: ReaderSettings;
};

export const defaultState: ReaderState = { version:1, lastChapter:1, readChapters:[], bookmarks:[], scrollPositions:{}, settings:defaultSettings };

export function loadReaderState(): ReaderState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ReaderState>;
    if (parsed.version !== 1) return defaultState;
    return { ...defaultState, ...parsed, settings:{ ...defaultSettings, ...(parsed.settings ?? {}) } };
  } catch { return defaultState; }
}

export function saveReaderState(state: ReaderState) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private browsing or storage disabled */ }
}
