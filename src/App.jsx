/**
 * Main App component for the Serendipity application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import "./supermemo-tree.css"; // Import the SuperMemo styling
import { useState, useCallback, useEffect } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";
import Header from "./header";
import { initialData, normalizeTreeData } from "./shared";
import { useLocalStorage } from "@uidotdev/usehooks";
import { changeNodeAtPath } from "@nosferatu500/react-sortable-tree";

function App() {
  // Initial tree data structure with sample content
  const [treeData, setTreeData] = useLocalStorage("treeData", initialData);
  // State to track the currently selected content item
  const [selectedContent, setSelectedContent] = useState(null);

  // Handle tree data changes - ensure persistence
  const handleTreeDataChange = useCallback((newTreeData) => {
    // Make sure we're saving a new reference to localStorage
    setTreeData([...newTreeData]);
  }, [setTreeData]);

  /**
   * Handler for when a search result is selected
   * @param {Object} result - The selected search result data
   */
  const handleSearchSelect = useCallback((result) => {
    setSelectedContent(result);
  }, []);

  /**
   * Handler for when a node in the content tree is selected
   * @param {Object} nodeData - The selected node's data
   */
  const handleNodeSelect = useCallback((nodeData) => {
    setSelectedContent(nodeData);
  }, []);

  const handleContentChange = useCallback(
    (content) => {
      setTreeData((treeData) =>
        changeNodeAtPath({
          treeData,
          path: content.path,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode: { ...content },
        })
      );
    },
    [setTreeData]
  );

  /**
   * Handles the Discover button click to show random content
   */
  const handleDiscoverClick = useCallback(() => {
    // Normalize tree data to get a flat array of all nodes
    const allItems = normalizeTreeData(treeData);
    
    // Filter out only topics and flashcards that have content
    const contentItems = allItems.filter(
      item => (item.type === "topic" || item.type === "flashcard") && item.content
    );
    
    if (contentItems.length > 0) {
      // Select a random item
      const randomIndex = Math.floor(Math.random() * contentItems.length);
      const randomItem = contentItems[randomIndex];
      
      // Set the selected content
      setSelectedContent(randomItem);
    }
  }, [treeData]);

  // Set up event listener for flashcard navigation after grading
  useEffect(() => {
    const handleDiscoverNext = () => {
      // Call the handleDiscoverClick function to navigate to a random item
      handleDiscoverClick();
    };

    // Add event listener for custom 'discovernext' event
    document.addEventListener('discovernext', handleDiscoverNext);
    
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('discovernext', handleDiscoverNext);
    };
  }, [handleDiscoverClick]);

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
              onTreeDataChanged={handleTreeDataChange}
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
                <ContentContainer
                  initialContent={selectedContent}
                  onContentChange={handleContentChange}
                />
                
                {/* Discover Button */}
                <div className="flex justify-center mt-4 pb-4">
                  <button
                    onClick={handleDiscoverClick}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <i className="fas fa-compass"></i>
                    Discover
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Button - Fixed Position */}
      {/* <div className="fixed top-4 right-4">
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div> */}
    </div>
  );
}

export default App;
