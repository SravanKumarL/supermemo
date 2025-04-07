/**
 * ContentTree Component
 * With improved search clearing functionality
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

  // Function to clear search results and reset search state
  const clearSearch = () => {
    setSearchString("");
    setSearchFocusIndex(0);
    setSearchFoundCount(null);
    setMatches([]);
  };

  const onNodeSelectionChanged = useCallback(
    (node, path) => {
      let changed = false;
      if (selectedNode?.node !== node && selectedNode?.path !== path) {
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

  const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    if (prevPath && nextPath) {
      const prevPathStr = prevPath.join("-");
      const nextPathStr = nextPath.join("-");
      return !nextPathStr.startsWith(prevPathStr);
    }
    return true;
  };

  const customSearchMethod = ({ node, searchQuery }) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  };

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

  useEffect(() => {
    if (matches.length > 0 && searchFocusIndex < matches.length) {
      showPreview(matches[searchFocusIndex]);
    }
  }, [searchFocusIndex, matches, showPreview]);

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

  const generateNodeProps = useCallback(
    ({ node, path }) => {
      const isSelected = selectedNode && selectedNode.path === path.join("-");
      const isEditing = editingNode && editingNode.path === path.join("-");
      const isAnimating = animatingNode === path.join("-");

      return {
        onClick: (e) => {
          e.preventDefault();
          const nodePath = path.join("-");
          const currentTime = new Date().getTime();

          // Set animation on click
          setAnimatingNode(nodePath);
          setTimeout(() => setAnimatingNode(null), 500);

          if (
            isSelected &&
            currentTime - lastClickTime < DOUBLE_CLICK_THRESHOLD
          ) {
            setEditingNode({ node, path: nodePath });
            e.stopPropagation();
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
                 ${isAnimating ? "animate-pulse" : ""}`,
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
                      ? "supermemo-flashcard-icon"
                      : "supermemo-topic-icon"
                  }`}
                >
                  {node.type === "flashcard" ? "L" : "T"}
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
    ]
  );

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
