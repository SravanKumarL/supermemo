import {
  toggleExpandedForAll,
  addNodeUnderParent,
  removeNodeAtPath,
  getNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import { useState, useCallback } from "react";
import { rootNodeSelectionPayload } from "../../shared";

const TreeHeader = ({
  searchInput,
  selectedNode,
  selectedPath,
  onNodeSelectionChanged,
  treeData,
  onTreeDataChanged,
}) => {
  // Add state to track if tree is expanded
  const [isExpanded, setIsExpanded] = useState(true);
  // Combined toggle function
  const toggleTree = useCallback(() => {
    onTreeDataChanged(
      toggleExpandedForAll({
        treeData,
        expanded: !isExpanded,
      })
    );
    setIsExpanded(!isExpanded);
  }, [onTreeDataChanged, treeData, isExpanded]);

  const addNewNode = useCallback(
    (path, type = "topic", asSibling = false) => {
      if (!path || !selectedNode) return;

      const newNode = {
        title: type === "topic" ? "New Topic" : "New Flashcard",
        type: type,
        category: selectedNode.node?.title || "",
        content: "",
        children: type === "topic" ? [] : undefined,
      };

      const targetPath = selectedNode.path.split("-").map(Number);

      if (asSibling && targetPath.length > 0) {
        const parentPath = targetPath.slice(0, -1);
        onTreeDataChanged(
          addNodeUnderParent({
            treeData,
            parentKey: parentPath[parentPath.length - 1],
            expandParent: true,
            getNodeKey: ({ treeIndex }) => treeIndex,
            newNode,
            addAsFirstChild: false,
          }).treeData
        );
      } else {
        onTreeDataChanged(
          addNodeUnderParent({
            treeData,
            parentKey: targetPath[targetPath.length - 1],
            expandParent: true,
            getNodeKey: ({ treeIndex }) => treeIndex,
            newNode,
          }).treeData
        );
      }
    },
    [onTreeDataChanged, selectedNode, treeData]
  );

  const handleDelete = useCallback(
    (node, path) => {
      if (!selectedNode) return;

      if (node.children && node.children.length > 0) {
        if (
          !window.confirm(
            `Are you sure you want to delete "${node.title}" and all its contents? This will delete ${node.children.length} item(s) under it.`
          )
        ) {
          return;
        }
      }

      onTreeDataChanged(
        removeNodeAtPath({
          treeData,
          path,
          getNodeKey: ({ treeIndex }) => treeIndex,
        })
      );

      const parentPath = path.slice(0, -1);
      if (parentPath.length > 0) {
        const parentNode = getNodeAtPath({
          treeData,
          path: parentPath,
          getNodeKey: ({ treeIndex }) => treeIndex,
        })?.node;

        if (parentNode) {
          onNodeSelectionChanged(parentNode, parentPath);
        }
      } else {
        if (treeData.length > 0) {
          onNodeSelectionChanged(...rootNodeSelectionPayload(treeData));
        }
      }
    },
    [onNodeSelectionChanged, onTreeDataChanged, selectedNode, treeData]
  );

  return (
    <div className="supermemo-tree-header">
      <div className="flex justify-between items-center mb-4">
        <h3 className="supermemo-tree-title flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L6 9H9L5 13H8L4 17H20L16 13H19L15 9H18L12 3Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
            <rect x="11" y="17" width="2" height="5" fill="#7c2d12" stroke="#7c2d12" strokeWidth="0.5" />
          </svg>
          Content Tree
        </h3>
        <div className="supermemo-tree-buttons">
          <button className="supermemo-tree-button flex items-center gap-2" onClick={toggleTree}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 44 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Switch background */}
              <rect x="2" y="2" width="40" height="20" rx="10" ry="10" fill={isExpanded ? "#4ade80" : "#93c5fd"} stroke="none" />
              {/* Switch knob */}
              <circle cx={isExpanded ? "32" : "12"} cy="12" r="8" fill="white" stroke="none" />
            </svg>
            Toggle Tree
          </button>
        </div>
      </div>
      {searchInput}

      <div className="supermemo-action-buttons">
        <button
          className={`supermemo-action-button ${
            !selectedNode ? "supermemo-action-disabled" : ""
          }`}
          onClick={() => addNewNode(selectedPath, "topic")}
          disabled={!selectedNode}
          title="Add Topic"
        >
          <span className="supermemo-button-icon supermemo-topic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </span>
        </button>
        <button
          className={`supermemo-action-button ${
            !selectedNode ? "supermemo-action-disabled" : ""
          }`}
          onClick={() => addNewNode(selectedPath, "flashcard")}
          disabled={!selectedNode}
          title="Add Flashcard"
        >
          <span className="supermemo-button-icon supermemo-flashcard-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </span>
        </button>
        <button
          className={`supermemo-action-button supermemo-delete-button ${
            !selectedNode ? "supermemo-action-disabled" : ""
          }`}
          onClick={() => handleDelete(selectedNode?.node, selectedPath)}
          disabled={!selectedNode}
          title="Delete"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default TreeHeader;
