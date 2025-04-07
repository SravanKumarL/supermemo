/**
 * Main App component for the Serendipity application.
 * This component serves as the root layout and manages the main application state.
 * It coordinates between the content tree, search functionality, and content display.
 */

import "./supermemo-tree.css"; // Import the SuperMemo styling
import { useState, useMemo, useCallback, useEffect } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";
import Header from "./header";
import { getRandomIntExcept, initialData, normalizeTreeData } from "./shared";
import { useLocalStorage } from "@uidotdev/usehooks";
import { changeNodeAtPath } from "@nosferatu500/react-sortable-tree";
import deepEquals from "fast-deep-equal";
import AITopics from "./ai-topics";

function App() {
  // Initial tree data structure with sample content
  const [treeData, setTreeData] = useLocalStorage("treeData", initialData);
  // State to track the currently selected content item
  const [selectedContent, setSelectedContent] = useState(null);
  // By default, the root node is selected
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  // State to control AI Topics modal visibility
  const [showAITopics, setShowAITopics] = useState(false);
  
  // Function to ensure all AI nodes have proper authorship
  const migrateAINodes = useCallback((nodes) => {
    if (!nodes || !Array.isArray(nodes)) return nodes;
    
    // Process each node recursively
    const processNode = (node, parentIsAI = false) => {
      if (!node) return node;
      
      // Check if this is an AI node
      const isAINode = parentIsAI || node.author === "AI Assistant";
      
      // Update the node
      const updatedNode = {
        ...node,
        author: isAINode ? "AI Assistant" : node.author,
      };
      
      // Process children recursively
      if (updatedNode.children && Array.isArray(updatedNode.children)) {
        updatedNode.children = updatedNode.children.map(child => 
          processNode(child, isAINode)
        );
      }
      
      return updatedNode;
    };
    
    // Process all top-level nodes
    return nodes.map(node => processNode(node, false));
  }, []);
  
  // Run migration on component mount
  useEffect(() => {
    setTreeData(currentData => {
      // Only run migration if we have data
      if (!currentData || !Array.isArray(currentData) || currentData.length === 0) {
        return currentData;
      }
      
      console.log("Running AI node migration on existing data");
      return migrateAINodes(currentData);
    });
  }, [migrateAINodes, setTreeData]);
  
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

  // Handle adding AI-generated topics to the tree
  const handleAddAITopics = useCallback((topicNodes, collapseExisting = false) => {
    console.log("Received topic nodes to add:", topicNodes);
    console.log("Topics data type:", typeof topicNodes);
    console.log("Is topics array?", Array.isArray(topicNodes));
    console.log("Should collapse existing nodes:", collapseExisting);
    
    // Validate the input
    if (!topicNodes) {
      console.warn("No topic nodes received (undefined or null)");
      return;
    }
    
    if (!Array.isArray(topicNodes)) {
      console.error("Expected array of topic nodes but received:", typeof topicNodes);
      return;
    }
    
    if (topicNodes.length === 0) {
      console.warn("Empty array of topic nodes received");
      return;
    }
    
    console.log("Valid topics being added:", topicNodes.map(node => node.title));
    console.log("First topic structure:", JSON.stringify(topicNodes[0], null, 2).substring(0, 500) + "...");
    
    // Add to tree data
    setTreeData(currentTreeData => {
      try {
        // Create a deep copy of the current tree data
        let newTreeData = JSON.parse(JSON.stringify(currentTreeData));
        
        // If collapseExisting is true, collapse all existing nodes
        if (collapseExisting) {
          // Function to recursively collapse nodes
          const collapseNodes = (nodes) => {
            return nodes.map(node => ({
              ...node,
              expanded: false, // Collapse this node
              children: node.children ? collapseNodes(node.children) : [], // Process children recursively
            }));
          };
          
          // Apply collapse to all existing nodes
          console.log("Collapsing all existing nodes before adding new AI nodes");
          newTreeData = collapseNodes(newTreeData);
        }
        
        // Function to recursively ensure all nodes have proper IDs and author property
        const processNode = (node, isAI = false) => {
          // Skip if no node
          if (!node) return node;
          
          // Check if this is an AI node based on parent or own attribute
          const isAINode = isAI || node.author === "AI Assistant";
          
          // Create a processed node with ID and always set author if it's an AI node
          const processedNode = {
            ...node,
            id: node.id || `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            expanded: node.expanded !== undefined ? node.expanded : true,
            author: isAINode ? "AI Assistant" : node.author, // Always set author if AI
          };
          
          // Process children recursively if they exist
          if (processedNode.children && Array.isArray(processedNode.children)) {
            processedNode.children = processedNode.children.map(child => 
              processNode(child, isAINode) // Pass down AI status to all children
            );
          }
          
          return processedNode;
        };
        
        // Add each topic node to the root level
        topicNodes.forEach(node => {
          // Process the node and its entire subtree
          const processedNode = processNode(node, node.author === "AI Assistant");
          newTreeData.push(processedNode);
          console.log("Successfully added node to tree:", processedNode.title);
        });
        
        console.log("Tree data updated successfully. New length:", newTreeData.length);
        console.log("First item in tree after update:", newTreeData[newTreeData.length - 1]);
        
        return newTreeData;
      } catch (error) {
        console.error("Error updating tree data:", error);
        return currentTreeData; // Return unchanged data on error
      }
    });
  }, [setTreeData]);

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
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Search allItems={allItems} onSelect={handleNodeSelect} />
              </div>
              
              {/* AI Topics Button */}
              <button
                onClick={() => setShowAITopics(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2"></circle>
                  <circle cx="5" cy="19" r="2"></circle>
                  <circle cx="19" cy="19" r="2"></circle>
                  <line x1="12" y1="7" x2="5" y2="17"></line>
                  <line x1="12" y1="7" x2="19" y2="17"></line>
                  <line x1="5" y1="17" x2="19" y2="17"></line>
                </svg>
                Generate Learning Map
              </button>
            </div>

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

      {/* AI Topics Modal */}
      {showAITopics && (
        <AITopics 
          onClose={() => setShowAITopics(false)}
          onAddTopics={handleAddAITopics}
        />
      )}
    </div>
  );
}

export default App;
