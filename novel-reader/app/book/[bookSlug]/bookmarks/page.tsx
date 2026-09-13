import { notFound } from 'next/navigation'; import BookmarksClient from '../../../components/BookmarksClient'; import { book } from '../../../lib/data';
export default async function BookmarksPage({ params }: { params:Promise<{ bookSlug:string }> }) { const { bookSlug } = await params; if (bookSlug !== book.slug) notFound(); return <BookmarksClient />; }
