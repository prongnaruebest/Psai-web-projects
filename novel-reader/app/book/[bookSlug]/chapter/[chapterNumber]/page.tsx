import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReaderClient from '../../../../components/ReaderClient';
import { book, chapters, getChapter } from '../../../../lib/data';

type Props = { params: Promise<{ bookSlug: string; chapterNumber: string }> };

export function generateStaticParams() { return chapters.map((chapter) => ({ bookSlug:book.slug, chapterNumber:String(chapter.number) })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug, chapterNumber } = await params;
  const chapter = bookSlug === book.slug ? getChapter(Number(chapterNumber)) : undefined;
  if (!chapter) return { title:'ไม่พบตอน · หออักษรา' };
  return { title:`${chapter.number}. ${chapter.title} · หออักษรา`, description:chapter.excerpt, openGraph:{ title:`${chapter.number}. ${chapter.title} · หออักษรา`, description:chapter.excerpt, images:[] }, twitter:{ card:'summary', title:`${chapter.number}. ${chapter.title} · หออักษรา`, description:chapter.excerpt, images:[] } };
}

export default async function ChapterPage({ params }: Props) {
  const { bookSlug, chapterNumber } = await params;
  const chapter = bookSlug === book.slug ? getChapter(Number(chapterNumber)) : undefined;
  if (!chapter) notFound();
  return <ReaderClient chapter={chapter} />;
}
