import { useState } from "react";
import "./index.css";

function ContentTree() {
  const [treeData] = useState([
    {
      title: "Physics",
      expanded: true,
      children: [
        {
          title: "Astronomy",
          expanded: true,
          children: [
            { title: "Telescopes" },
            { title: "Planets" }
          ]
        },
        {
          title: "Mechanics",
          expanded: true,
          children: [
            { title: "Newton's Laws" },
            { title: "Gravity" }
          ]
        }
      ]
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
        <h3 className="text-xl font-semibold text-gray-800">Content Tree</h3>
      </div>
      <div className="p-4">
        {treeData.map((node, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center py-2 px-3 rounded-md bg-blue-50 text-blue-800 font-medium">
              <i className="fas fa-book mr-2"></i>
              {node.title}
            </div>
            {node.children && (
              <div className="ml-4 mt-2 space-y-2">
                {node.children.map((child, childIndex) => (
                  <div key={childIndex}>
                    <div className="flex items-center py-2 px-3 rounded-md bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                      <i className="fas fa-folder mr-2 text-blue-400"></i>
                      {child.title}
                    </div>
                    {child.children && (
                      <div className="ml-4 mt-2 space-y-2">
                        {child.children.map((grandChild, grandChildIndex) => (
                          <div 
                            key={grandChildIndex} 
                            className="flex items-center py-1.5 px-3 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <i className="fas fa-file-alt mr-2 text-gray-400"></i>
                            {grandChild.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentTree;
