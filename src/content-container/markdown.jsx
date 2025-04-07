import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef } from "react";
import clsx from "clsx";

function useFocusEditor(content) {
  const editorRef = useRef(null);
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
  }, [content]);
  return editorRef;
}

export default function Markdown({
  height,
  isPreview,
  placeholderText,
  content,
  onContentUpdated,
  classes,
}) {
  const editorRef = useFocusEditor(content);
  return (
    <div className="bg-white border-y border-gray-200">
      {isPreview ? (
        <div
          className={clsx(
            "markdown-preview pt-4 px-6 pb-6 min-h-[300px]",
            classes?.preview || ""
          )}
        >
          <MDEditor.Markdown source={content || ""} />
        </div>
      ) : (
        <div
          className={clsx(
            "markdown-editor-container p-2",
            classes?.editor || ""
          )}
          ref={editorRef}
        >
          <div
            className={`relative ${
              isPreview ? "hide-toolbar" : "show-toolbar"
            }`}
          >
            <MDEditor
              value={content}
              onChange={onContentUpdated}
              height={height}
              preview="edit"
              hideToolbar={false}
              textareaProps={{
                placeholder: placeholderText,
                // onFocus: () => setIsEditorFocused(true),
                // onBlur: () => setIsEditorFocused(false),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
