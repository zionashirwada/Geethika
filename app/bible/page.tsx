'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import UnderDevelopment from '@/components/UnderDev';
import BiblePageMenu from './menu';

export default function BiblePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main >
    <BiblePageMenu/>
      </main>
  );
}