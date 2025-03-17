import Image from 'next/image';
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
  );
}
