import { Metadata } from 'next';
import { LyricsView } from './lyrics-view';
import { getAllSongs } from '@/lib/songs';

export async function generateStaticParams() {
  const songs = getAllSongs();
  return songs.map((song) => ({
    id: song.ID,
  }));
}

export const metadata: Metadata = {
  title: 'Lyrics | Geethika.db',
  description: 'View song lyrics',
};

export default function LyricsPage({ params }: { params: { id: string } }) {
  return <LyricsView id={params.id} />;
}