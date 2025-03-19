/**
 * Search Component
 * 
 * A powerful search interface that allows users to search through topics and flashcards.
 * Features include:
 * - Real-time search with highlighting
 * - Keyboard navigation (up/down arrows, enter, escape)
 * - Click outside to close
 * - Animated results dropdown
 * - Visual feedback for selected items
 * - Type and category tags
 * - Content previews
 * 
 * @param {Function} onSelect - Callback function when a search result is selected
 */

import { useState, useMemo, useRef, useEffect } from "react";
import "./index.css";

function Search({ onSelect }) {
  // State management for search functionality
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  
  /**
   * Simulated database of searchable items
   * TODO: Replace with actual data source
   * Each item has:
   * - type: "Topic" or "Flashcard"
   * - category: Subject area
   * - title: Searchable title
   * - content: Preview text
   */
  const allItems = [
    { type: "Topic", category: "Physics", title: "What is hubble telescope", content: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation." },
    { type: "Flashcard", category: "Telescope", title: "Who invented Hubble Telescope", content: "The Hubble Space Telescope is named after astronomer Edwin Hubble and was built by NASA with contributions from the European Space Agency." },
    { type: "Topic", category: "Physics", title: "Understanding gravity", content: "Gravity is one of the fundamental forces of nature, described by Newton's law of universal gravitation and Einstein's theory of general relativity." },
    { type: "Flashcard", category: "Physics", title: "Newton's laws of motion", content: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it." },
    { type: "Topic", category: "Astronomy", title: "Solar system planets", content: "The solar system consists of eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune." },
    { type: "Flashcard", category: "Astronomy", title: "Order of planets from sun", content: "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune." }
  ];

  /**
   * Filter and search logic using memoization for performance
   * Searches through title, category, and type fields
   */
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

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  /**
   * Click outside handler to close the search dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Scroll selected item into view when navigating with keyboard
   */
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

  /**
   * Highlights matching text in search results
   * @param {string} text - The text to highlight
   * @param {string} query - The search query
   * @returns {JSX.Element} - Text with highlighted matches
   */
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={index} className="bg-yellow-100 text-yellow-900 font-medium">{part}</span>
        : part
    );
  };

  /**
   * Handles selection of a search result
   * @param {Object} result - The selected search result
   */
  const handleResultClick = (result) => {
    onSelect(result);
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  /**
   * Handles keyboard navigation in search results
   * @param {KeyboardEvent} e - The keyboard event
   */
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
      {/* Search Input */}
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search topics, extracts, and flashcards..."
          className="w-full px-5 py-4 pr-12 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white shadow-sm group-hover:shadow-md transition-all duration-200 placeholder-gray-400"
          onFocus={() => setIsOpen(true)}
        />
        {/* Clear/Search Icon Button */}
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
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
      
      {/* Search Results Dropdown */}
      {isOpen && (searchResults.length > 0 || (searchQuery && searchResults.length === 0)) && (
        <div 
          ref={resultsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            zIndex: 9999,
          }}
          className="mt-2 bg-white border border-indigo-100 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto transition-all duration-200 animate-slideDown"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 cursor-pointer border-b last:border-b-0 border-indigo-50 transition-all duration-200 relative ${
                  index === selectedIndex 
                    ? 'bg-indigo-50' 
                    : 'hover:bg-indigo-50'
                }`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {/* Type Tag - Positioned Absolutely */}
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-medium ${
                  result.type === 'Topic' 
                    ? 'bg-violet-100 text-violet-800' 
                    : 'bg-emerald-100 text-emerald-800'
                } transition-colors duration-200`}>
                  {result.type}
                </span>

                {/* Category Tag */}
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium mb-2">
                  {result.category}
                </span>

                {/* Title with Highlighted Matches */}
                <span className="block text-gray-900 font-medium pr-20">
                  {highlightMatch(result.title, searchQuery)}
                </span>

                {/* Content Preview */}
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  {result.content}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 animate-fadeIn">
              <i className="fas fa-search mb-2 text-2xl text-gray-400"></i>
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-1 text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
