import { useEffect, useState, useCallback } from "react";
import Markdown from "./markdown";
import clsx from "clsx";

function Section({ isPreview, heading, content, classes }) {
  return (
    <>
      <h3 className="text-lg font-medium text-gray-700 mb-3">{heading}</h3>
      <Markdown
        height={150}
        classes={classes}
        isPreview={isPreview}
        content={content}
      />
    </>
  );
}

function GradingSection({ discoverNext, handleContentChange }) {
  const [flashcardRating, setFlashcardRating] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const handleGradeClick = useCallback(
    (rating) => {
      // Set the rating
      setFlashcardRating(rating);

      // Prepare feedback message based on rating
      let message = "";
      switch (rating) {
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
        handleContentChange();
        discoverNext();
      }, 1500);
    },
    [discoverNext, handleContentChange]
  );
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        How well did you know this?
      </h3>
      <div className="flashcard-grade-buttons">
        {["Again", "Hard", "Good", "Easy"].map((feedbackBtn, idx) => (
          <button
            key={feedbackBtn}
            onClick={() => handleGradeClick(idx + 1)}
            className={clsx(
              `flashcard-grade-button flashcard-grade-${feedbackBtn.toLowerCase()}`,
              flashcardRating === idx + 1 ? "opacity-90" : "opacity-100"
            )}
            disabled={showFeedback}
          >
            {feedbackBtn}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-center transition-opacity animate-pulse">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}

function AnswerSection({
  isPreview,
  content,
  discoverNext,
  handleContentChange,
}) {
  const [answerRevealed, setAnswerRevealed] = useState(false);
  useEffect(() => {
    // Reset to question view when switching to study mode
    setAnswerRevealed(!isPreview);
  }, [isPreview]);
  return answerRevealed ? (
    <>
      <Section
        heading="Answer"
        isPreview={isPreview}
        content={content}
        classes={{
          preview: "flashcard-study-answer",
          editor: "flashcard-answer",
        }}
      />
      {isPreview && (
        <GradingSection
          discoverNext={discoverNext}
          handleContentChange={handleContentChange}
        />
      )}
    </>
  ) : (
    <button
      onClick={() => setAnswerRevealed(true)}
      className="flashcard-show-answer"
    >
      Show Answer
    </button>
  );
}

export default function FlashcardContentArea({
  isPreview,
  content,
  onContentUpdated,
  discoverNext,
}) {
  const handleContentChange = useCallback(
    (value) => {
      onContentUpdated("question", value);
      onContentUpdated("answer", value);
    },
    [onContentUpdated]
  );

  return (
    <div className="bg-white p-6 flashcard-study-container">
      <div className="mb-6">
        <Section
          heading="Question"
          isPreview={isPreview}
          content={content.question}
          classes={{
            preview: "flashcard-study-question",
            editor: "flashcard-question",
          }}
        />
        <div className="mt-4">
          <AnswerSection
            content={content.answer}
            discoverNext={discoverNext}
            handleContentChange={handleContentChange}
            isPreview={isPreview}
          />
        </div>
      </div>
    </div>
  );
}
