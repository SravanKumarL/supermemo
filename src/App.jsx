import { useState } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";

function App() {
  const [selectedContent, setSelectedContent] = useState(null);

  const handleSearchSelect = (result) => {
    setSelectedContent(result);
  };

  const handleNodeSelect = (nodeData) => {
    setSelectedContent(nodeData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-indigo-100 py-4 px-8 mb-4">
        <div className="max-w-7xl mx-auto relative">
          {/* Centered title and icon */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="text-5xl transform hover:scale-110 transition-all duration-500 relative group w-14 h-14 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-full h-full">
                  <i className="fas fa-sun absolute bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent"></i>
                  <i className="fas fa-sparkles absolute scale-125 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"></i>
                  <i className="fas fa-burst absolute scale-150 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent opacity-90"></i>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </div>
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

      <div className="px-8 py-4">
        {/* Main content area */}
        <div className="flex gap-4">
          {/* Left side - Content Tree */}
          <div className="w-1/4 bg-white rounded-lg shadow-sm">
            <ContentTree onNodeSelect={handleNodeSelect} />
          </div>

          {/* Right side - Search and Content Container */}
          <div className="w-3/4 space-y-4">
            {/* Search bar spanning content width */}
            <div>
              <Search onSelect={handleSearchSelect} />
            </div>

            {/* Content Container */}
            {selectedContent && (
              <div className="w-full bg-white rounded-lg shadow-sm">
                <ContentContainer content={selectedContent} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings button */}
      <div className="fixed top-4 right-4">
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default App; 