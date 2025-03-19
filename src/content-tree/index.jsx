import { useState, useCallback } from "react";
import SortableTree, { toggleExpandedForAll } from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import "./index.css";

function ContentTree({ onNodeSelect }) {
  const [treeData, setTreeData] = useState([
    {
      title: "Physics",
      expanded: true,
      children: [
        {
          title: "Astronomy",
          expanded: true,
          children: [
            { 
              title: "Telescopes",
              type: "topic",
              content: "Telescopes are optical instruments that make distant objects appear magnified by using an arrangement of lenses or curved mirrors."
            },
            { 
              title: "Planets",
              type: "flashcard",
              content: "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune."
            }
          ]
        },
        {
          title: "Mechanics",
          expanded: true,
          children: [
            { 
              title: "Newton's Laws",
              type: "topic",
              content: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it."
            },
            { 
              title: "Gravity",
              type: "flashcard",
              content: "Gravity is a force of attraction that exists between any two masses, any two bodies, any two particles."
            }
          ]
        }
      ]
    }
  ]);

  const [searchString, setSearchString] = useState("");

  const handleTreeChange = (treeData) => {
    setTreeData(treeData);
  };

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  const toggleNodeExpansion = (expanded) => {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    );
  };

  const generateNodeProps = useCallback(({ node, path }) => ({
    onClick: () => {
      if (node.type) {
        onNodeSelect({
          type: node.type,
          title: node.title,
          content: node.content,
          topic: path[0]?.title,
          source: "https://example.com/astronomy/order-of-planets-from-sun",
          timestamp: "2025-03-19",
          author: "John Doe"
        });
      }
    },
    className: `cursor-pointer transition-all duration-200 hover:bg-blue-50 ${node.type ? 'has-content' : ''}`,
    icons: node.type ? [
      <div key="type" className={`text-xs px-2 py-0.5 rounded-full ${
        node.type === 'topic' ? 'bg-violet-100 text-violet-800' : 'bg-emerald-100 text-emerald-800'
      }`}>
        {node.type}
      </div>
    ] : [],
    style: {
      height: "auto"
    }
  }), [onNodeSelect]);

  return (
    <div className="content-tree-container">
      <div className="content-tree-header">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Content Tree</h3>
          <div className="space-x-2">
            <button
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors duration-200"
              onClick={() => toggleNodeExpansion(true)}
            >
              Expand All
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={() => toggleNodeExpansion(false)}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      <div className="content-tree-search">
        <input
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
          placeholder="Search the tree..."
          value={searchString}
          onChange={handleSearchChange}
        />
      </div>

      <div className="content-tree-content">
        <SortableTree
          treeData={treeData}
          onChange={handleTreeChange}
          searchQuery={searchString}
          searchFocusOffset={0}
          isVirtualized={true}
          canDrag={true}
          canDrop={true}
          generateNodeProps={generateNodeProps}
          rowHeight={44}
          slideRegionSize={100}
          className="content-tree"
        />
      </div>
    </div>
  );
}

export default ContentTree;
