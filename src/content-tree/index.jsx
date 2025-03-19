import React, { useState, useCallback, useEffect, useRef } from 'react';
import SortableTree, { toggleExpandedForAll } from '@nosferatu500/react-sortable-tree';
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
              type: "topic",
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
              content: "The three laws of motion describe the relationship between a body and the forces acting upon it."
            },
            { 
              title: "Gravity",
              type: "topic",
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
  const [matches, setMatches] = useState([]);
  const searchInputRef = useRef(null);

  const handleTreeChange = (treeData) => {
    setTreeData(treeData);
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
              isPreview: false
            });
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

  const generateNodeProps = useCallback(({ node, path }) => {
    const isMatch = searchString && customSearchMethod({ node, searchQuery: searchString });

    return {
      onClick: () => {
        if (node.type) {
          onNodeSelect({
            type: node.type,
            title: node.title,
            content: node.content,
            topic: path[0]?.title || '',
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            timestamp: "2025-03-19",
            author: "John Doe",
            isPreview: false
          });
        }
      },
      className: `cursor-pointer transition-all duration-200 
        ${isMatch ? 'bg-yellow-50' : ''} 
        ${node.type ? 'has-content hover:bg-blue-50' : 'hover:bg-gray-50'}`,
      icons: node.type ? [
        <div key="type" className={`text-xs px-2 py-0.5 rounded-full ${
          node.type === 'topic' ? 'bg-violet-100 text-violet-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {node.type}
        </div>
      ] : [],
    };
  }, [searchString, onNodeSelect]);

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
        <div className="content-tree-search relative">
          <input
            ref={searchInputRef}
            className="w-full px-3 py-2 pr-16 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
            placeholder="Search the tree... (↑↓ to navigate, Enter to select, Esc to focus)"
            value={searchString}
            onChange={handleSearchChange}
          />
          {searchFoundCount > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-2">
              {searchFocusIndex + 1} of {searchFoundCount}
            </div>
          )}
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
          canDrop={true}
          generateNodeProps={generateNodeProps}
          rowHeight={44}
          scaffoldBlockPxWidth={44}
          slideRegionSize={100}
        />
      </div>
    </div>
  );
}

export default ContentTree;
