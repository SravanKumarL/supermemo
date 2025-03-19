import { useState, useEffect } from "react";
import "./index.css";

function ContentContainer({ content }) {
  const [contentObj, setContentObj] = useState(content);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setContentObj(content);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium transform transition-transform duration-200 hover:scale-105">
            {contentObj.topic}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium transform transition-transform duration-200 hover:scale-105">
            {contentObj.type}
          </span>
        </div>
        
        <h2 
          className="text-2xl font-bold mb-6 text-gray-800 hover:bg-gray-50 p-2 rounded-md transition-all duration-200" 
          contentEditable
          suppressContentEditableWarning
        >
          {contentObj.title}
        </h2>
        
        <div 
          className="prose max-w-none mb-8 hover:bg-gray-50 p-2 rounded-md transition-all duration-200" 
          contentEditable
          suppressContentEditableWarning
        >
          {contentObj.content}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
          <p className="flex items-center transform transition-all duration-200 hover:translate-x-1">
            <i className="fas fa-link mr-2 text-blue-400"></i>
            Source: 
            <a href={contentObj.source} className="ml-1 text-blue-600 hover:text-blue-800 hover:underline">
              {contentObj.source}
            </a>
          </p>
          <p className="flex items-center transform transition-all duration-200 hover:translate-x-1">
            <i className="fas fa-clock mr-2 text-blue-400"></i>
            Last updated: {contentObj.timestamp}
          </p>
          <p className="flex items-center transform transition-all duration-200 hover:translate-x-1">
            <i className="fas fa-user mr-2 text-blue-400"></i>
            Author: {contentObj.author}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContentContainer;
