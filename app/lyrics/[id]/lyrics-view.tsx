'use client';

import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSongById } from '@/lib/songs';
import type { Song } from '@/lib/types';
import { unicodeToFMFont, unicodeToBamini } from '@/lib/utils';
import {
  ArrowLeft,
  Copy,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function LyricsView({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('unicode');
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const songData = getSongById(id);
    setSong(songData);
  }, [id]);

  const extractNotes = (content: string) => {
    const notesMatch = content.match(/<notes>(.*?)<\/notes>/s);
    return notesMatch ? notesMatch[1] : null;
  };

  const formatLyrics = (content: string) => {
    // Remove notes section from display content
    const contentWithoutNotes = content.replace(/<notes>.*?<\/notes>/s, '');
    
    // Split by double line breaks to get paragraphs
    const paragraphs = contentWithoutNotes.split(/\r\n\r\n/);
    
    // Process each paragraph and wrap verses in interactive spans
    return paragraphs.map((paragraph, index) => {
      // Store the original plain text (without tags) for copying
      // Remove any formatting tags for clipboard copy
      const plainTextVerse = paragraph.replace(/<c>(.*?)<\/c>/g, '$1')
                                    .replace(/<cr>(.*?)<\/cr>/g, '$1')
                                    .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
      
      // Format the chorus tags for display only
      const formattedParagraph = paragraph.replace(
        /<c>(.*?)<\/c>/g,
        '<strong>$1</strong>'
      );
      
      // Wrap the entire paragraph in a clickable verse div
      // Replace line breaks with <br> tags for HTML rendering
      
      const verseHtml = formattedParagraph.replace(/\r\n/g, '<br>');
      
      return `<div class="verse-block cursor-pointer hover:bg-[#d63736]/20 rounded px-2 py-1 mb-4 transition-colors" 
                  data-verse="${plainTextVerse.replace(/"/g, '&quot;')}" 
                  onclick="window.copyVerse(this.getAttribute('data-verse'))">${verseHtml}</div>`;
    }).join('');
  };

  // Function for FM font conversion
  const formatLyricsWithFMFont = (content: string) => {
    // Remove notes section from display content
    const contentWithoutNotes = content.replace(/<notes>.*?<\/notes>/s, '');
    
    // Split by double line breaks to get paragraphs
    const paragraphs = contentWithoutNotes.split(/\r\n\r\n/);
    
    // Process each paragraph and wrap verses in interactive spans
    return paragraphs.map((paragraph, index) => {
      // Store the original plain text (without tags) for copying
      // Remove any formatting tags for clipboard copy
      const plainTextVerse = paragraph.replace(/<c>(.*?)<\/c>/g, '$1')
                                     .replace(/<cr>(.*?)<\/cr>/g, '$1')
                                     .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
      
      // Format the chorus tags for display only
      const formattedParagraph = paragraph.replace(
        /<c>(.*?)<\/c>/g,
        '<strong>$1</strong>'
      );
      
      // Replace line breaks with <br> tags for HTML rendering
      const verseHtml = formattedParagraph.replace(/\r\n/g, '<br>');
      
      // Convert text to FM font
      const fmVerseHtml = unicodeToFMFont(verseHtml);
      
      // Wrap in same clickable div structure as normal Unicode text
      return `<div class="verse-block cursor-pointer hover:bg-[#d63736]/20 rounded px-2 py-1 mb-4 transition-colors fm-font" 
                  data-verse="${plainTextVerse.replace(/"/g, '&quot;')}" 
                  onclick="window.copyVerse(this.getAttribute('data-verse'))">${fmVerseHtml}</div>`;
    }).join('');
  };

  // Function for Bamini font conversion
  const formatLyricsWithBaminiFont = (content: string) => {
    // Remove notes section from display content
    const contentWithoutNotes = content.replace(/<notes>.*?<\/notes>/s, '');
    
    // Split by double line breaks to get paragraphs
    const paragraphs = contentWithoutNotes.split(/\r\n\r\n/);
    
    // Process each paragraph and wrap verses in interactive spans
    return paragraphs.map((paragraph, index) => {
      // Store the original plain text (without tags) for copying
      // Remove any formatting tags for clipboard copy
      const plainTextVerse = paragraph.replace(/<c>(.*?)<\/c>/g, '$1')
                                     .replace(/<cr>(.*?)<\/cr>/g, '$1')
                                     .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
      
      // Format the chorus tags for display only
      const formattedParagraph = paragraph.replace(
        /<c>(.*?)<\/c>/g,
        '<strong>$1</strong>'
      );
      
      // Replace line breaks with <br> tags for HTML rendering
      const verseHtml = formattedParagraph.replace(/\r\n/g, '<br>');
      
      // Convert text to Bamini font
      const baminiVerseHtml = unicodeToBamini(verseHtml);
      
      // Wrap in same clickable div structure as normal Unicode text
      return `<div class="verse-block cursor-pointer hover:bg-[#d63736]/20 rounded px-2 py-1 mb-4 transition-colors bamini-font" 
                  data-verse="${plainTextVerse.replace(/"/g, '&quot;')}" 
                  onclick="window.copyVerse(this.getAttribute('data-verse'))">${baminiVerseHtml}</div>`;
    }).join('');
  };

  // Function to handle verse copying
  const copyVerseToClipboard = (verse: string) => {
    try {
      // Process any remaining escape sequences for proper line breaks
      const processedVerse = verse
        .replace(/\\r\\n/g, '\n') // Replace escaped \r\n with actual line breaks
        .replace(/\\n/g, '\n')    // Replace escaped \n with actual line breaks
        .replace(/\\"/g, '"');    // Replace escaped quotes
      
      navigator.clipboard.writeText(processedVerse);
      toast.success('Verse copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy verse');
      console.error('Error copying verse:', err);
    }
  };

  useEffect(() => {
    // Attach the copyVerse function to window for the inline onclick handlers
    window.copyVerse = (verse: string) => {
      copyVerseToClipboard(verse);
    };
    
    // Cleanup function
    return () => {
      delete window.copyVerse;
    };
  }, []);

  if (!song) {
    return <div>Loading...</div>;
  }

  const notes = extractNotes(song.Content);

  return (
    <main >
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">
        {song.Display_Name}
        {song.Search_Name && (
          <span className="text-gray-400 ml-2">| {song.Search_Name}</span>
        )}
      </h1>
      <div className="flex items-center gap-4 text-gray-400 mb-8">
        <span className="language-button bg-[#d63636]/60">{song.Language}</span>
      </div>
      {notes && (
        <div className="text-gray-400 mb-6 text-sm bg-[#d6363623] p-4 rounded-lg">
          {notes.split('\r\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}

      <Tabs defaultValue="unicode" className="w-full rounded-xl">
        <TabsList className="bg-[#161616] mb-4 rounded-xl">
          <TabsTrigger
            value="unicode"
            className="data-[state=active]:bg-[#d63736] rounded-xl"
          >
            Unicode
          </TabsTrigger>
          <TabsTrigger
            value="fm-atava"
            className="data-[state=active]:bg-[#d63736] rounded-xl"
          >
            Sinhala Font (FM)
          </TabsTrigger>
          <TabsTrigger
            value="tamil"
            className="data-[state=active]:bg-[#d63736] rounded-xl"
          >
            Tamil Font
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unicode" className="mt-4 relative">
          <button
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
            onClick={() => {
              // Remove all formatting tags for plain text copy
              const plainContent = song.Content
                .replace(/<notes>.*?<\/notes>/s, '')
                .replace(/<c>(.*?)<\/c>/g, '$1')
                .replace(/<cr>(.*?)<\/cr>/g, '$1')
                .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
              
              navigator.clipboard.writeText(plainContent);
              toast.success('Content copied to clipboard!');
            }}
          >
            <Copy size={18} />
            Copy All
          </button>
          <div
            className="w-full rounded-xl bg-[#161616] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatLyrics(song.Content) }}
          />
        </TabsContent>
        <TabsContent value="fm-atava" className="mt-4 relative">
          <button
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
            onClick={() => {
              // Remove all formatting tags for plain text copy
              const plainContent = song.Content
                .replace(/<notes>.*?<\/notes>/s, '')
                .replace(/<c>(.*?)<\/c>/g, '$1')
                .replace(/<cr>(.*?)<\/cr>/g, '$1')
                .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
              
              // Convert to FM font for clipboard
              const fmContent = unicodeToFMFont(plainContent);
              navigator.clipboard.writeText(fmContent);
              toast.success('FM Font content copied to clipboard!');
            }}
          >
            <Copy size={18} />
            Copy All
          </button>
          <div
            className="w-full rounded-xl bg-[#161616] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap font-fm"
            dangerouslySetInnerHTML={{ __html: formatLyricsWithFMFont(song.Content) }}
            style={{ fontFamily: "FM-Malithi, FM-Abhaya, serif" }}
          />
        </TabsContent>
        <TabsContent value="tamil" className="mt-4 relative">
          <button
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-[#27272A] px-3 py-2 rounded"
            onClick={() => {
              // Remove all formatting tags for plain text copy
              const plainContent = song.Content
                .replace(/<notes>.*?<\/notes>/s, '')
                .replace(/<c>(.*?)<\/c>/g, '$1')
                .replace(/<cr>(.*?)<\/cr>/g, '$1')
                .replace(/<chorus>(.*?)<\/chorus>/g, '$1');
              
              // Convert to Bamini font for clipboard
              const baminiContent = unicodeToBamini(plainContent);
              navigator.clipboard.writeText(baminiContent);
              toast.success('Tamil Font content copied to clipboard!');
            }}
          >
            <Copy size={18} />
            Copy All
          </button>
          <div
            className="w-full rounded-xl bg-[#161616] text-white p-4 rounded-lg overflow-y-auto whitespace-pre-wrap tamil-font"
            dangerouslySetInnerHTML={{ __html: formatLyricsWithBaminiFont(song.Content) }}
            style={{ fontFamily: "Bamini, TSC_Avarangal, serif" }}
          />
        </TabsContent>
      </Tabs>
    </div>
  </main>
  );
}

// Add TypeScript declaration for the global window object
declare global {
  interface Window {
    copyVerse: (verse: string) => void;
  }
}