'use client';

import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
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
import BaminiToUnicodePage from './convertors/bamini-to-unicode';
import FMToUnicodePage from './convertors/fm-to-unicode';
import KaputaToUnicodePage from './convertors/kaputa-to-Unicode';
import SinglishToUnicodePage from './convertors/singlish-to-Unicode';
import TanglishToUnicodePage from './convertors/tanglish-to-Unicode';
import UnicodeToBaminiPage from './convertors/unicode-to-bamini';
import UnicodeToFMPage from './convertors/unicode-to-fm';

export function ConvertView({ id }: { id: string }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderConverterPage = () => {
    switch (id) {
      case 'bamini-to-unicode':
        return <BaminiToUnicodePage />;
      case 'fm-to-unicode':
        return <FMToUnicodePage />;
      case 'kaputa-to-unicode':
        return <KaputaToUnicodePage />;
      case 'singlish-to-unicode':
        return <SinglishToUnicodePage />;
      case 'tanglish-to-unicode':
        return <TanglishToUnicodePage />;
      case 'unicode-to-bamini':
        return <UnicodeToBaminiPage />;
      case 'unicode-to-fm':
        return <UnicodeToFMPage />;
      default:
        return <div>Converter not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen relative">
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

      {/* Hamburger Button for Mobile */}
      <Button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#d63736] hover:bg-[#e64736] p-2 rounded-full text-white shadow-lg"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={24} />
      </Button>

      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        className="hidden md:flex fixed top-10 left-4 md:left-[350px] z-40 items-center gap-2 bg-[#161616]/90 backdrop-blur-sm hover:bg-[#27272A] text-gray-400 hover:text-white px-4 py-2 rounded-full transition-colors"
      >
        <ArrowLeft size={20} className='' />
        Back
      </Button>

      {/* Main Content */}
      <main className="flex-1 ml-16 p-8 md:ml-[280px]">
        {renderConverterPage()}
      </main>
    </div>
  );
}

// Add TypeScript declaration for the global window object
declare global {
  interface Window {
    copyVerse: (verse: string) => void;
  }
}