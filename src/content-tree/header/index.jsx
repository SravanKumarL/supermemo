import {
  toggleExpandedForAll,
  addNodeUnderParent,
  removeNodeAtPath,
  getNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import { useCallback } from "react";
import { rootNodeSelectionPayload } from "../../shared";

const TreeHeader = ({
  searchInput,
  selectedNode,
  selectedPath,
  onNodeSelectionChanged,
  treeData,
  onTreeDataChanged,
}) => {
  const expandAll = useCallback(() => {
    onTreeDataChanged(
      toggleExpandedForAll({
        treeData,
        expanded: true,
      })
    );
  }, [onTreeDataChanged, treeData]);

  const collapseAll = useCallback(() => {
    onTreeDataChanged(
      toggleExpandedForAll({
        treeData,
        expanded: false,
      })
    );
  }, [onTreeDataChanged, treeData]);

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
        <h3 className="supermemo-tree-title">Content Tree</h3>
        <div className="supermemo-tree-buttons">
          <button className="supermemo-tree-button" onClick={expandAll}>
            Expand All
          </button>
          <button className="supermemo-tree-button" onClick={collapseAll}>
            Collapse All
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
          <span className="supermemo-button-icon supermemo-topic-icon">T</span>
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
            L
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
