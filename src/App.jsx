/**
 * Main App component for the SuperMemo Web application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import { useState } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";

function App() {
  // State to track the currently selected content item
  // This can be either from the tree view or search results
  const [selectedContent, setSelectedContent] = useState(null);

  /**
   * Handler for when a search result is selected
   * @param {Object} result - The selected search result data
   */
  const handleSearchSelect = (result) => {
    setSelectedContent(result);
  };

  /**
   * Handler for when a node in the content tree is selected
   * @param {Object} nodeData - The selected node's data
   */
  const handleNodeSelect = (nodeData) => {
    setSelectedContent(nodeData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-indigo-100 py-4 px-8 mb-4">
        <div className="max-w-7xl mx-auto relative">
          {/* Application Title and Logo */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              {/* Animated Logo Container */}
              <div className="text-5xl transform hover:scale-110 transition-all duration-500 relative group w-14 h-14 flex items-center justify-center">
                {/* Layered Icon Effects */}
                <div className="relative flex items-center justify-center w-full h-full">
                  {/* Base sun icon with gradient */}
                  <i className="fas fa-sun absolute bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent"></i>
                  {/* Sparkle effect layer */}
                  <i className="fas fa-sparkles absolute scale-125 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"></i>
                  {/* Burst effect layer */}
                  <i className="fas fa-burst absolute scale-150 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent opacity-90"></i>
                </div>
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </div>
              {/* Application Title and Tagline */}
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 font-display">
                  Serendipity
                </h1>
                <div className="mt-1">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 font-medium">
                    Watch your ideas go supernova
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Application Content */}
      <div className="px-8 py-4">
        <div className="flex gap-4">
          {/* Left Sidebar - Content Tree Navigation */}
          <div className="w-1/4 bg-white rounded-lg shadow-sm">
            <ContentTree onNodeSelect={handleNodeSelect} />
          </div>

          {/* Main Content Area */}
          <div className="w-3/4 space-y-4">
            {/* Search Bar */}
            <div>
              <Search onSelect={handleSearchSelect} />
            </div>

            {/* Content Display Area */}
            {selectedContent && (
              <div className="w-full bg-white rounded-lg shadow-sm">
                <ContentContainer content={selectedContent} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Button - Fixed Position */}
      <div className="fixed top-4 right-4">
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default App; 