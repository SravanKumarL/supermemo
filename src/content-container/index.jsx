import React from 'react';
import "./index.css";

function ContentContainer({ content }) {
  if (!content) return null;

  return (
    <div className={`content-container p-6 relative ${content.isPreview ? 'bg-blue-50/30 border-2 border-blue-200 rounded-lg' : ''}`}>
      {content.isPreview && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Preview Mode
          </div>
          <div className="text-sm text-blue-500">
            Press Enter to select
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 
            className={`text-2xl font-semibold mb-2 ${content.isPreview ? 'text-blue-900' : 'text-gray-900'}`}
            contentEditable={!content.isPreview}
            suppressContentEditableWarning={true}
          >
            {content.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            content.type === 'topic' ? 'bg-violet-100 text-violet-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {content.type}
          </span>
          <span className="text-sm text-gray-500">{content.topic}</span>
        </div>
      </div>

      <div 
        className={`prose max-w-none mb-8 ${content.isPreview ? 'text-blue-800' : 'text-gray-900'}`}
        contentEditable={!content.isPreview}
        suppressContentEditableWarning={true}
      >
        {content.content}
      </div>

      {!content.isPreview && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6 text-xs">
            <a 
              href={content.source} 
              className="text-indigo-400 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-3.5 h-3.5 text-indigo-300 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {content.source}
            </a>

            <div className="flex items-center gap-1 text-amber-400 group">
              <svg className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {content.timestamp}
            </div>

            <div className="flex items-center gap-1 text-emerald-400 group">
              <svg className="w-3.5 h-3.5 text-emerald-300 group-hover:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {content.author}
            </div>
          </div>
        </div>
      )}

      {content.isPreview && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-px left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-50"></div>
          <div className="absolute -bottom-px left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-50"></div>
        </div>
      )}
    </div>
  );
}

export default ContentContainer;
