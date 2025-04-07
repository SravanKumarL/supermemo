/**
 * ContentTree Component
 * 
 * A hierarchical tree view for organizing and managing educational content.
 * Supports searching, node selection, editing, and drag-and-drop functionality.
 * Mimics SuperMemo-style interface for learning content organization.
 */

import "../supermemo-tree.css"; // Adjust path as needed
import React, { useState, useCallback, useEffect } from "react";
import SortableTree, {
  changeNodeAtPath,
  getNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import TreeHeader from "./header";
import SearchInput from "./header/search";
import { rootNodeSelectionPayload } from "../shared";

/**
 * ContentTree component for hierarchical display of learning content
 * 
 * @param {Array} treeData - The hierarchical data to display in the tree
 * @param {Function} onTreeDataChanged - Callback when tree data is modified
 * @param {Function} onNodeSelect - Callback when a node is selected
 * @returns {JSX.Element} The rendered content tree component
 */
function ContentTree({ treeData, onTreeDataChanged, onNodeSelect }) {
  // Search-related state
  const [searchString, setSearchString] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const [matches, setMatches] = useState([]);

  // Node selection and editing state
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const DOUBLE_CLICK_THRESHOLD = 200;

  // Animation effect for node selection
  const [animatingNode, setAnimatingNode] = useState(null);

  /**
   * Clears the current search and resets search-related state
   */
  const clearSearch = () => {
    setSearchString("");
    setSearchFocusIndex(0);
    setSearchFoundCount(null);
    setMatches([]);
  };

  /**
   * Handles changes in node selection and updates related state
   * @param {Object} node - The selected node
   * @param {Array} path - The path to the selected node
   */
  const onNodeSelectionChanged = useCallback(
    (node, path) => {
      let changed = false;
      if (selectedNode?.node !== node && selectedNode?.path !== path.join("-")) {
        setSelectedNode({ node: node, path: path.join("-") });
        changed = true;
      }
      if (selectedPath !== path) {
        setSelectedPath(path);
        changed = true;
      }
      if (changed) {
        onNodeSelect({
          ...node,
          path,
          content: node.content || "",
          topic: path.length > 0 ? path[0]?.title || "" : "",
          isPreview: true,
          shouldFocusContent: true,
        });
      }
    },
    [onNodeSelect, selectedNode, selectedPath]
  );

  // Effect to focus on node when tree selection changes
  useEffect(() => {
    if (!selectedNode && !selectedPath) {
      return onNodeSelectionChanged(...rootNodeSelectionPayload(treeData));
    }
    onNodeSelectionChanged(selectedNode.node, selectedPath);
  }, [onNodeSelectionChanged, selectedNode, selectedPath, treeData]);

  /**
   * Handles changes to the tree data structure
   * Ensures all nodes have children arrays and handles selection updates
   * @param {Array} treeData - Updated tree data array
   */
  const handleTreeChange = useCallback(
    (treeData) => {
      const ensureChildrenArray = (nodes) => {
        return nodes.map((node) => ({
          ...node,
          children: node.children || [],
        }));
      };

      const processedTreeData = treeData.map((node) => ({
        ...node,
        children: ensureChildrenArray(node.children || []),
      }));

      onTreeDataChanged(processedTreeData);
      /* 
        If tree changed due to deletion of the currently selected node,
        we reset the selection to root node
      */
      if (
        selectedNode &&
        !getNodeAtPath({
          treeData: processedTreeData,
          path: selectedPath,
          getNodeKey: ({ treeIndex }) => treeIndex,
        })
      ) {
        onNodeSelectionChanged(...rootNodeSelectionPayload(processedTreeData));
      }
    },
    [onNodeSelectionChanged, onTreeDataChanged, selectedNode, selectedPath]
  );

  /**
   * Determines if a node can be dropped at a particular location
   * Prevents circular references in the tree structure
   * @param {Object} params - Drop parameters
   * @returns {boolean} Whether the drop operation is allowed
   */
  const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    if (prevPath && nextPath) {
      const prevPathStr = prevPath.join("-");
      const nextPathStr = nextPath.join("-");
      return !nextPathStr.startsWith(prevPathStr);
    }
    return true;
  };

  /**
   * Custom search method for finding nodes in the tree
   * @param {Object} params - Search parameters
   * @returns {boolean} Whether the node matches the search query
   */
  const customSearchMethod = ({ node, searchQuery }) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  };

  /**
   * Shows a preview of a matched node from search
   * @param {Object} matchNode - The matched node to preview
   */
  const showPreview = useCallback(
    (matchNode) => {
      if (matchNode && matchNode.node.type) {
        onNodeSelect({
          ...matchNode.node,
          isPreview: true,
        });
      }
    },
    [onNodeSelect]
  );

  // Effect to show preview of focused search result
  useEffect(() => {
    if (matches.length > 0 && searchFocusIndex < matches.length) {
      showPreview(matches[searchFocusIndex]);
    }
  }, [searchFocusIndex, matches, showPreview]);

  // Effect to handle keyboard navigation in search results
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchString) return;

      switch (e.key) {
        case "Enter": {
          e.preventDefault();
          const matchingNodes = matches[searchFocusIndex];
          if (matchingNodes && matchingNodes.node.type) {
            onNodeSelectionChanged(matchingNodes.node, matchingNodes.path);
            // Set animation target
            setAnimatingNode(matchingNodes.node.path);
            setTimeout(() => setAnimatingNode(null), 500);

            // Clear search after selection
            clearSearch();
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          // Clear search when Escape is pressed
          clearSearch();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (searchFoundCount > 0) {
            setSearchFocusIndex(
              (prevIndex) => (prevIndex + 1) % searchFoundCount
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (searchFoundCount > 0) {
            setSearchFocusIndex(
              (prevIndex) =>
                (prevIndex - 1 + searchFoundCount) % searchFoundCount
            );
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    searchString,
    searchFocusIndex,
    searchFoundCount,
    matches,
    onNodeSelect,
    onNodeSelectionChanged,
  ]);

  /**
   * Handles the change of a node's title in the tree
   * @param {Object} node - The node being edited
   * @param {Array} path - Path to the node in the tree
   * @param {string} newTitle - New title for the node
   */
  const handleTitleChange = useCallback(
    (node, path, newTitle) => {
      onTreeDataChanged(
        changeNodeAtPath({
          treeData,
          path,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode: { ...node, title: newTitle },
        })
      );
    },
    [onTreeDataChanged, treeData]
  );

  // Add this function to check if a node should still be highlighted
  const shouldHighlight = useCallback((node) => {
    if (!node.isNew || !node.highlightUntil) return false;
    
    const now = Date.now();
    const timeLeft = node.highlightUntil - now;
    
    // If time has expired, don't highlight
    if (timeLeft <= 0) return false;
    
    // Return true if we still have time left
    return true;
  }, []);
  
  // Add this function to get highlight intensity
  const getHighlightOpacity = useCallback((node) => {
    if (!node.isNew || !node.highlightUntil) return 0;
    
    const now = Date.now();
    const timeLeft = node.highlightUntil - now;
    
    // If time has expired, don't highlight
    if (timeLeft <= 0) return 0;
    
    // Calculate duration (assuming 20 seconds from the timestamp we set)
    const totalDuration = 20 * 1000;
    const elapsed = totalDuration - timeLeft;
    
    // Fade out over the last 5 seconds (1/4 of the duration)
    if (timeLeft < 5000) {
      return timeLeft / 5000;
    }
    
    return 1; // Full opacity otherwise
  }, []);

  // Periodically check if highlights should be removed
  useEffect(() => {
    // If there are no highlights, don't set up the interval
    const hasHighlights = treeData.some(node => 
      shouldHighlight(node) || 
      (node.children?.some(child => 
        shouldHighlight(child) || 
        child.children?.some(grandchild => shouldHighlight(grandchild))
      ))
    );
    
    if (!hasHighlights) return;
    
    // Set up interval to refresh UI and remove expired highlights
    const interval = setInterval(() => {
      onTreeDataChanged(prevTreeData => {
        // No changes needed, just trigger a re-render
        return [...prevTreeData];
      });
    }, 1000); // Check every second for smoother fade out
    
    return () => clearInterval(interval);
  }, [treeData, shouldHighlight, onTreeDataChanged]);

  /**
   * Generates node props for the SortableTree component
   * @param {Object} rowInfo - Information about the current tree row
   * @returns {Object} Props for the node
   */
  const generateNodeProps = useCallback(
    (rowInfo) => {
      const { node, path } = rowInfo;
      const nodePath = path.join("-");

      // Check if this node is currently selected
      const isSelected =
        selectedNode?.path === nodePath ||
        (selectedNode?.node?.id && selectedNode.node.id === node.id);

      // Check if node is being edited
      const isEditing =
        editingNode?.path === nodePath ||
        (editingNode?.node?.id && editingNode.node.id === node.id);

      // Check if node is being animated after search selection
      const isAnimating = animatingNode === nodePath;

      // Check if the node is newly added and should be highlighted
      const isNewlyAdded = shouldHighlight(node);
      const highlightOpacity = isNewlyAdded ? getHighlightOpacity(node) : 0;
      
      // Create inline styles for the highlight with dynamic opacity
      const highlightStyle = isNewlyAdded ? {
        backgroundColor: `rgba(218, 255, 224, ${highlightOpacity * 0.35})`,
        '--indicator-opacity': highlightOpacity.toString(), // Custom property for the pseudo-element
      } : {};

      return {
        onClick: (e) => {
          const currentTime = new Date().getTime();
          const isDoubleClick =
            currentTime - lastClickTime < DOUBLE_CLICK_THRESHOLD;

          if (isDoubleClick) {
            // If double-clicked, go into edit mode
            if (
              node.title &&
              !node.title.startsWith("New") &&
              !searchString &&
              !isEditing
            ) {
              setEditingNode({ node, path: nodePath });
              e.stopPropagation();
            }
          } else {
            if (isSelected) {
              onTreeDataChanged((prevTreeData) =>
                changeNodeAtPath({
                  treeData: prevTreeData,
                  path,
                  getNodeKey: ({ treeIndex }) => treeIndex,
                  newNode: { ...node, expanded: !node.expanded },
                })
              );
            } else {
              onNodeSelectionChanged(node, path);
              // Clear search when selecting a node directly
              if (searchString) {
                clearSearch();
              }
            }
            setLastClickTime(currentTime);
          }
        },
        className: `supermemo-node ${
          isSelected ? "supermemo-node-selected" : ""
        } 
                 ${
                   searchString && node.searchIndex === searchFocusIndex
                     ? "supermemo-node-search-focus"
                     : ""
                 } 
                 ${
                   node.searchIndex !== undefined
                     ? "supermemo-node-search-match"
                     : ""
                 }
                 ${isAnimating ? "animate-pulse" : ""}
                 ${isNewlyAdded ? "supermemo-node-new" : ""}`,
        style: highlightStyle,
        title: (
          <div className="supermemo-node-content">
            {isEditing ? (
              <input
                className="supermemo-node-input"
                type="text"
                defaultValue={node.title}
                autoFocus
                onBlur={(e) => {
                  handleTitleChange(node, path, e.target.value);
                  setEditingNode(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleChange(node, path, e.target.value);
                    setEditingNode(null);
                  }
                  if (e.key === "Escape") {
                    setEditingNode(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="supermemo-node-title-container">
                <div
                  className={`supermemo-node-icon ${
                    node.type === "flashcard"
                      ? node.author === "AI Assistant" 
                        ? "supermemo-ai-flashcard-icon" 
                        : "supermemo-flashcard-icon"
                      : node.type === "sub-topic"
                        ? node.author === "AI Assistant"
                          ? "supermemo-ai-subtopic-icon"
                          : "supermemo-topic-icon"
                        : node.author === "AI Assistant" 
                          ? "supermemo-ai-topic-icon" 
                          : "supermemo-topic-icon"
                  }`}
                >
                  {node.type === "flashcard" ? (
                    node.author === "AI Assistant" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                        <path d="M6 14h4"></path>
                        <path d="M14 14h4"></path>
                        <path d="M6 18h4"></path>
                        <path d="M14 18h4"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                      </svg>
                    )
                  ) : node.type === "sub-topic" ? (
                    node.author === "AI Assistant" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16"></path>
                        <path d="M4 12h16"></path>
                        <path d="M4 18h10"></path>
                        <circle cx="18" cy="18" r="2"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    )
                  ) : node.author === "AI Assistant" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="3" y1="3" x2="21" y2="21"></line>
                      <line x1="3" y1="21" x2="21" y2="3"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  )}
                </div>
                <span className="supermemo-node-title">{node.title}</span>
                {node.children && node.children.length > 0 && (
                  <span className="supermemo-node-count">
                    {node.children.length}
                  </span>
                )}
              </div>
            )}
          </div>
        ),
      };
    },
    [
      selectedNode,
      editingNode,
      animatingNode,
      searchString,
      searchFocusIndex,
      lastClickTime,
      onTreeDataChanged,
      onNodeSelectionChanged,
      handleTitleChange,
      shouldHighlight,
      getHighlightOpacity,
    ]
  );

  // Effect to handle clicking outside an editing node
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingNode && !e.target.closest(".supermemo-node-input")) {
        setEditingNode(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editingNode]);

  return (
    <div className="supermemo-tree-container">
      <TreeHeader
        onNodeSelectionChanged={onNodeSelectionChanged}
        treeData={treeData}
        onTreeDataChanged={onTreeDataChanged}
        selectedNode={selectedNode}
        selectedPath={selectedPath}
        searchInput={
          <SearchInput
            searchFocusIndex={searchFocusIndex}
            searchFoundCount={searchFoundCount}
            searchString={searchString}
            setSearchString={setSearchString}
          />
        }
      />
      <div className="supermemo-tree-content">
        <SortableTree
          treeData={treeData}
          onChange={handleTreeChange}
          searchQuery={searchString}
          searchMethod={customSearchMethod}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0
            );
            setMatches(matches);
          }}
          canDrag={true}
          canDrop={canDrop}
          generateNodeProps={generateNodeProps}
          getNodeKey={({ node, treeIndex }) => treeIndex}
          rowHeight={26} // Lower height for SuperMemo-like density
          scaffoldBlockPxWidth={24} // Narrower scaffold for SuperMemo style
          slideRegionSize={100}
        />
      </div>
    </div>
  );
}

export default ContentTree;
