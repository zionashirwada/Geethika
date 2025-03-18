import { Metadata } from 'next';
import { getAllSongs } from '@/lib/songs';
import { ConvertView } from './convert-view';

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

export default function ConvertorPage({ params }: { params: { id: string } }) {
  return <ConvertView id={params.id} />;
}