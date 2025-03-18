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
 
      <main >
        {renderConverterPage()}
      </main>

  );
}

// Add TypeScript declaration for the global window object
declare global {
  interface Window {
    copyVerse: ((verse: string) => void) | undefined;  // Make the property optional
  }
}