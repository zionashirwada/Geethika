import songsData from '@/data/songs.json';
import type { Song } from './types';

export function getAllSongs(): Song[] {
  return songsData.songs;
}

export function getSongById(id: string): Song | undefined {
  return songsData.songs.find(song => song.ID === id);
}