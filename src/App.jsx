/**
 * Main App component for the Serendipity application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import "./supermemo-tree.css"; // Import the SuperMemo styling
import { useState, useMemo, useCallback } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";
import Header from "./header";
import { getRandomIntExcept, initialData, normalizeTreeData } from "./shared";
import { useLocalStorage } from "@uidotdev/usehooks";
import { changeNodeAtPath } from "@nosferatu500/react-sortable-tree";
import deepEquals from "fast-deep-equal";

function App() {
  // Initial tree data structure with sample content
  const [treeData, setTreeData] = useLocalStorage("treeData", initialData);
  // State to track the currently selected content item
  const [selectedContent, setSelectedContent] = useState(null);
  // By default, the root node is selected
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  /**
   * Simulated database of searchable items
   * TODO: Replace with actual data source
   * Each item has:
   * - type: "Topic" or "Flashcard"
   * - category: Subject area
   * - title: Searchable title
   * - content: Preview text
   */

  const allItems = useMemo(() => normalizeTreeData(treeData), [treeData]);

  /**
   * Handler for when a node in the content tree or search result is selected
   * @param {Object} nodeData - The selected node's data
   */
  const handleNodeSelect = useCallback((nodeData) => {
    setSelectedContent({ ...nodeData, isPreview: true, shouldFocusContent: true });
  }, []);

  const handleContentChange = useCallback(
    (content) => {
      if (!deepEquals(selectedContent, content)) {
        // Update the selected content in memory
        setSelectedContent({ ...content });
        
        // Update the tree data
        setTreeData((treeData) =>
          changeNodeAtPath({
            treeData,
            path: content.path,
            getNodeKey: ({ treeIndex }) => treeIndex,
            newNode: { ...content },
          })
        );
      }
    },
    [selectedContent, setTreeData, setSelectedContent]
  );

  const handleDiscoverClick = useCallback(() => {
    const newSelectedNodeIdx = getRandomIntExcept(
      0,
      allItems.length - 1,
      selectedNodeIndex
    );
    handleNodeSelect(allItems[newSelectedNodeIdx]);
    setSelectedNodeIndex(newSelectedNodeIdx);
  }, [allItems, handleNodeSelect, selectedNodeIndex]);

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
              selectedContent={selectedContent}
              onNodeSelect={handleNodeSelect}
            />
          </div>

          {/* Main Content Area */}
          <div className="w-3/4 space-y-4">
            {/* Search Bar */}
            <Search allItems={allItems} onSelect={handleNodeSelect} />

            {/* Content Display Area */}
            {selectedContent ? (
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
            ) : (
              <div className="w-full h-64 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500">Select a topic from the tree or search to get started</p>
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
