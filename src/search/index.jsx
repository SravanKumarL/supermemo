import { useState, useMemo, useRef, useEffect } from "react";
import "./index.css";

function Search({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  
  // Simulated database of searchable items
  const allItems = [
    { type: "Topic", category: "Physics", title: "What is hubble telescope", content: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation." },
    { type: "Flashcard", category: "Telescope", title: "Who invented Hubble Telescope", content: "The Hubble Space Telescope is named after astronomer Edwin Hubble and was built by NASA with contributions from the European Space Agency." },
    { type: "Topic", category: "Physics", title: "Understanding gravity", content: "Gravity is one of the fundamental forces of nature, described by Newton's law of universal gravitation and Einstein's theory of general relativity." },
    { type: "Flashcard", category: "Physics", title: "Newton's laws of motion", content: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it." },
    { type: "Topic", category: "Astronomy", title: "Solar system planets", content: "The solar system consists of eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune." },
    { type: "Flashcard", category: "Astronomy", title: "Order of planets from sun", content: "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune." }
  ];

  // Filter and search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={index} className="bg-yellow-200 font-medium">{part}</span>
        : part
    );
  };

  const handleResultClick = (result) => {
    onSelect(result);
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search topics, extracts, and flashcards..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
          onFocus={() => setIsOpen(true)}
        />
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
          onClick={() => {
            setSearchQuery("");
            setIsOpen(false);
            setSelectedIndex(-1);
          }}
        >
          {searchQuery ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </button>
      </div>
      
      {isOpen && (searchResults.length > 0 || (searchQuery && searchResults.length === 0)) && (
        <div 
          ref={resultsRef}
          className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto transition-all duration-200 animate-slideDown"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 cursor-pointer border-b last:border-b-0 border-gray-100 transition-all duration-200 ${
                  index === selectedIndex 
                    ? 'bg-blue-50' 
                    : 'hover:bg-blue-50'
                }`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.type === 'Topic' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  } font-medium transition-colors duration-200`}>
                    {result.type}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                    {result.category}
                  </span>
                </div>
                <span className="block mt-1 font-medium text-gray-800">
                  {highlightMatch(result.title, searchQuery)}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 animate-fadeIn">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
