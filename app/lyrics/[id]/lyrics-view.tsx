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
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSongById } from '@/lib/songs';
import type { Song } from '@/lib/types';
import Sidebar from '@/components/Sidebar';

export function LyricsView({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('unicode');
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    const songData = getSongById(id);
    setSong(songData);
  }, [id]);

  const formatLyrics = (content: string) => {
    return content.split(/\r\n\r\n/).map((paragraph, index) => {
      // Replace <c> tags with bold text
      const formattedParagraph = paragraph.replace(
        /<c>(.*?)<\/c>/g,
        '<strong>$1</strong>'
      );
      return `${formattedParagraph}${index < content.split(/\r\n\r\n/).length - 1 ? '\n\n' : ''}`;
    }).join('');
  };

  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#121212]">
    
    <Sidebar isOpen={false} />

      {/* Main Content */}
      <main className="flex-1 ml-16 p-8">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            {song.Display_Name}
            {song.Search_Name && (
              <span className="text-gray-400 ml-2">| {song.Search_Name}</span>
            )}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 mb-8">
            <span className="language-button">{song.Language}</span>
          </div>

          <Tabs defaultValue="unicode" className="w-full">
            <TabsList className="bg-[#282828] mb-4">
              <TabsTrigger 
                value="unicode"
                className="data-[state=active]:bg-[#d63736]"
              >
                Unicode
              </TabsTrigger>
              <TabsTrigger 
                value="fm-atava"
                className="data-[state=active]:bg-[#d63736]"
              >
                FM-ATAVA
              </TabsTrigger>
              <TabsTrigger 
                value="tamil"
                className="data-[state=active]:bg-[#d63736]"
              >
                Tamil Font
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unicode" className="mt-4 relative">
              <button 
                className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
                onClick={() => navigator.clipboard.writeText(song.Content)}
              >
                <Copy size={18} />
                Copy All
              </button>
              <div
                className="w-full h-[500px] bg-[#282828] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatLyrics(song.Content) }}
              />
            </TabsContent>
            <TabsContent value="fm-atava" className="mt-4 relative">
              <button 
                className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
                onClick={() => navigator.clipboard.writeText(song.Content)}
              >
                <Copy size={18} />
                Copy All
              </button>
              <div
                className="w-full h-[500px] bg-[#282828] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatLyrics(song.Content) }}
              />
            </TabsContent>
            <TabsContent value="tamil" className="mt-4 relative">
              <button 
                className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
                onClick={() => navigator.clipboard.writeText(song.Content)}
              >
                <Copy size={18} />
                Copy All
              </button>
              <div
                className="w-full h-[500px] bg-[#282828] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatLyrics(song.Content) }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}