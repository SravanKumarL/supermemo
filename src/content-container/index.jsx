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
  question: "",
  answer: "",
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
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [flashcardRating, setFlashcardRating] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (initialContent) {
      // If content is a string, try to separate it into question and answer for flashcards
      const contentData = { ...initialContent };
      
      // Check if this is a new flashcard with default content
      const isNewFlashcard = initialContent.type === 'flashcard' && 
                           initialContent.content === 'Enter flashcard content here...';
      
      // Force new flashcards into edit mode
      if (isNewFlashcard) {
        contentData.isEditing = true;
      }
      
      if (initialContent.type === "flashcard" && typeof initialContent.content === "string" && !initialContent.question) {
        // Try to split the content if it doesn't have question/answer fields yet
        const parts = initialContent.content.split(/\n-{3,}\n/);
        if (parts.length > 1) {
          contentData.question = parts[0];
          contentData.answer = parts.slice(1).join("\n---\n");
        } else {
          contentData.question = initialContent.content;
          contentData.answer = "";
        }
      }
      
      setContent({
        ...contentData,
        timestamp: contentData.timestamp
          ? new Date(contentData.timestamp)
          : null,
      });
    } else {
      setContent(defaultContent);
    }
    
    // Always reset the flashcard state when content changes
    setAnswerRevealed(false);
    setFlashcardRating(null);
  }, [initialContent]);

  // Update when content type or isEditing changes
  useEffect(() => {
    if (content.type === 'flashcard' && !content.isEditing) {
      // Reset to question view when switching to study mode
      setAnswerRevealed(false);
      setFlashcardRating(null);
    }
  }, [content.type, content.isEditing]);

  const updateContent = useCallback((field, value) => {
    setContent((content) => {
      const newContent = { ...content, [field]: value };
      
      // If updating question or answer for a flashcard, also update the combined content
      if (newContent.type === "flashcard" && (field === "question" || field === "answer")) {
        if (newContent.question && newContent.answer) {
          newContent.content = `${newContent.question}\n---\n${newContent.answer}`;
        } else if (newContent.question) {
          newContent.content = newContent.question;
        } else if (newContent.answer) {
          newContent.content = newContent.answer;
        } else {
          newContent.content = "";
        }
      }
      
      return newContent;
    });
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

  const handleQuestionChange = useCallback(
    (value) => {
      updateContent("question", value);
    },
    [updateContent]
  );

  const handleAnswerChange = useCallback(
    (value) => {
      updateContent("answer", value);
    },
    [updateContent]
  );

  const handleContentChange = useCallback(
    (value) => {
      updateContent("content", value);
      
      // If it's not a flashcard or we're using the combined editor
      if (content.type !== "flashcard" || !content.useSplitEditor) {
        // Try to split content into question and answer parts for flashcards
        if (content.type === "flashcard") {
          const parts = value.split(/\n-{3,}\n/);
          if (parts.length > 1) {
            updateContent("question", parts[0]);
            updateContent("answer", parts.slice(1).join("\n---\n"));
          } else {
            updateContent("question", value);
            updateContent("answer", "");
          }
        }
      }
    },
    [updateContent, content.type, content.useSplitEditor]
  );

  const handleDateChange = useCallback(
    (date) => {
      updateContent("timestamp", date ? date.toISOString().split("T")[0] : "");
    },
    [updateContent]
  );

  const handleGradeClick = useCallback(
    (rating) => {
      // Set the rating
      setFlashcardRating(rating);
      
      // Prepare feedback message based on rating
      let message = "";
      switch(rating) {
        case 1:
          message = "You'll see this card again soon";
          break;
        case 2:
          message = "We'll review this one more often";
          break;
        case 3:
          message = "Good job! You're getting it";
          break;
        case 4:
          message = "Perfect! You've mastered this";
          break;
        default:
          message = "Card graded";
      }
      
      // Show feedback
      setFeedbackMessage(message);
      setShowFeedback(true);
      
      // Save the rating to the backend/algorithm
      console.log(`Flashcard rated as: ${rating}`);
      
      // After a short delay, hide feedback and trigger navigation to random item
      setTimeout(() => {
        setShowFeedback(false);
        
        // Save content changes if needed
        if (onContentChange) {
          onContentChange(content);
        }
        
        // Find a parent component that has the handleDiscoverClick function (via custom event)
        const event = new CustomEvent('discovernext', { bubbles: true });
        document.querySelector('.content-container').dispatchEvent(event);
      }, 1500);
    },
    [content, onContentChange]
  );

  // Function to toggle between edit and view modes for flashcards
  const toggleEditMode = useCallback(() => {
    // Save content if toggling from edit mode to view mode
    if (content.isEditing && onContentChange) {
      onContentChange(content);
    }
    
    setContent(prev => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
  }, [content, onContentChange]);

  // Determine content type and color scheme
  const isFlashcard = content.type !== "topic";
  // Controls whether we're in view mode (not editing) for flashcards
  const isPreviewMode = content.isPreview || (isFlashcard && !content.isEditing);
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
      className="content-container bg-slate-100 rounded-xl shadow-sm overflow-hidden"
      data-color-mode="light"
      onBlur={handleBlur}
    >
      {/* Content Header */}
      <div className={`p-6 ${colorScheme.header}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1
              className={`text-2xl font-semibold mb-2 ${colorScheme.title}`}
              contentEditable={!isPreviewMode}
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

        <div className="flex justify-end gap-2">
          {/* Edit/View Toggle Button for Flashcards */}
          {isFlashcard && (
            <button
              type="button"
              onClick={toggleEditMode}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                content.isEditing
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {content.isEditing ? (
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
                  Study Mode
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
                  Edit Mode
                </>
              )}
            </button>
          )}

          {!isPreviewMode && (
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
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border-y border-gray-200">
        {isPreviewMode ? (
          isFlashcard ? (
            // Flashcard Study Mode
            <div className="bg-white p-6 flashcard-study-container">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Question</h3>
                <div className="flashcard-study-question">
                  <MDEditor.Markdown source={content.question || content.content || ""} />
                </div>
              </div>
              
              {answerRevealed ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Answer</h3>
                    <div className="flashcard-study-answer">
                      <MDEditor.Markdown source={content.answer || ""} />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">How well did you know this?</h3>
                    <div className="flashcard-grade-buttons">
                      <button 
                        onClick={() => handleGradeClick(1)}
                        className={`flashcard-grade-button flashcard-grade-again ${flashcardRating === 1 ? 'opacity-90' : 'opacity-100'}`}
                        disabled={showFeedback}
                      >
                        Again
                      </button>
                      <button 
                        onClick={() => handleGradeClick(2)}
                        className={`flashcard-grade-button flashcard-grade-hard ${flashcardRating === 2 ? 'opacity-90' : 'opacity-100'}`}
                        disabled={showFeedback}
                      >
                        Hard
                      </button>
                      <button 
                        onClick={() => handleGradeClick(3)}
                        className={`flashcard-grade-button flashcard-grade-good ${flashcardRating === 3 ? 'opacity-90' : 'opacity-100'}`}
                        disabled={showFeedback}
                      >
                        Good
                      </button>
                      <button 
                        onClick={() => handleGradeClick(4)}
                        className={`flashcard-grade-button flashcard-grade-easy ${flashcardRating === 4 ? 'opacity-90' : 'opacity-100'}`}
                        disabled={showFeedback}
                      >
                        Easy
                      </button>
                    </div>
                    
                    {showFeedback && (
                      <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-center transition-opacity animate-pulse">
                        {feedbackMessage}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setAnswerRevealed(true)}
                  className="flashcard-show-answer"
                >
                  Show Answer
                </button>
              )}
            </div>
          ) : (
            // Standard preview mode for non-flashcards
            <div className="markdown-preview pt-0 px-6 pb-6 min-h-[300px]">
              <MDEditor.Markdown source={content.content || ""} />
            </div>
          )
        ) : isFlashcard ? (
          // Flashcard Edit View with Question/Answer
          <div className="p-6">
            {/* Question Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Question</h3>
              <div className="markdown-editor-container flashcard-question" ref={editorRef}>
                <div className={`relative ${showToolbar ? "show-toolbar" : "hide-toolbar"}`}>
                  <MDEditor
                    value={content.question}
                    onChange={handleQuestionChange}
                    height={150}
                    preview="edit"
                    hideToolbar={false}
                    textareaProps={{
                      placeholder: "Enter your question here...",
                      onFocus: () => setIsEditorFocused(true),
                      onBlur: () => setIsEditorFocused(false),
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Answer Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Answer</h3>
              <div className="markdown-editor-container flashcard-answer">
                <div className={`relative ${showToolbar ? "show-toolbar" : "hide-toolbar"}`}>
                  <MDEditor
                    value={content.answer}
                    onChange={handleAnswerChange}
                    height={150}
                    preview="edit"
                    hideToolbar={false}
                    textareaProps={{
                      placeholder: "Enter your answer here...",
                      onFocus: () => setIsEditorFocused(true),
                      onBlur: () => setIsEditorFocused(false),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Standard Topic View
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
