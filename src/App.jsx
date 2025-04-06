/**
 * Main App component for the Serendipity application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import "./supermemo-tree.css"; // Import the SuperMemo styling
import { useState } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";
import Header from "./header";
import { initialData } from "./shared";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback, useEffect } from "react";
import { changeNodeAtPath, addNodeUnderParent } from "@nosferatu500/react-sortable-tree";

function App() {
  // Initial tree data structure with sample content
  const [treeData, setTreeData] = useLocalStorage("treeData", initialData);
  // State to track the currently selected content item
  const [selectedContent, setSelectedContent] = useState(null);
  // State for toast notification
  const [toast, setToast] = useState(null);

  // Effect to automatically hide toast after a delay
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
   * Extract selected text to create a new topic node
   * @param {string} selectedText - The selected text to extract
   * @param {Object} parentContent - The parent node content
   */
  const handleExtractSelection = useCallback(
    (selectedText, parentContent) => {
      console.log("handleExtractSelection called with text:", selectedText ? selectedText.substring(0, 30) + "..." : "none");
      
      if (!selectedText || !selectedText.trim()) {
        console.log("Error: No text selected");
        setToast({
          message: "Please select some text to extract first",
          type: "error"
        });
        return;
      }
      
      if (!parentContent || !parentContent.path) {
        console.log("Error: Missing parent content");
        setToast({
          message: "Unable to determine parent node",
          type: "error"
        });
        return;
      }
      
      // Get a title from the first line or first few words
      const firstLine = selectedText.split('\n')[0].trim();
      const title = firstLine.length > 30 ? firstLine.substring(0, 30) + "..." : firstLine;
      
      // Create a new topic node with the selected text as content
      const newNode = {
        title: title,
        type: "topic",
        category: parentContent.title || "",
        content: selectedText,
        children: [],
      };
      
      console.log("New node:", newNode);

      // Get the parent path from the parent content
      // Handle both array and string path formats
      let targetPath;
      if (Array.isArray(parentContent.path)) {
        targetPath = parentContent.path;
      } else if (typeof parentContent.path === 'string') {
        targetPath = parentContent.path.split("-").map(Number);
      } else {
        console.log("Invalid path format");
        setToast({
          message: "Unable to extract: invalid path format",
          type: "error"
        });
        return;
      }
      
      // Use the direct setTreeData approach with a function to ensure we're working with the latest treeData
      setTreeData((prevTreeData) => {
        // Add the new node under the parent
        const result = addNodeUnderParent({
          treeData: prevTreeData,
          parentKey: targetPath[targetPath.length - 1],
          expandParent: true,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode,
        });
        
        // Show toast notification
        setTimeout(() => {
          setToast({
            message: `Extracted "${title}" as a new topic`,
            type: "success"
          });
        }, 100);
        
        console.log("Tree data updated successfully");
        return result.treeData;
      });
    },
    [setTreeData, setToast]
  );

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
                <ContentContainer
                  initialContent={selectedContent}
                  onContentChange={handleContentChange}
                  onExtractSelection={handleExtractSelection}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-600' : 
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } transition-opacity duration-300 ease-in-out`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
