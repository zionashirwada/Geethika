import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface AnimatedSearchBarProps {
  onSearch?: (query: string) => void;
}

const AnimatedSearchBar = ({ onSearch }: AnimatedSearchBarProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const placeholders = [
    "Amazing Grace",
    "How Great Thou Art",
    "ඔබ මාගේ ජිවනයයි",
    "අබ්බා පියාණනි"
  ];

  useEffect(() => {
    const animationInterval = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // Change text and fade in after a delay
      setTimeout(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        setIsVisible(true);
      }, 500); // Half a second for fade out
      
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(animationInterval);
  }, [placeholders.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <input
          type="text"
          className="w-full px-4 py-3 pl-5 pr-12 rounded-full bg-[#262626] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          placeholder={isVisible ? placeholders[placeholderIndex] : ""}
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button 
          className="absolute right-3 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200 h-auto"
          onClick={searchQuery ? clearSearch : () => onSearch && onSearch(searchQuery)}
        >
          {searchQuery ? (
            <X className="h-4 w-4 text-white" />
          ) : (
            <Search className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
      <div 
        className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-opacity duration-500 ${isVisible && !searchQuery ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        {!isVisible && placeholders[placeholderIndex]}
      </div>
    </div>
  );
};

export default AnimatedSearchBar;