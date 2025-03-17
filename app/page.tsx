'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Compass,
  TrendingUp,
  Album,
  User2,
  Clock,
  PlayCircle,
  Heart,
  ListMusic,
  PlusCircle,
  Headphones,
  Menu,
  Search,
} from 'lucide-react';
import type { Song } from '@/lib/types';
import { getAllSongs } from '@/lib/songs';

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="flex items-center gap-2 mb-8">
          <Headphones className="w-8 h-8 text-[#d63736]" />
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Menu</div>
          <a href="#" className="sidebar-link">
            <Home size={20} />
            Home
          </a>
          <a href="#" className="sidebar-link active">
            <Compass size={20} />
            Discover
          </a>
          <a href="#" className="sidebar-link">
            <TrendingUp size={20} />
            Trending
          </a>
          <a href="#" className="sidebar-link">
            <Album size={20} />
            Albums
          </a>
          <a href="#" className="sidebar-link">
            <User2 size={20} />
            Artist
          </a>
        </div>

        <div className="section-title">Library</div>
        <a href="#" className="sidebar-link">
          <Clock size={20} />
          Recent added
        </a>
        <a href="#" className="sidebar-link">
          <PlayCircle size={20} />
          Most played
        </a>
        <a href="#" className="sidebar-link">
          <Heart size={20} />
          Favorite tracks
        </a>

        <div className="section-title">Playlist</div>
        <a href="#" className="sidebar-link">
          <ListMusic size={20} />
          My playlist
        </a>
        <a href="#" className="sidebar-link text-[#d63736]">
          <PlusCircle size={20} />
          Create New
        </a>
      </nav>

      {/* Main Content */}
      <main className="main-content flex-1">
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