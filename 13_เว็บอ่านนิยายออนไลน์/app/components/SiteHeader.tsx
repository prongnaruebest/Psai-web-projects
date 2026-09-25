'use client';
import Link from 'next/link';
import { book } from '../lib/data';

type Props = { onSearch: () => void; onSettings: () => void; compact?: boolean };

export default function SiteHeader({ onSearch, onSettings, compact = false }: Props) {
  return (
    <header className={`topbar ${compact ? 'reader-topbar' : ''}`}>
      <Link className="brand" href="/" aria-label="หออักษรา หน้าแรก">
        <span className="brand-mark" aria-hidden="true">อ</span>
        <span><strong>หออักษรา</strong><small>คลังเรื่องเล่าส่วนตัว</small></span>
      </Link>
      {!compact && <p className="collection-count"><strong>{book.totalVolumes} เล่มจบ</strong><span>•</span>{book.totalChapters} ตอน</p>}
      <nav className="top-actions" aria-label="เมนูหลัก">
        <button type="button" onClick={onSearch} title="ค้นหา (Ctrl+K)" aria-label="ค้นหาตอน"><span aria-hidden="true">⌕</span><span className="action-label">ค้นหา</span></button>
        <Link className="header-link" href="/book/cloud-inscription/bookmarks" aria-label="เปิดที่คั่นหน้า"><span aria-hidden="true">♧</span><span className="action-label">ที่คั่นหน้า</span></Link>
        <button type="button" onClick={onSettings} aria-label="ตั้งค่าการอ่าน"><span aria-hidden="true">Aa</span></button>
      </nav>
    </header>
  );
}
