import { useState } from "react";
import "./index.css";

function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults] = useState([
    { type: "Topic", category: "Physics", title: "What is hubble telescope" },
    { type: "Flashcard", category: "Telescope", title: "Who invented Hubble Telescope" }
  ]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search topics, extracts, and flashcards..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors">
          <i className="fas fa-search"></i>
        </button>
      </div>
      {isOpen && searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 border-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                  {result.type}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                  {result.category}
                </span>
              </div>
              <span className="block mt-1 font-medium text-gray-800">{result.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
