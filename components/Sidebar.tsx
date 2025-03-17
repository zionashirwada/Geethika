import Image from 'next/image';
import {
  Home,
  BookOpen,
  Music,
  Info,
  PlusCircle,
  X, // added for mobile close button
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void; // new optional prop
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'collapsed'} bg-[#161616] m-4 ml-10 my-10 rounded-2xl fixed left-0 top-0 transition-all duration-300 relative`}>
      {/* Mobile close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden bg-[#282828] hover:bg-[#383838] p-2 rounded-lg text-white"
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
        <div className={`text-sm font-medium mb-2 px-4 ${!isOpen && 'hidden'} transition-all duration-300`}>Menu</div>
        <a href="#" className="sidebar-link transition-all duration-300" title={!isOpen ? "Home" : ""}>
          <Home size={20} />
          {isOpen && <span>Home</span>}
        </a>
        <a href="#" className="sidebar-link active transition-all duration-300" title={!isOpen ? "Lyrics" : ""}>
          <BookOpen size={20} />
          {isOpen && <span>Lyrics</span>}
        </a>
        <a href="#" className="sidebar-link transition-all duration-300" title={!isOpen ? "Bible" : ""}>
          <BookOpen size={20} />
          {isOpen && <span>Bible</span>}
        </a>
        <a href="#" className="sidebar-link transition-all duration-300" title={!isOpen ? "Hymns" : ""}>
          <Music size={20} />
          {isOpen && <span>Hymns</span>}
        </a>
      </div>

      <div className={`section-title ${!isOpen && 'hidden'} transition-all duration-300`}>Library</div>
      <a href="#" className="sidebar-link transition-all duration-300" title={!isOpen ? "About" : ""}>
        <Info size={20} />
        {isOpen && <span>About</span>}
      </a>
      <a href="#" className="sidebar-link transition-all duration-300" title={!isOpen ? "Contribute" : ""}>
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
