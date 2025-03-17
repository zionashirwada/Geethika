'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import type { Song } from '@/lib/types';
import { getAllSongs } from '@/lib/songs';
import Sidebar from '@/components/Sidebar';
import AnimatedSearchBar from '@/components/SearchBar';

interface ScoredSong extends Song {
  score: number;
}

export default function LyricsPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(getAllSongs());

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSongs(getAllSongs());
      return;
    }

    const searchString = searchQuery.toLowerCase();
    
    // Score and filter songs based on relevance
    const scoredSongs: ScoredSong[] = getAllSongs().map(song => {
      const displayName = song.Display_Name.toLowerCase();
      const searchName = song.Search_Name?.toLowerCase() || '';
      const content = song.Content.toLowerCase();
      const englishText = (song as any).English_Text?.toLowerCase() || '';
      
      let score = 0;
      
      // Exact match in Display_Name gets highest score
      if (displayName === searchString) {
        score += 100;
      } 
      // Display_Name starts with search string
      else if (displayName.startsWith(searchString)) {
        score += 50;
      }
      // Display_Name contains search string
      else if (displayName.includes(searchString)) {
        score += 25;
      }
      
      // Search_Name exact match or contains
      if (searchName === searchString) {
        score += 75;
      } else if (searchName.includes(searchString)) {
        score += 20;
      }
      
      // Content has exact phrase match
      if (content.includes(searchString)) {
        score += 15;
      }
      
      // English_Text has exact phrase match
      if (englishText.includes(searchString)) {
        score += 15;
      }

      // Check for partial word matches if no exact matches
      if (score === 0) {
        const words = searchString.split(/\s+/);
        for (const word of words) {
          if (word.length < 2) continue; // Skip very short words
          
          if (displayName.includes(word)) score += 10;
          if (searchName.includes(word)) score += 8;
          if (content.includes(word)) score += 5;
          if (englishText.includes(word)) score += 5;
        }
      }
      
      return {
        ...song,
        score
      };
    }).filter(song => song.score > 0);
    
    // Sort by score (highest first)
    scoredSongs.sort((a, b) => b.score - a.score);
    
    setFilteredSongs(scoredSongs);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
        <div className="search-container mb-6">
          <div className="relative">
            <AnimatedSearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="song-list space-y-6">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div 
                key={song.ID} 
                className="song-item cursor-pointer p-4 bg-[#262626] rounded-lg hover:bg-[#323232] transition-colors duration-200"
                onClick={() => router.push(`/lyrics/${song.ID}`)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold tracking-tight">
                    {song.Display_Name}
                    {song.Search_Name && (
                      <span className="text-gray-400 ml-2">| {song.Search_Name}</span>
                    )}
                  </h2>
                  <button className="language-button bg-[#d63736]/70 px-3 py-1 rounded text-white text-sm">{song.Language}</button>
                </div>
                <p className="mt-2 text-gray-400 line-clamp-2">
                  {song.Content.slice(0, 100)}...
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">No songs found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </main>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#d63736] hover:bg-[#e64736] p-2 rounded-lg text-white shadow-lg"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        title="Open menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}