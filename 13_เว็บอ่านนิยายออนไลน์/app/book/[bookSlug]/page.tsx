import Link from 'next/link'; import { notFound } from 'next/navigation';
import { book, volumes } from '../../lib/data';

export default async function BookPage({ params }: { params: Promise<{ bookSlug:string }> }) {
  const { bookSlug } = await params; if (bookSlug !== book.slug) notFound();
  return <main className="about-page"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">อ</span><span><strong>หออักษรา</strong><small>กลับชั้นหนังสือ</small></span></Link><section><p className="eyebrow">เกี่ยวกับคอลเลกชัน</p><h1>{book.title}</h1><p className="about-lead">{book.description}</p><dl><div><dt>ผู้เขียน</dt><dd>{book.author}</dd></div><div><dt>ฉบับ</dt><dd>{book.translator}</dd></div><div><dt>สถานะ</dt><dd>{book.totalVolumes} เล่ม · {book.totalChapters} ตอน</dd></div><div><dt>สิทธิ์การใช้งาน</dt><dd>{book.copyright}</dd></div></dl><h2>สารบัญรวมเล่ม</h2>{volumes.map((volume) => <a className="about-volume" key={volume.id} href={`/book/${book.slug}/chapter/${volume.firstChapter}`}><span>{String(volume.number).padStart(2,'0')}</span><div><strong>{volume.title}</strong><small>ตอน {volume.firstChapter}–{volume.lastChapter} · {volume.totalPages} หน้า</small></div><b aria-hidden="true">→</b></a>)}</section></main>;
}
