'use client';
import Link from 'next/link'; import { useEffect, useState } from 'react';
import { book, chapters } from '../lib/data';
import { defaultState, loadReaderState, saveReaderState, type ReaderState } from '../lib/storage';

export default function BookmarksClient() {
  const [state, setState] = useState<ReaderState>(defaultState); const [ready, setReady] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { setState(loadReaderState()); setReady(true); }, 0); return () => window.clearTimeout(timer); }, []); useEffect(() => { if (ready) saveReaderState(state); }, [ready,state]);
  const items = chapters.filter((chapter) => state.bookmarks.includes(chapter.number));
  return <main className="bookmarks-page"><header><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">อ</span><span><strong>หออักษรา</strong><small>กลับชั้นหนังสือ</small></span></Link></header><section><p className="eyebrow">คลังของฉัน</p><h1>ที่คั่นหน้า</h1><p>ตอนที่คุณตั้งใจจะกลับมาอ่านอีกครั้ง</p>{!ready ? <p className="empty-hint">กำลังเปิดคลังของคุณ…</p> : items.length ? <div className="bookmark-list">{items.map((chapter) => <article key={chapter.id}><a href={`/book/${book.slug}/chapter/${chapter.number}`}><span>{String(chapter.number).padStart(2,'0')}</span><div><strong>{chapter.title}</strong><small>เล่ม {chapter.volumeNumber} · PDF {chapter.pdfStartPage}–{chapter.pdfEndPage}</small></div></a><button type="button" onClick={() => setState((current) => ({ ...current, bookmarks:current.bookmarks.filter((number) => number !== chapter.number) }))} aria-label={`นำตอน ${chapter.number} ออกจากที่คั่นหน้า`}>นำออก</button></article>)}</div> : <div className="empty-state"><strong>ยังไม่มีตอนที่คั่นไว้</strong><p>กดสัญลักษณ์ ◇ ในหน้าอ่านเพื่อเก็บตอนโปรด</p><a className="primary-button" href={`/book/${book.slug}/chapter/${state.lastChapter}`}>ไปหน้าอ่าน</a></div>}</section></main>;
}
