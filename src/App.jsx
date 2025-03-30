/**
 * Main App component for the Serendipity application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import { useState } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";
import "./supermemo-tree.css"; // Import the SuperMemo styling
import Header from "./header";
import { initialData } from "./shared";

function App() {
  // Initial tree data structure with sample content
  const [treeData, setTreeData] = useState(initialData);
  // State to track the currently selected content item
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
      <Header />

      {/* Main Application Content */}
      <div className="px-8 py-4">
        <div className="flex gap-4">
          {/* Left Sidebar - Content Tree Navigation */}
          <div className="w-1/4">
            <ContentTree
              treeData={treeData}
              onTreeDataChanged={setTreeData}
              onNodeSelect={handleNodeSelect}
            />
          </div>

          {/* Main Content Area */}
          <div className="w-3/4 space-y-4">
            {/* Search Bar */}
            <Search treeData={treeData} onSelect={handleSearchSelect} />

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
