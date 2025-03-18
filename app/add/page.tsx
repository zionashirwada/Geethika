'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import UnderDevelopment from '@/components/UnderDev';

export default function NewSongPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="main-content flex-1 ml-0 md:ml-[280px]">
    <UnderDevelopment/>
  </main>
  );
}