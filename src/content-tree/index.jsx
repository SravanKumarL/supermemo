/**
 * ContentTree Component
 * 
 * A hierarchical tree view component that displays and manages content in a tree structure.
 * Supports topics and flashcards, with drag-and-drop reordering, search, and inline editing.
 * 
 * Features:
 * - Drag and drop reordering of nodes
 * - Inline editing of node titles
 * - Search functionality with keyboard navigation
 * - Expand/collapse all nodes
 * - Add/delete nodes
 * - Preview content on hover
 * 
 * @param {Function} onNodeSelect - Callback function when a node is selected
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import SortableTree, { 
  toggleExpandedForAll, 
  changeNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
  getNodeAtPath,
} from '@nosferatu500/react-sortable-tree';
import "@nosferatu500/react-sortable-tree/style.css";
import "./index.css";

function ContentTree({ onNodeSelect }) {
  // Initial tree data structure with sample content
  // Each node can be either a topic (with children) or a flashcard (with content)
  const [treeData, setTreeData] = useState([
    {
      title: "Physics",
      type: "topic",
      expanded: true,
      children: [
        {
          title: "Astronomy",
          type: "topic",
          expanded: true,
          children: [
            { 
              title: "Telescopes",
              type: "topic",
              content: "Telescopes are optical instruments that make distant objects appear magnified by using an arrangement of lenses or curved mirrors."
            },
            { 
              title: "Planets",
              type: "topic",
              content: "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune."
            },
            {
              title: "Hubble Telescope",
              type: "flashcard",
              content: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation."
            }
          ]
        },
        {
          title: "Mechanics",
          type: "topic",
          expanded: true,
          children: [
            { 
              title: "Newton's Laws",
              type: "topic",
              content: "The three laws of motion describe the relationship between a body and the forces acting upon it."
            },
            { 
              title: "Gravity",
              type: "topic",
              content: "Gravity is a force of attraction that exists between any two masses, any two bodies, any two particles."
            },
            {
              title: "Newton's First Law",
              type: "flashcard",
              content: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
            }
          ]
        }
      ]
    }
  ]);

  // Search-related state
  const [searchString, setSearchString] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const [matches, setMatches] = useState([]);
  const searchInputRef = useRef(null);

  // Node selection and editing state
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const DOUBLE_CLICK_THRESHOLD = 200; // Shorter threshold for double-click detection

  // Effect to focus root node on mount
  useEffect(() => {
    if (treeData.length > 0 && !selectedNode) {
      const rootNode = treeData[0];
      const rootPath = [0];
      setSelectedNode({ node: rootNode, path: rootPath.join('-') });
      setSelectedPath(rootPath);
      onNodeSelect({
        type: rootNode.type,
        title: rootNode.title,
        content: rootNode.content || '',
        topic: rootNode.title,
        source: "https://example.com/astronomy/order-of-planets-from-sun",
        timestamp: "2025-03-19",
        author: "John Doe",
        isPreview: false,
        shouldFocusContent: true
      });
    }
  }, []); // Only run on mount

  /**
   * Handles changes to the tree structure
   * Ensures all nodes have a children array for consistency
   */
  const handleTreeChange = (treeData) => {
    // Ensure all nodes have a children array
    const ensureChildrenArray = (nodes) => {
      return nodes.map(node => ({
        ...node,
        children: node.children || []
      }));
    };

    // Recursively process the tree
    const processedTreeData = treeData.map(node => ({
      ...node,
      children: ensureChildrenArray(node.children || [])
    }));

    setTreeData(processedTreeData);

    // If the selected node was deleted, select the root node
    if (selectedNode && !getNodeAtPath({
      treeData: processedTreeData,
      path: selectedPath,
      getNodeKey: ({ treeIndex }) => treeIndex
    })) {
      const rootNode = processedTreeData[0];
      const rootPath = [0];
      setSelectedNode({ node: rootNode, path: rootPath.join('-') });
      setSelectedPath(rootPath);
      onNodeSelect({
        type: rootNode.type,
        title: rootNode.title,
        content: rootNode.content || '',
        topic: rootNode.title,
        source: "https://example.com/astronomy/order-of-planets-from-sun",
        timestamp: "2025-03-19",
        author: "John Doe",
        isPreview: false,
        shouldFocusContent: true
      });
    }
  };

  /**
   * Determines if a node can be dropped at a specific location
   * Prevents dropping a node into itself or its children
   */
  const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    if (prevPath && nextPath) {
      const prevPathStr = prevPath.join('-');
      const nextPathStr = nextPath.join('-');
      return !nextPathStr.startsWith(prevPathStr);
    }
    return true;
  };

  /**
   * Handles search input changes
   */
  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  /**
   * Expands all nodes in the tree
   */
  const expandAll = () => {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded: true,
      })
    );
  };

  /**
   * Collapses all nodes in the tree
   */
  const collapseAll = () => {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded: false,
      })
    );
  };

  /**
   * Custom search method for finding nodes
   * Currently searches only in node titles
   */
  const customSearchMethod = ({ node, searchQuery }) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  };

  /**
   * Shows a preview of the selected node's content
   */
  const showPreview = (matchNode) => {
    if (matchNode && matchNode.node.type) {
      onNodeSelect({
        type: matchNode.node.type,
        title: matchNode.node.title,
        content: matchNode.node.content,
        topic: matchNode.path[0]?.title || '',
        source: "https://example.com/astronomy/order-of-planets-from-sun",
        timestamp: "2025-03-19",
        author: "John Doe",
        isPreview: true
      });
    }
  };

  // Effect to show preview when search focus changes
  useEffect(() => {
    if (matches.length > 0 && searchFocusIndex < matches.length) {
      showPreview(matches[searchFocusIndex]);
    }
  }, [searchFocusIndex, matches]);

  // Effect to handle keyboard navigation in search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchString) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          // Select the currently focused search result
          const matchingNodes = matches[searchFocusIndex];
          if (matchingNodes && matchingNodes.node.type) {
            onNodeSelect({
              type: matchingNodes.node.type,
              title: matchingNodes.node.title,
              content: matchingNodes.node.content,
              topic: matchingNodes.path[0]?.title || '',
              source: "https://example.com/astronomy/order-of-planets-from-sun",
              timestamp: "2025-03-19",
              author: "John Doe",
              isPreview: false,
              shouldFocusContent: true
            });
          }
          break;
        case 'Escape':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Move focus to next search result
          if (searchFoundCount > 0) {
            setSearchFocusIndex((prevIndex) =>
              (prevIndex + 1) % searchFoundCount
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Move focus to previous search result
          if (searchFoundCount > 0) {
            setSearchFocusIndex((prevIndex) =>
              (prevIndex - 1 + searchFoundCount) % searchFoundCount
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchString, searchFocusIndex, searchFoundCount, matches, onNodeSelect]);

  /**
   * Adds a new node to the tree
   * @param {Array} path - Path to the parent node
   * @param {string} type - Type of node ('topic' or 'flashcard')
   * @param {boolean} asSibling - Whether to add as sibling instead of child
   */
  const addNewNode = (path, type = 'topic', asSibling = false) => {
    if (!path || !selectedNode) return;

    const newNode = {
      title: type === 'topic' ? 'New Topic' : 'New Flashcard',
      type: type,
      content: type === 'topic' ? '' : 'Enter flashcard content here...',
      children: type === 'topic' ? [] : undefined // Only topics can have children
    };

    // Get the actual path of the selected node
    const targetPath = selectedNode.path.split('-').map(Number);

    if (asSibling && targetPath.length > 0) {
      // Add as sibling by using parent's path
      const parentPath = targetPath.slice(0, -1);
      setTreeData(
        addNodeUnderParent({
          treeData,
          parentKey: parentPath[parentPath.length - 1],
          expandParent: true,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode,
          addAsFirstChild: false
        }).treeData
      );
    } else {
      // Add as child to the selected node
      setTreeData(
        addNodeUnderParent({
          treeData,
          parentKey: targetPath[targetPath.length - 1],
          expandParent: true,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode
        }).treeData
      );
    }
  };

  /**
   * Handles deletion of a node
   * Shows confirmation dialog if node has children
   */
  const handleDelete = (node, path) => {
    // Ensure we have a node to delete
    if (!selectedNode) return;

    // Show warning if node has children
    if (node.children && node.children.length > 0) {
      if (!window.confirm(`Are you sure you want to delete "${node.title}" and all its contents? This will delete ${node.children.length} item(s) under it.`)) {
        return;
      }
    }

    // Delete the node using the provided path
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex
      })
    );

    // After deletion, select the parent node if it exists, otherwise select root
    const parentPath = path.slice(0, -1);
    if (parentPath.length > 0) {
      const parentNode = getNodeAtPath({
        treeData,
        path: parentPath,
        getNodeKey: ({ treeIndex }) => treeIndex
      })?.node;

      if (parentNode) {
        setSelectedNode({ node: parentNode, path: parentPath.join('-') });
        setSelectedPath(parentPath);
        onNodeSelect({
          type: parentNode.type,
          title: parentNode.title,
          content: parentNode.content || '',
          topic: parentPath[0]?.title || '',
          source: "https://example.com/astronomy/order-of-planets-from-sun",
          timestamp: "2025-03-19",
          author: "John Doe",
          isPreview: false,
          shouldFocusContent: true
        });
      }
    } else {
      // If we deleted a root node, select the first available root node
      if (treeData.length > 0) {
        const rootNode = treeData[0];
        const rootPath = [0];
        setSelectedNode({ node: rootNode, path: rootPath.join('-') });
        setSelectedPath(rootPath);
        onNodeSelect({
          type: rootNode.type,
          title: rootNode.title,
          content: rootNode.content || '',
          topic: rootNode.title,
          source: "https://example.com/astronomy/order-of-planets-from-sun",
          timestamp: "2025-03-19",
          author: "John Doe",
          isPreview: false,
          shouldFocusContent: true
        });
      }
    }
  };

  const handleTitleChange = (node, path, newTitle) => {
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: { ...node, title: newTitle }
      })
    );
  };

  const generateNodeProps = useCallback(({ node, path }) => {
    const isSelected = selectedNode && selectedNode.path === path.join('-');
    const isTopic = node.type === 'topic';
    const isFolder = !node.type;
    const isEditing = editingNode && editingNode.path === path.join('-');

    return {
      onClick: (e) => {
        e.preventDefault();
        const nodePath = path.join('-');
        const currentTime = new Date().getTime();
        
        // Check for double click with shorter threshold
        if (isSelected && (currentTime - lastClickTime) < DOUBLE_CLICK_THRESHOLD) {
          // Double click detected
          setEditingNode({ node, path: nodePath });
          e.stopPropagation();
        } else {
          // Single click handling
          if (isSelected) {
            // Toggle expand if already selected
            setTreeData(prevTreeData => 
              changeNodeAtPath({
                treeData: prevTreeData,
                path,
                getNodeKey: ({ treeIndex }) => treeIndex,
                newNode: { ...node, expanded: !node.expanded }
              })
            );
          } else {
            // Select node if not selected
            setSelectedNode({ node, path: nodePath });
            onNodeSelect({
              type: node.type,
              title: node.title,
              content: node.content || '',
              topic: path[0]?.title || '',
              source: "https://example.com/astronomy/order-of-planets-from-sun",
              timestamp: "2025-03-19",
              author: "John Doe",
              isPreview: false,
              shouldFocusContent: true
            });
          }
          setLastClickTime(currentTime);
        }
      },
      className: `cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
      } ${searchString && searchFocusIndex === node.searchIndex ? 'bg-amber-50' : ''}`,
      title: (
        <div className="node-content">
          {node.type === 'topic' ? (
            <span 
              className="node-icon topic flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-700 font-semibold text-sm"
              aria-hidden="true"
            >
              T
            </span>
          ) : (
            <span 
              className="node-icon flashcard flex items-center justify-center w-5 h-5 rounded bg-blue-100 text-blue-700 font-semibold text-sm"
              aria-hidden="true"
            >
              L
            </span>
          )}
          {isEditing ? (
            <input
              className="node-title-input ml-2 px-1 py-0.5 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              type="text"
              defaultValue={node.title}
              autoFocus
              onBlur={(e) => {
                handleTitleChange(node, path, e.target.value);
                setEditingNode(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTitleChange(node, path, e.target.value);
                  setEditingNode(null);
                }
                if (e.key === 'Escape') {
                  setEditingNode(null);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="node-title">{node.title}</span>
          )}
          {node.children && node.children.length > 0 && (
            <span className="ml-2 text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
              {node.children.length}
            </span>
          )}
        </div>
      ),
      showExpandButton: false
    };
  }, [searchString, onNodeSelect, selectedNode, treeData, editingNode, lastClickTime]);

  // Add click handler to close editing when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingNode && !e.target.closest('.node-title-input')) {
        setEditingNode(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingNode]);

  return (
    <div className="content-tree-container h-full flex flex-col">
      <div className="content-tree-header flex-none p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Content Tree</h3>
          <div className="space-x-2">
            <button
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors duration-200"
              onClick={expandAll}
            >
              Expand All
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={collapseAll}
            >
              Collapse All
            </button>
          </div>
        </div>
        <div className="content-tree-search relative mb-4">
          <input
            ref={searchInputRef}
            className="w-full px-3 py-2 pr-16 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
            placeholder="Search the tree"
            value={searchString}
            onChange={handleSearchChange}
          />
          {searchFoundCount > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-2">
              {searchFocusIndex + 1} of {searchFoundCount}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-start gap-2 py-2">
          <button
            className={`action-button group relative ${!selectedNode ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => selectedPath && addNewNode(selectedPath, 'topic')}
            disabled={!selectedNode}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-700 font-semibold text-sm">
              T
            </span>
            <span className="tooltip">Add Subtopic</span>
          </button>
          <button
            className={`action-button group relative ${!selectedNode ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => selectedPath && addNewNode(selectedPath, 'flashcard')}
            disabled={!selectedNode}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-100 text-blue-700 font-semibold text-sm">
              L
            </span>
            <span className="tooltip">Add Flashcard</span>
          </button>
          <button
            className={`action-button group relative ${!selectedNode ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-red-50`}
            onClick={() => selectedNode && handleDelete(selectedNode.node, selectedPath)}
            disabled={!selectedNode}
          >
            <i className="fas fa-trash text-red-500 text-lg" />
            <span className="tooltip">Delete</span>
          </button>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
        <SortableTree
          treeData={treeData}
          onChange={handleTreeChange}
          searchQuery={searchString}
          searchMethod={customSearchMethod}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
            setMatches(matches);
          }}
          canDrag={true}
          canDrop={canDrop}
          generateNodeProps={generateNodeProps}
          getNodeKey={({ node, treeIndex }) => treeIndex}
          rowHeight={44}
          scaffoldBlockPxWidth={44}
          slideRegionSize={100}
        />
      </div>
    </div>
  );
}

export default ContentTree;
