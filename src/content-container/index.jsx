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
    <div className={`bg-white rounded-xl border-2 border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 ${
      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      <div className="p-8 relative">
        {/* Type Tags - Positioned Absolutely */}
        <div className="absolute top-6 right-6 flex gap-2">
          <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${
            contentObj.type === 'topic' 
              ? 'bg-violet-100 text-violet-800' 
              : 'bg-emerald-100 text-emerald-800'
          } transform transition-transform duration-200 hover:scale-105`}>
            {contentObj.type}
          </span>
          {contentObj.topic && (
            <span className={`px-3 py-1.5 text-sm rounded-full font-medium bg-gray-100 text-gray-800 transform transition-transform duration-200 hover:scale-105`}>
              {contentObj.topic}
            </span>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-8 pr-48">
          <h2 
            className="text-3xl font-bold text-gray-900 hover:bg-indigo-50 p-3 -ml-3 rounded-lg transition-all duration-200" 
            contentEditable
            suppressContentEditableWarning
          >
            {contentObj.title}
          </h2>
        </div>
        
        {/* Content Section */}
        <div 
          className="prose prose-lg max-w-none mb-8 hover:bg-indigo-50 p-3 -ml-3 rounded-lg transition-all duration-200" 
          contentEditable
          suppressContentEditableWarning
        >
          {contentObj.content}
        </div>

        {/* Metadata Section */}
        <div className="border-t border-indigo-100 pt-6 space-y-3 text-sm">
          <div className="flex items-center text-gray-600 group transform transition-all duration-200 hover:translate-x-2">
            <i className="fas fa-link w-6 text-indigo-400 group-hover:text-indigo-500 transition-colors duration-200"></i>
            <span className="mr-2">Source:</span>
            <a 
              href={contentObj.source} 
              className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contentObj.source}
            </a>
          </div>

          <div className="flex items-center text-gray-600 group transform transition-all duration-200 hover:translate-x-2">
            <i className="fas fa-clock w-6 text-indigo-400 group-hover:text-indigo-500 transition-colors duration-200"></i>
            <span className="mr-2">Last updated:</span>
            <span>{contentObj.timestamp}</span>
          </div>

          <div className="flex items-center text-gray-600 group transform transition-all duration-200 hover:translate-x-2">
            <i className="fas fa-user w-6 text-indigo-400 group-hover:text-indigo-500 transition-colors duration-200"></i>
            <span className="mr-2">Author:</span>
            <span>{contentObj.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentContainer;
