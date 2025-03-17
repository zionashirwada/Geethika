import Image from 'next/image';
import {
  Home,
  BookOpen,
  Music,
  Info,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''} bg-[#161616] m-4 ml-10 my-10 rounded-2xl fixed left-0 top-0 `}>
      <div className="flex items-center gap-2 mb-8 px-4">
        <Image src="/logo.png" alt="Logo" width={140} height={40} />
      </div>

      <div>
        <div className="text-sm font-medium mb-2 px-4">Menu</div>
        <a href="#" className="sidebar-link">
          <Home size={20} />
          Home
        </a>
        <a href="#" className="sidebar-link active">
          <BookOpen size={20} />
          Lyrics
        </a>
        <a href="#" className="sidebar-link">
          <BookOpen size={20} />
          Bible
        </a>
        <a href="#" className="sidebar-link">
          <Music size={20} />
          Hymns
        </a>
      </div>

      <div className="section-title">Library</div>
      <a href="#" className="sidebar-link">
        <Info size={20} />
        About
      </a>
      <a href="#" className="sidebar-link">
        <PlusCircle size={20} />
        Contribute
      </a>
    </nav>
  );
}
