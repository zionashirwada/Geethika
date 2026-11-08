import Image from 'next/image';
import {
  Home,
  BookOpen,
  Music,
  Info,
  PlusCircle,
  X,
  Globe,
  BookText,
  Languages,
  Hammer,
  Hourglass,
  Boxes,
  Sparkle,
  Lightbulb,
  Brush,
  Sliders,
  Presentation,
  Scissors,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'collapsed'} bg-[#161616] m-4 ml-10 my-10 rounded-2xl fixed left-0 top-0 transition-all duration-300`}>
      {/* Mobile close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden bg-[#282828] hover:bg-[#383838] p-2 rounded-lg text-white"
          title="Close"
        >
          <X size={20} />
        </button>
      )}
      <div className="flex items-center justify-center mb-8 p-0 m-0 transition-all duration-300">
        <Image 
          src={isOpen ? "/logo.png" : "/icon.png"} 
          alt="Logo" 
          width={isOpen ? 140 : 40} 
          height={isOpen ? 40 : 40} 
          className="transition-all duration-300"
        />
      </div>

      <div>
      <div className={`section-title ${!isOpen && 'hidden'} transition-all duration-300`}>Support Tools</div>
        <a href="/" className={`sidebar-link transition-all duration-300 ${pathname === '/' ? 'active' : ''}`} title={!isOpen ? "Home" : ""}>
          <Home size={20} />
          {isOpen && <span>Home</span>}
        </a>
        <a href="/lyrics" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/lyrics') ? 'active' : ''}`} title={!isOpen ? "Lyrics" : ""}>
          <BookText size={20} />
          {isOpen && <span>Lyrics</span>}
        </a>
        <a href="/bible" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/bible') ? 'active' : ''}`} title={!isOpen ? "Bible" : ""}>
          <BookOpen size={20} />
          {isOpen && <span>Bible</span>}
        </a>
        <a href="/hymns" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/hymns') ? 'active' : ''}`} title={!isOpen ? "Hymns" : ""}>
          <Music size={20} />
          {isOpen && <span>Hymns</span>}
        </a>
        <a href="/translate" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/translate') ? 'active' : ''}`} title={!isOpen ? "Translate" : ""}>
          <Languages size={20} />
          {isOpen && <span>Convert Font</span>}  
        </a>
        <a href="/slide" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/slide') ? 'active' : ''}`} title={!isOpen ? "Slide" : ""}>
          <Presentation size={20} />
          {isOpen && <span>Slide Creator</span>}
        </a>
        <a href="/shorts" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/shorts') ? 'active' : ''}`} title={!isOpen ? "Short Creator" : ""}>
          <Scissors size={20} />
          {isOpen && <span>Short Creator</span>}
        </a>
      </div>

      <div className={`section-title ${!isOpen && 'hidden'} transition-all duration-300`}>AI Tools</div>
      <a href="/ai/soaper" className={`sidebar-link transition-all duration-300 ${pathname === '/ai/soaper' ? 'active' : ''}`} title={!isOpen ? "Privacy" : ""}>
        <Boxes size={20} />
        {isOpen && <span>SOAPer</span>}
      </a>
    
      <a href="/ai/kids" className={`sidebar-link transition-all duration-300 ${pathname === '/ai/kids' ? 'active' : ''}`} title={!isOpen ? "Privacy" : ""}>
        <Brush size={20} />
        {isOpen && <span>Kids Studio</span>}
      </a>
     
      

      <div className={`section-title ${!isOpen && 'hidden'} transition-all duration-300`}>Other</div>
      <a href="/more" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/more' )? 'active' : ''}`} title={!isOpen ? "Privacy" : ""}>
        <Hammer size={20} />
        {isOpen && <span>More Tools</span>}
      </a>
      <a href="/about" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/about') ? 'active' : ''}`} title={!isOpen ? "About" : ""}>
        <Info size={20} />
        {isOpen && <span>About</span>}
      </a>
      <a href="/contact" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/contact') ? 'active' : ''}`} title={!isOpen ? "Contact" : ""}>
        <Globe size={20} />
        {isOpen && <span>Contact</span>}
      </a>
     
      <a href="/add" className={`sidebar-link transition-all duration-300 ${pathname?.startsWith('/add') ? 'active' : ''}`} title={!isOpen ? "Contribute" : ""}>
        <PlusCircle size={20} />
        {isOpen && <span>Contribute</span>}
      </a>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs">
        &copy; Developed by{' '}
        <a 
          href="https://zionashir.lk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#d63736] hover:underline"
        >
          &nbsp;Zion Ashirwada
        </a>
      </div>
    </nav>
  );
}
