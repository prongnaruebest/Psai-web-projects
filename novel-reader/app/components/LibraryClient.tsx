'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { book, chapters, volumes } from '../lib/data';
import { defaultState, loadReaderState, saveReaderState, type ReaderState } from '../lib/storage';
import SearchDialog from './SearchDialog';
import SettingsDrawer from './SettingsDrawer';
import SiteHeader from './SiteHeader';

export default function LibraryClient() {
  const [state, setState] = useState<ReaderState>(defaultState);
  const [ready, setReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('asc');
  useEffect(() => { const timer = window.setTimeout(() => { setState(loadReaderState()); setReady(true); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (ready) saveReaderState(state); }, [ready, state]);
  useEffect(() => { const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); } }; window.addEventListener('keydown', shortcut); return () => window.removeEventListener('keydown', shortcut); }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const visibleVolumes = useMemo(() => { const query = filter.trim().toLocaleLowerCase('th'); const list = volumes.filter((volume) => !query || `เล่ม ${volume.number} ${volume.title}`.toLocaleLowerCase('th').includes(query) || chapters.some((chapter) => chapter.volumeNumber === volume.number && `${chapter.number} ${chapter.title}`.toLocaleLowerCase('th').includes(query))); return sort === 'desc' ? [...list].reverse() : list; }, [filter, sort]);
  const overall = Math.round((state.readChapters.length / book.totalChapters) * 100);
  return (
    <main className="site-shell">
      <SiteHeader onSearch={() => setSearchOpen(true)} onSettings={() => setSettingsOpen(true)} />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-badges"><span>เรื่องเด่นประจำหอ</span><span>ครบชุด</span><span>{volumes.reduce((sum, item) => sum + item.totalPages, 0).toLocaleString('th-TH')} หน้า</span></div>
          <p className="eyebrow">บันทึกแห่งหออักษรา</p><h1 id="hero-title">จารึกเหนือม่านเมฆ</h1><p className="hero-description">{book.description}</p>
          <dl className="book-meta"><div><dt>ผู้ประพันธ์</dt><dd>{book.author}</dd></div><div><dt>ฉบับ</dt><dd>{book.translator}</dd></div><div><dt>สถานะ</dt><dd>{book.totalVolumes} เล่ม · {book.totalChapters} ตอน</dd></div></dl>
          <p className="copyright-note">{book.copyright}</p>
          <div className="hero-actions"><a className="primary-button" href={`/book/${book.slug}/chapter/${state.lastChapter}`}>{state.readChapters.length ? `อ่านต่อ ตอนที่ ${state.lastChapter}` : 'เริ่มอ่านตอนแรก'} <span aria-hidden="true">→</span></a><a className="quiet-button" href="#library">เลือกเล่มที่ต้องการ</a></div>
        </div>
        <div className="hero-art" aria-label="ปกฉบับหออักษรา จารึกเหนือม่านเมฆ"><div className="cover-sun" /><div className="cover-mountain cover-back" /><div className="cover-mountain cover-front" /><div className="cover-title"><small>หออักษรา · ฉบับสะสม</small><strong>จารึก<br />เหนือม่านเมฆ</strong><span>อักษรหมอก</span></div><div className="seal">อ</div></div>
      </section>
      <section className="library" id="library" aria-labelledby="library-title">
        <div className="section-heading"><div><p className="eyebrow">ชั้นหนังสือของคุณ</p><h2 id="library-title">รายการหนังสือครบชุด {book.totalVolumes} เล่ม</h2><p>เลือกอ่านตามเล่ม หรือต่อจากตำแหน่งล่าสุดของคุณ</p></div><div className="library-meta"><strong>{book.totalChapters}</strong><span>ตอนทั้งหมด</span><strong>{overall}%</strong><span>อ่านแล้ว</span></div></div>
        <div className="library-tools"><label className="library-search"><span aria-hidden="true">⌕</span><span className="sr-only">กรองเล่มหรือตอน</span><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="ค้นหาเล่มหรือตอน…" /></label><label className="sort-control"><span>เรียงตาม</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="asc">เล่ม 1–4</option><option value="desc">เล่ม 4–1</option></select></label></div>
        {visibleVolumes.length ? <div className="volume-grid">{visibleVolumes.map((volume) => { const volumeChapters = chapters.filter((chapter) => chapter.volumeNumber === volume.number); const readCount = volumeChapters.filter((chapter) => state.readChapters.includes(chapter.number)).length; const progress = Math.round((readCount / volumeChapters.length) * 100); return <a className="volume-card" href={`/book/${book.slug}/chapter/${volume.firstChapter}`} key={volume.number}><div className={`volume-cover tone-${volume.tone}`}><span className="page-badge">{volume.totalPages} หน้า</span><small>หออักษรา</small><strong>{String(volume.number).padStart(2,'0')}</strong><p>{volume.title}</p><i>จารึกเหนือม่านเมฆ</i></div><div className="volume-info"><div><p className="volume-kicker">เล่ม {String(volume.number).padStart(2,'0')}</p><h3>{volume.title}</h3><p>ตอนที่ {volume.firstChapter}–{volume.lastChapter} · {volumeChapters.length} ตอน</p><small>cloud-inscription-volume-{String(volume.number).padStart(2,'0')}.pdf</small></div><span>{progress ? `${progress}%` : 'ยังไม่เริ่ม'}</span></div><div className="progress-track" aria-label={`อ่านแล้ว ${progress}%`}><span style={{ width:`${progress}%` }} /></div></a>; })}</div> : <div className="empty-state"><strong>ไม่พบเล่มหรือตอนที่ค้นหา</strong><button type="button" onClick={() => setFilter('')}>ล้างคำค้น</button></div>}
      </section>
      <footer className="site-footer"><span>หออักษรา</span><p>พื้นที่ส่วนตัวสำหรับเรื่องเล่าที่อยากกลับมาอ่านอีกครั้ง</p><a href={`/book/${book.slug}`}>เกี่ยวกับคอลเลกชัน</a></footer>
      <SearchDialog open={searchOpen} onClose={closeSearch} chapters={chapters} />
      <SettingsDrawer open={settingsOpen} onClose={closeSettings} value={state.settings} onChange={(settings) => setState((current) => ({ ...current, settings }))} />
      {settingsOpen && <button className="drawer-scrim" type="button" onClick={closeSettings} aria-label="ปิดการตั้งค่า" />}
    </main>
  );
}
