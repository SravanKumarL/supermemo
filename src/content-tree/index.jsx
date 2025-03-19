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
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);

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
          topic: path[0]?.title || "General",
          source: "https://example.com/astronomy/order-of-planets-from-sun",
          timestamp: "2025-03-19",
          author: "John Doe"
        });
      }
    },
    className: `cursor-pointer transition-all duration-200 hover:bg-blue-50 ${node.type ? 'has-content' : ''}`,
    icons: node.type ? [
      <div key="type" className={`text-xs px-2 py-0.5 rounded-full ${
        node.type === 'topic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {node.type}
      </div>
    ] : [],
    style: {
      height: "auto"
    }
  }), [onNodeSelect]);

  return (
    <div className="content-tree-container bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Content Tree</h3>
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200"
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

      <div className="mb-4">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search the tree..."
          value={searchString}
          onChange={handleSearchChange}
        />
      </div>

      <div style={{ height: "calc(100vh - 200px)" }}>
        <SortableTree
          treeData={treeData}
          onChange={handleTreeChange}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          isVirtualized={true}
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0
            );
          }}
          canDrag={true}
          canDrop={true}
          generateNodeProps={generateNodeProps}
          rowHeight={44}
          slideRegionSize={100}
          className="content-tree"
        />
      </div>

      {searchFoundCount > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {searchFoundCount} matches found
        </div>
      )}
    </div>
  );
}

export default ContentTree;
