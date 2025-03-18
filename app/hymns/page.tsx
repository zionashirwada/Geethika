'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import UnderDevelopment from '@/components/UnderDev';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Music, Play, ChevronLeft, ChevronRight, Headphones, User, Disc3 } from "lucide-react"

// Mock data for hymns
const allHymns = [
  { id: 1, title: "Amazing Grace", artist: "John Newton", language: "English", duration: "3:45" },
  { id: 2, title: "என் இயேசுவே", artist: "Joel Thomasraj", language: "Tamil", duration: "4:12" },
  { id: 3, title: "ස්තූතියි දෙවිඳුනි", artist: "Lakshman Jayawardena", language: "Sinhala", duration: "5:01" },
  { id: 4, title: "How Great Thou Art", artist: "Stuart K. Hine", language: "English", duration: "4:30" },
  { id: 5, title: "கர்த்தரே உம்மை", artist: "Sam Sudhakar", language: "Tamil", duration: "3:58" },
  { id: 6, title: "ඔබේ ආදරය", artist: "Priya Fernando", language: "Sinhala", duration: "4:45" },
  { id: 7, title: "What A Beautiful Name", artist: "Hillsong Worship", language: "English", duration: "4:17" },
  { id: 8, title: "தேவனின் அன்பு", artist: "Gersson Edinbaro", language: "Tamil", duration: "5:23" },
  { id: 9, title: "දෙවියන් වහන්සේගේ ආදරය", artist: "Chandima Wickramasinghe", language: "Sinhala", duration: "4:05" },
  { id: 10, title: "10,000 Reasons", artist: "Matt Redman", language: "English", duration: "5:42" },
  { id: 11, title: "என் ஆத்துமாவே", artist: "Benny Joshua", language: "Tamil", duration: "4:33" },
  { id: 12, title: "මගේ ජීවිතය", artist: "Sunil Buddhika", language: "Sinhala", duration: "3:50" },
  { id: 13, title: "Oceans", artist: "Hillsong United", language: "English", duration: "5:30" },
  { id: 14, title: "இயேசுவின் நாமம்", artist: "Paul Thangiah", language: "Tamil", duration: "4:10" },
  { id: 15, title: "සුදු කුරුසිය", artist: "Athula Adikari", language: "Sinhala", duration: "4:22" },
  { id: 16, title: "Great Is Thy Faithfulness", artist: "Thomas Chisholm", language: "English", duration: "4:50" },
  { id: 17, title: "உன்னத தேவன்", artist: "Ranjith Samuel", language: "Tamil", duration: "5:15" },
  { id: 18, title: "ඔබ සමීපයේ", artist: "Sangeeth Perera", language: "Sinhala", duration: "3:40" },
  { id: 19, title: "In Christ Alone", artist: "Keith Getty", language: "English", duration: "4:38" },
  { id: 20, title: "மகிமையின் ராஜா", artist: "Victor Jeyakumar", language: "Tamil", duration: "5:05" },
  { id: 21, title: "ස්තුතියි ස්වාමීනි", artist: "Indika Prasad", language: "Sinhala", duration: "4:15" },
  { id: 22, title: "How Great Is Our God", artist: "Chris Tomlin", language: "English", duration: "4:44" },
  { id: 23, title: "அல்லேலூயா", artist: "Ebenezer Samuel", language: "Tamil", duration: "5:20" },
  { id: 24, title: "යේසුස් වහන්සේ", artist: "Ruwan Perera", language: "Sinhala", duration: "3:55" },
  { id: 25, title: "Blessed Be Your Name", artist: "Matt Redman", language: "English", duration: "4:16" },
]

// Mock data for featured artists
const featuredArtists = [
  { id: 1, name: "Hillsong Worship", image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=100&width=100", spotifyUrl: "#" },
  { id: 2, name: "Joel Thomasraj", image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=100&width=100", spotifyUrl: "#" },
  { id: 3, name: "Lakshman Jayawardena", image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=100&width=100", spotifyUrl: "#" },
  { id: 4, name: "Matt Redman", image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=100&width=100", spotifyUrl: "#" },
  { id: 5, name: "Gersson Edinbaro", image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=100&width=100", spotifyUrl: "#" },
]

// Mock data for Spotify playlists
const spotifyPlaylists = [
  {
    id: 1,
    title: "Tamil Christian Worship",
    description: "Best Tamil worship songs collection",
    image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=300&width=300",
    spotifyUrl: "#",
    tracks: 45,
  },
  {
    id: 2,
    title: "Sinhala Praise",
    description: "Top Sinhala Christian songs",
    image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=300&width=300",
    spotifyUrl: "#",
    tracks: 32,
  },
  {
    id: 3,
    title: "English Hymns Collection",
    description: "Classic and contemporary English hymns",
    image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=300&width=300",
    spotifyUrl: "#",
    tracks: 50,
  },
  {
    id: 4,
    title: "Multilingual Worship",
    description: "Worship songs in multiple languages",
    image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=300&width=300",
    spotifyUrl: "#",
    tracks: 28,
  },
]

export default function HymnsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const itemsPerPage = 10

  // Filter hymns based on search query and language filter
  const filteredHymns = allHymns.filter((hymn) => {
    const matchesSearch =
      hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hymn.artist.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLanguage = selectedLanguage === "All" || hymn.language === selectedLanguage

    return matchesSearch && matchesLanguage
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredHymns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHymns = filteredHymns.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
      <div className="min-h-screen bg-[#0d0d0d] text-white">
      

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hymns Library</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover and listen to hymns in Tamil, Sinhala, and English. Connect with Spotify for a seamless worship
              experience.
            </p>
            <div className="h-1 w-20 bg-[#d63736] mx-auto mt-6"></div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search hymns by title or artist..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1) // Reset to first page on new search
                  }}
                  className="pl-10 bg-[#252525] border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedLanguage("All")}
                  className={`${
                    selectedLanguage === "All" ? "bg-[#d63736] hover:bg-[#c52c2c]" : "bg-[#252525] hover:bg-[#333]"
                  }`}
                >
                  All
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("Tamil")}
                  className={`${
                    selectedLanguage === "Tamil" ? "bg-[#d63736] hover:bg-[#c52c2c]" : "bg-[#252525] hover:bg-[#333]"
                  }`}
                >
                  Tamil
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("Sinhala")}
                  className={`${
                    selectedLanguage === "Sinhala" ? "bg-[#d63736] hover:bg-[#c52c2c]" : "bg-[#252525] hover:bg-[#333]"
                  }`}
                >
                  Sinhala
                </Button>
                <Button
                  onClick={() => setSelectedLanguage("English")}
                  className={`${
                    selectedLanguage === "English" ? "bg-[#d63736] hover:bg-[#c52c2c]" : "bg-[#252525] hover:bg-[#333]"
                  }`}
                >
                  English
                </Button>
              </div>
            </div>
          </div>

          {/* Hymns List Section */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 mb-8 overflow-hidden">
            <div className="p-4 bg-[#252525] flex items-center">
              <h2 className="text-xl font-bold flex items-center">
                <Music className="mr-2 text-[#d63736]" /> Hymns
              </h2>
              <div className="ml-auto text-sm text-gray-400">{filteredHymns.length} results</div>
            </div>

            {paginatedHymns.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {paginatedHymns.map((hymn) => (
                  <div key={hymn.id} className="p-4 hover:bg-[#252525] transition-colors flex items-center">
                    <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center mr-4">
                      <Play className="h-5 w-5 text-[#d63736]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold">{hymn.title}</h3>
                      <p className="text-sm text-gray-400">{hymn.artist}</p>
                    </div>
                    <div className="text-sm text-gray-400 mr-4">{hymn.language}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Headphones className="h-4 w-4 mr-1" />
                      {hymn.duration}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No hymns found matching your search criteria. Try adjusting your filters.
              </div>
            )}

            {/* Pagination */}
            {filteredHymns.length > 0 && (
              <div className="p-4 bg-[#252525] flex items-center justify-between">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-[#333] hover:bg-[#444] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>

                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-[#333] hover:bg-[#444] disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Featured Artists Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <User className="mr-2 text-[#d63736]" /> Featured Artists
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredArtists.map((artist) => (
                <a
                  key={artist.id}
                  href={artist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 hover:border-[#d63736] transition-colors text-center group"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
                    <Image
                      src={artist.image || "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg"}
                      alt={artist.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold group-hover:text-[#d63736] transition-colors">{artist.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#1DB954"
                      className="mr-1"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-12 bg-gradient-to-r from-[#d63736]/20 to-[#1a1a1a] p-8 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-3">Want to Get Featured?</h2>
                <p className="text-gray-300 mb-4">
                  Are you a worship artist or do you have a playlist you'd like to share with our community? We're
                  always looking to feature new artists and playlists to enrich our worship resources.
                </p>
                <ul className="text-gray-300 mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Get your music featured on our platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Share your curated worship playlists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Connect with a community of worship leaders</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Link href="/contact">
                  <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white px-8 py-6 text-lg">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Spotify Playlists Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Disc3 className="mr-2 text-[#d63736]" /> Spotify Playlists
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {spotifyPlaylists.map((playlist) => (
                <a
                  key={playlist.id}
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-[#d63736] transition-colors group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={playlist.image || "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg"}
                      alt={playlist.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-[#d63736] transition-colors">{playlist.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{playlist.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#1DB954"
                        className="mr-1"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      {playlist.tracks} tracks
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

   
    </div>
      </main>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#d63736] hover:bg-[#e64736] p-2 rounded-xl text-white shadow-lg"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        title="Open menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}