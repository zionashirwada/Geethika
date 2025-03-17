'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import type { Song } from '@/lib/types';
import { getAllSongs } from '@/lib/songs';
import Sidebar from '@/components/Sidebar';
import AnimatedSearchBar from '@/components/SearchBar';

export default function LyricsPage() {
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
    <div className="flex min-h-screen p-4 lg:px-14 relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} />
      </div>
      
      {/* Mobile Sidebar and Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed z-50">
            <Sidebar isOpen={true} onClose={() => setIsMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="main-content flex-1 ml-[280px] md:ml-[280px]">
        <div className="search-container  ">
          <div className="relative">
           
            <AnimatedSearchBar />
        
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
                <button className="language-button bg-[#d63736]/70">{song.Language}</button>
              </div>
              <p className="mt-2 text-gray-400 line-clamp-2">
                {song.Content.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#d63736] hover:bg-[#e64736] p-2 rounded-lg text-white shadow-lg"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={24} />
      </button>
    </div>
  );
}