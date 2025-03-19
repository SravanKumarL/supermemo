/**
 * ContentTree Component
 * 
 * A hierarchical tree view component that displays and manages content in a tree structure.
 * Supports topics and flashcards, with drag-and-drop reordering, search, and inline editing.
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import SortableTree, { 
  toggleExpandedForAll, 
  changeNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
  getNodeAtPath,
} from '@nosferatu500/react-sortable-tree';
import "@nosferatu500/react-sortable-tree/style.css";
import "../supermemo-tree.css"; // Adjust path as needed

function ContentTree({ onNodeSelect }) {
  // Initial tree data structure with sample content
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
  const DOUBLE_CLICK_THRESHOLD = 200;
  
  // Animation effect for node selection
  const [animatingNode, setAnimatingNode] = useState(null);

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
  }, []); 

  const handleTreeChange = (treeData) => {
    const ensureChildrenArray = (nodes) => {
      return nodes.map(node => ({
        ...node,
        children: node.children || []
      }));
    };

    const processedTreeData = treeData.map(node => ({
      ...node,
      children: ensureChildrenArray(node.children || [])
    }));

    setTreeData(processedTreeData);

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

  const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    if (prevPath && nextPath) {
      const prevPathStr = prevPath.join('-');
      const nextPathStr = nextPath.join('-');
      return !nextPathStr.startsWith(prevPathStr);
    }
    return true;
  };

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  const expandAll = () => {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded: true,
      })
    );
  };

  const collapseAll = () => {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded: false,
      })
    );
  };

  const customSearchMethod = ({ node, searchQuery }) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  };

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

  useEffect(() => {
    if (matches.length > 0 && searchFocusIndex < matches.length) {
      showPreview(matches[searchFocusIndex]);
    }
  }, [searchFocusIndex, matches]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchString) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
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
            // Set animation target
            setAnimatingNode(matchingNodes.node.path);
            setTimeout(() => setAnimatingNode(null), 500);
          }
          break;
        case 'Escape':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (searchFoundCount > 0) {
            setSearchFocusIndex((prevIndex) =>
              (prevIndex + 1) % searchFoundCount
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
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

  const addNewNode = (path, type = 'topic', asSibling = false) => {
    if (!path || !selectedNode) return;

    const newNode = {
      title: type === 'topic' ? 'New Topic' : 'New Flashcard',
      type: type,
      content: type === 'topic' ? '' : 'Enter flashcard content here...',
      children: type === 'topic' ? [] : undefined
    };

    const targetPath = selectedNode.path.split('-').map(Number);

    if (asSibling && targetPath.length > 0) {
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

  const handleDelete = (node, path) => {
    if (!selectedNode) return;

    if (node.children && node.children.length > 0) {
      if (!window.confirm(`Are you sure you want to delete "${node.title}" and all its contents? This will delete ${node.children.length} item(s) under it.`)) {
        return;
      }
    }

    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex
      })
    );

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
    const isEditing = editingNode && editingNode.path === path.join('-');
    const isAnimating = animatingNode === path.join('-');

    return {
      onClick: (e) => {
        e.preventDefault();
        const nodePath = path.join('-');
        const currentTime = new Date().getTime();
        
        // Set animation on click
        setAnimatingNode(nodePath);
        setTimeout(() => setAnimatingNode(null), 500);
        
        if (isSelected && (currentTime - lastClickTime) < DOUBLE_CLICK_THRESHOLD) {
          setEditingNode({ node, path: nodePath });
          e.stopPropagation();
        } else {
          if (isSelected) {
            setTreeData(prevTreeData => 
              changeNodeAtPath({
                treeData: prevTreeData,
                path,
                getNodeKey: ({ treeIndex }) => treeIndex,
                newNode: { ...node, expanded: !node.expanded }
              })
            );
          } else {
            setSelectedNode({ node, path: nodePath });
            setSelectedPath(path);
            onNodeSelect({
              type: node.type,
              title: node.title,
              content: node.content || '',
              topic: path.length > 0 ? treeData[path[0]]?.title || '' : '',
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
      className: `supermemo-node ${isSelected ? 'supermemo-node-selected' : ''} 
                 ${searchString && node.searchIndex === searchFocusIndex ? 'supermemo-node-search-focus' : ''} 
                 ${node.searchIndex !== undefined ? 'supermemo-node-search-match' : ''}
                 ${isAnimating ? 'animate-pulse' : ''}`,
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
            <div className="supermemo-node-title-container">
              <div className={`supermemo-node-icon ${node.type === 'flashcard' ? 'supermemo-flashcard-icon' : 'supermemo-topic-icon'}`}>
                {node.type === 'flashcard' ? 'L' : 'T'}
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
      )
    };
  }, [searchString, onNodeSelect, selectedNode, treeData, editingNode, lastClickTime, animatingNode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingNode && !e.target.closest('.supermemo-node-input')) {
        setEditingNode(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingNode]);

  return (
    <div className="supermemo-tree-container">
      <div className="supermemo-tree-header">
        <div className="flex justify-between items-center mb-4">
          <h3 className="supermemo-tree-title">Content Tree</h3>
          <div className="supermemo-tree-buttons">
            <button
              className="supermemo-tree-button"
              onClick={expandAll}
            >
              Expand All
            </button>
            <button
              className="supermemo-tree-button"
              onClick={collapseAll}
            >
              Collapse All
            </button>
          </div>
        </div>
        <div className="supermemo-tree-search">
          <input
            ref={searchInputRef}
            className="supermemo-search-input"
            placeholder="Search the tree"
            value={searchString}
            onChange={handleSearchChange}
          />
          {searchFoundCount > 0 && (
            <div className="supermemo-search-count">
              {searchFocusIndex + 1} of {searchFoundCount}
            </div>
          )}
        </div>

        <div className="supermemo-action-buttons">
          <button
            className={`supermemo-action-button ${!selectedNode ? 'supermemo-action-disabled' : ''}`}
            onClick={() => selectedPath && addNewNode(selectedPath, 'topic')}
            disabled={!selectedNode}
            title="Add Topic"
          >
            <span className="supermemo-button-icon supermemo-topic-icon">T</span>
          </button>
          <button
            className={`supermemo-action-button ${!selectedNode ? 'supermemo-action-disabled' : ''}`}
            onClick={() => selectedPath && addNewNode(selectedPath, 'flashcard')}
            disabled={!selectedNode}
            title="Add Flashcard"
          >
            <span className="supermemo-button-icon supermemo-flashcard-icon">L</span>
          </button>
          <button
            className={`supermemo-action-button supermemo-delete-button ${!selectedNode ? 'supermemo-action-disabled' : ''}`}
            onClick={() => selectedNode && handleDelete(selectedNode.node, selectedPath)}
            disabled={!selectedNode}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="supermemo-tree-content">
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
          rowHeight={26} // Lower height for SuperMemo-like density
          scaffoldBlockPxWidth={24} // Narrower scaffold for SuperMemo style
          slideRegionSize={100}
        />
      </div>
    </div>
  );
}

export default ContentTree;