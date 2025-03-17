'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import type { Song } from '@/lib/types';
import { getAllSongs } from '@/lib/songs';
import Sidebar from '@/components/Sidebar';

export default function HomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(getAllSongs());

  useEffect(() => {
    const filtered = getAllSongs().filter((song) => {
      const searchString = searchQuery.toLowerCase();
      const displayName = song.Display_Name.toLowerCase();
      const searchName = song.Search_Name?.toLowerCase() || '';
      const content = song.Content.toLowerCase();

      return (
        displayName.includes(searchString) ||
        searchName.includes(searchString) ||
        content.includes(searchString)
      );
    });
    setFilteredSongs(filtered);
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen p-4 lg:px-14">
      <Sidebar isOpen={true} />

      {/* Main Content */}
      <main className="main-content flex-1 ml-[280px]">
        <div className="search-container">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for songs, lyrics..."
              className="search-bar pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="song-list">
          {filteredSongs.map((song) => (
            <div 
              key={song.ID} 
              className="song-item cursor-pointer"
              onClick={() => router.push(`/lyrics/${song.ID}`)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">
                  {song.Display_Name}
                  {song.Search_Name && (
                    <span className="text-gray-400 ml-2">| {song.Search_Name}</span>
                  )}
                </h2>
                <button className="language-button">{song.Language}</button>
              </div>
              <p className="mt-2 text-gray-400 line-clamp-2">{song.Content}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={24} />
      </button>
    </div>
  );
}