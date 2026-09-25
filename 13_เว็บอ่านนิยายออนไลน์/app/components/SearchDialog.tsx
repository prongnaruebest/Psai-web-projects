'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChapterMeta } from '../lib/types';

type Props = { open: boolean; onClose: () => void; chapters: ChapterMeta[] };

export default function SearchDialog({ open, onClose, chapters }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [fullText, setFullText] = useState(false);
  const [index, setIndex] = useState<ChapterMeta[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => { window.removeEventListener('keydown', close); previous?.focus(); };
  }, [open, onClose]);

  useEffect(() => {
    if (!fullText || index) return;
    fetch('/api/search').then((response) => response.json() as Promise<ChapterMeta[]>).then(setIndex).catch(() => setIndex([]));
  }, [fullText, index]);

  if (!open) return null;
  const source = fullText ? (index ?? []) : chapters;
  const normalized = query.trim().toLocaleLowerCase('th');
  const results = normalized ? source.filter((chapter) => String(chapter.number) === normalized || chapter.title.toLocaleLowerCase('th').includes(normalized) || (fullText && chapter.excerpt.toLocaleLowerCase('th').includes(normalized))).slice(0, 40) : [];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div className="search-head"><span aria-hidden="true">⌕</span><h2 id="search-title" className="sr-only">ค้นหาตอน</h2><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเลขตอน หรือชื่อตอน…" aria-label="ค้นหาเลขตอนหรือชื่อตอน" /><button type="button" onClick={onClose} aria-label="ปิดการค้นหา">ESC</button></div>
        <div className="search-mode"><button className={!fullText ? 'active' : ''} type="button" onClick={() => setFullText(false)}>เลขและชื่อตอน</button><button className={fullText ? 'active' : ''} type="button" onClick={() => setFullText(true)}>ค้นในเนื้อหา</button></div>
        <div className="search-results" aria-live="polite">
          {!query && <p className="empty-hint">พิมพ์เลขตอนหรือคำสำคัญเพื่อค้นหาจาก 72 ตอน</p>}
          {fullText && !index && <p className="empty-hint">กำลังโหลดดัชนีเนื้อหาเมื่อคุณต้องการใช้…</p>}
          {query && results.length === 0 && (!fullText || index) && <p className="empty-hint">ไม่พบตอนที่ตรงกับ “{query}”</p>}
          {results.map((chapter) => <a key={chapter.id} href={`/book/cloud-inscription/chapter/${chapter.number}`}><strong>{chapter.number}. {chapter.title}</strong><span>เล่ม {chapter.volumeNumber} · PDF {chapter.pdfStartPage}–{chapter.pdfEndPage}</span>{fullText && <small>{chapter.excerpt}</small>}</a>)}
        </div>
      </section>
    </div>
  );
}
