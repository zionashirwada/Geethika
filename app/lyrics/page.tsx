'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Song } from '@/lib/types';
import { getAllSongs } from '@/lib/songs';
import Sidebar from '@/components/Sidebar';
import AnimatedSearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

interface ScoredSong extends Song {
  score: number;
}

export default function LyricsPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoredSongs, setScoredSongs] = useState<ScoredSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(getAllSongs());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;
  const [totalSongs, setTotalSongs] = useState(getAllSongs().length);
  const [displayedSongs, setDisplayedSongs] = useState<Song[]>([]);
  
  // Debouncing setup
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Search filtering effect
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setScoredSongs([]);
      setFilteredSongs(getAllSongs());
      setTotalSongs(getAllSongs().length);
      return;
    }

    const searchString = debouncedQuery.toLowerCase();
    
    // Score and filter songs based on relevance
    const scored: ScoredSong[] = getAllSongs().map(song => {
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
    scored.sort((a, b) => b.score - a.score);
    
    setScoredSongs(scored);
    setFilteredSongs(scored);
    setTotalSongs(scored.length);
    setCurrentPage(1); // Reset to first page on new search
  }, [debouncedQuery]);

  // Pagination effect
  useEffect(() => {
    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    setDisplayedSongs(filteredSongs.slice(indexOfFirstSong, indexOfLastSong));
  }, [currentPage, filteredSongs]);

  // Pagination controls
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
      <main className="main-content flex-1 ml-0 md:ml-[280px]">
        <div className="search-container mb-6">
          <div className="relative">
            <AnimatedSearchBar onSearch={handleSearch} />
            <div className="mt-2 text-gray-400 text-sm">
              {searchQuery.trim() 
                ? `Found ${totalSongs} song${totalSongs !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `Total ${totalSongs} song${totalSongs !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        <div className="song-list space-y-6">
          {displayedSongs.length > 0 ? (
            displayedSongs.map((song) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination flex justify-center items-center mt-8 space-x-2">
            <Button
              size="sm"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-[#262626] hover:bg-[#323232] rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show current page and at most 2 pages on either side
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 2
                ) {
                  return (
                    <Button
                      key={pageNum}
                   
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-[#d63736] hover:bg-[#e64736] rounded-full"
                          : "bg-[#262626] hover:bg-[#323232] rounded-full"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (
                  (pageNum === currentPage - 3 && currentPage > 3) ||
                  (pageNum === currentPage + 3 && currentPage < totalPages - 2)
                ) {
                  // Show ellipsis for skipped pages
                  return <span key={pageNum}>...</span>;
                }
                return null;
              })}
            </div>
            
            <Button
              size="sm"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-[#262626] hover:bg-[#323232] rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
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