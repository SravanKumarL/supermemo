/**
 * ContentContainer Component with Markdown Editor
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import MDEditor from "@uiw/react-md-editor";

const defaultContent = {
  title: "",
  type: "topic",
  category: "",
  content: "",
  author: "",
  timestamp: null,
  source: "",
};

function ContentContainer({ initialContent, onContentChange }) {
  const [content, setContent] = useState(initialContent || defaultContent);
  const [isEditingSource, setIsEditingSource] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    setContent({
      ...(initialContent || {}),
      timestamp: initialContent?.timestamp
        ? new Date(initialContent.timestamp)
        : null,
    });
  }, [initialContent]);

  const updateContent = useCallback((field, value) => {
    setContent((content) => ({ ...content, [field]: value }));
  }, []);

  // Focus content field when shouldFocusContent is true or content changes
  useEffect(() => {
    if (content.shouldFocusContent && editorRef.current) {
      // Try to find the textarea in the wmde-markdown-var container
      const textarea = editorRef.current.querySelector(
        ".w-md-editor-text-input textarea"
      );
      if (textarea) {
        // Use setTimeout to ensure the editor is fully rendered
        setTimeout(() => {
          textarea.focus();
        }, 0);
      } else {
        // Fallback: try to find any textarea in the editor
        const fallbackTextarea = editorRef.current.querySelector("textarea");
        if (fallbackTextarea) {
          setTimeout(() => {
            fallbackTextarea.focus();
          }, 0);
        }
      }
    }
  }, [content.shouldFocusContent, content.title, content.type]);

  // Basic validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Event handlers
  const handleBlur = useCallback(() => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, [content, onContentChange]);

  const handleInputChange = useCallback(
    (e) => {
      updateContent(e.target.name, e.target.value);
    },
    [updateContent]
  );

  const handleTitleChange = useCallback(
    (e) => {
      updateContent("title", e.target.innerText);
      e.stopPropagation();
    },
    [updateContent]
  );

  const handleContentChange = useCallback(
    (value) => {
      updateContent("content", value);
    },
    [updateContent]
  );

  const handleDateChange = useCallback(
    (date) => {
      updateContent("timestamp", date ? date.toISOString().split("T")[0] : "");
    },
    [updateContent]
  );

  // Determine content type and color scheme
  const isFlashcard = content.type !== "topic";
  const colorScheme = isFlashcard
    ? {
        header: "bg-blue-100",
        title: "text-blue-950",
        tag: "bg-blue-300 text-blue-950",
        topic: "text-blue-800",
        border: "border-blue-200",
        footer: "bg-blue-100",
      }
    : {
        header: "bg-violet-100",
        title: "text-violet-950",
        tag: "bg-violet-300 text-violet-950",
        topic: "text-violet-800",
        border: "border-violet-200",
        footer: "bg-violet-100",
      };

  return (
    <div
      className={`content-container bg-slate-100 rounded-xl shadow-sm overflow-hidden ${
        content.isPreview ? "border-2 border-blue-400" : ""
      }`}
      data-color-mode="light"
      onBlur={handleBlur}
    >
      {/* Preview Mode Indicator */}
      {content.isPreview && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="text-sm font-medium text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
            Preview Mode
          </div>
          <div className="text-sm text-blue-600">Press Enter to select</div>
        </div>
      )}

      {/* Content Header */}
      <div className={`p-6 ${colorScheme.header}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1
              className={`text-2xl font-semibold mb-2 ${
                content.isPreview ? "text-blue-900" : colorScheme.title
              }`}
              contentEditable={!content.isPreview}
              suppressContentEditableWarning={true}
              onBlur={handleTitleChange}
            >
              {content.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${colorScheme.tag}`}
            >
              {content.type}
            </span>
            <span className={`text-sm ${colorScheme.topic}`}>
              {content.topic}
            </span>
          </div>
        </div>

        {!content.isPreview && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowToolbar(!showToolbar)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1 ${
                showToolbar
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showToolbar ? (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="font-mono font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    M↓
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border-y border-gray-200">
        {content.isPreview ? (
          <div className="markdown-preview pt-0 px-6 pb-6 min-h-[300px]">
            <MDEditor.Markdown source={content.content || ""} />
          </div>
        ) : (
          <div className="markdown-editor-container p-2" ref={editorRef}>
            <div
              className={`relative ${
                showToolbar ? "show-toolbar" : "hide-toolbar"
              }`}
            >
              <MDEditor
                value={content.content}
                onChange={handleContentChange}
                height={350}
                preview="edit"
                hideToolbar={false}
                textareaProps={{
                  placeholder:
                    content.type === "topic"
                      ? "Add content for this topic..."
                      : "",
                  onFocus: () => setIsEditorFocused(true),
                  onBlur: () => setIsEditorFocused(false),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Footer - Only shown in edit mode */}
      {!content.isPreview && (
        <div
          className={`px-6 py-4 ${colorScheme.footer} border-t ${colorScheme.border}`}
        >
          <div className="flex items-center gap-6 text-xs">
            {/* Source URL Section */}
            <div className="flex items-center gap-1 group relative">
              <svg
                className={`w-3.5 h-3.5 ${
                  isFlashcard
                    ? "text-blue-600 group-hover:text-blue-800"
                    : "text-violet-600 group-hover:text-violet-800"
                } transition-colors duration-200 flex-shrink-0`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              {isEditingSource ? (
                <input
                  name="source"
                  type="text"
                  value={content.source}
                  onChange={handleInputChange}
                  onBlur={() => setIsEditingSource(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingSource(false);
                    }
                    if (e.key === "Escape") {
                      setIsEditingSource(false);
                    }
                  }}
                  className={`bg-transparent ${
                    isFlashcard
                      ? "text-blue-700 focus:text-blue-900"
                      : "text-violet-700 focus:text-violet-900"
                  } transition-colors duration-200 w-64 focus:outline-none focus:ring-1 ${
                    isFlashcard
                      ? "focus:ring-blue-400"
                      : "focus:ring-violet-400"
                  } rounded px-1`}
                  placeholder="Enter source URL..."
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => setIsEditingSource(true)}
                    className={`cursor-text ${
                      isFlashcard ? "text-blue-700" : "text-violet-700"
                    } ${
                      !content.source && "italic text-slate-400"
                    } hover:underline`}
                  >
                    {content.source || "Add source link..."}
                  </span>
                  {isValidUrl(content.source) && (
                    <a
                      href={content.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isFlashcard
                          ? "text-blue-500 hover:text-blue-700"
                          : "text-violet-500 hover:text-violet-700"
                      } transition-colors duration-200`}
                      onClick={(e) => e.stopPropagation()}
                      title="Open in new tab"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Date Selection Section */}
            <div className="flex items-center gap-1 group">
              <svg
                className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-800 transition-colors duration-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <DatePicker
                selected={content.timestamp}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date..."
                className="bg-transparent text-amber-700 hover:text-amber-900 transition-colors duration-200 w-24 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
                calendarClassName="date-picker-calendar"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
              />
            </div>

            {/* Author Section */}
            <div className="flex items-center gap-1 group">
              <svg
                className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-800 transition-colors duration-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {isEditingAuthor ? (
                <input
                  name="author"
                  type="text"
                  value={content.author}
                  onChange={handleInputChange}
                  onBlur={() => setIsEditingAuthor(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingAuthor(false);
                    }
                  }}
                  className="bg-transparent text-emerald-700 focus:text-emerald-900 transition-colors duration-200 w-32 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
                  placeholder="Enter author name..."
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditingAuthor(true)}
                  className={`cursor-text text-emerald-700 ${
                    !content.author && "italic text-slate-400"
                  }`}
                >
                  {content.author || "Add author..."}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentContainer;
