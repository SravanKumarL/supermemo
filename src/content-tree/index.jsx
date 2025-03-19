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
    <div className="content-tree-container p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Content Tree</h3>
      <div className="space-y-2">
        {treeData.map((node, index) => (
          <div key={index} className="pl-4">
            <div className="font-medium">{node.title}</div>
            {node.children && (
              <div className="pl-4 space-y-2">
                {node.children.map((child, childIndex) => (
                  <div key={childIndex}>
                    <div className="font-medium">{child.title}</div>
                    {child.children && (
                      <div className="pl-4 space-y-2">
                        {child.children.map((grandChild, grandChildIndex) => (
                          <div key={grandChildIndex} className="text-gray-600">
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
