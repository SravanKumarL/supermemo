import { useState } from "react";
import "./index.css";

function ContentContainer() {
  const [contentObj, setContentObj] = useState({
    type: "topic",
    topic: "Physics",
    title: "Introduction to Physics",
    content: "Physics is the study of matter, energy, and their interactions.",
    source: "https://example.com/physics",
    timestamp: "2024-03-19",
    author: "John Doe"
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
            {contentObj.topic}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
            {contentObj.type}
          </span>
        </div>
        
        <h2 
          className="text-2xl font-bold mb-6 text-gray-800 hover:bg-gray-50 p-2 rounded-md transition-colors" 
          contentEditable
          suppressContentEditableWarning
        >
          {contentObj.title}
        </h2>
        
        <div 
          className="prose max-w-none mb-8 hover:bg-gray-50 p-2 rounded-md transition-colors" 
          contentEditable
          suppressContentEditableWarning
        >
          {contentObj.content}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
          <p className="flex items-center">
            <i className="fas fa-link mr-2 text-blue-400"></i>
            Source: 
            <a href={contentObj.source} className="ml-1 text-blue-600 hover:text-blue-800 hover:underline">
              {contentObj.source}
            </a>
          </p>
          <p className="flex items-center">
            <i className="fas fa-clock mr-2 text-blue-400"></i>
            Last updated: {contentObj.timestamp}
          </p>
          <p className="flex items-center">
            <i className="fas fa-user mr-2 text-blue-400"></i>
            Author: {contentObj.author}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContentContainer;
