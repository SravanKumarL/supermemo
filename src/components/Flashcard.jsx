import React, { useState, useEffect } from 'react';
import MDEditor from "@uiw/react-md-editor";

/**
 * Flashcard component - Displays a question/answer flashcard with spaced repetition grading.
 * Implements a simple SuperMemo-style interface with four difficulty grades.
 * 
 * @param {string} question - The markdown content for the question side of the flashcard
 * @param {string} answer - The markdown content for the answer side of the flashcard
 * @returns {JSX.Element} The rendered flashcard component
 */
const Flashcard = ({ question, answer }) => {
  // State for tracking flashcard interaction
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  
  /**
   * Reveals the answer side of the flashcard
   */
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswered(true);
  };
  
  /**
   * Handles the user's self-assessment of how well they knew the answer
   * @param {string} grade - One of: 'again', 'hard', 'good', or 'easy'
   */
  const handleGrade = (grade) => {
    // Store the selected grade
    setSelectedGrade(grade);
    
    // Show appropriate feedback based on grade
    switch(grade) {
      case 'again':
        setFeedback("You'll see this card again soon to reinforce your memory.");
        break;
      case 'hard':
        setFeedback("This was challenging. We'll review it again before long.");
        break;
      case 'good':
        setFeedback("Good job! You're making progress with this concept.");
        break;
      case 'easy':
        setFeedback("Perfect! You've mastered this concept.");
        break;
      default:
        setFeedback("Card graded successfully!");
    }
    
    // Show feedback
    setShowFeedback(true);
    
    // Use timeout to simulate processing and move to next card
    setTimeout(() => {
      // Call the discover button functionality to move to next random card
      const discoverButton = document.querySelector('button[class*="bg-gradient-to-r from-indigo-600 to-purple-600"]');
      if (discoverButton) {
        discoverButton.click();
      }
      
      // Reset states for next card
      setShowAnswer(false);
      setAnswered(false);
      setShowFeedback(false);
      setSelectedGrade("");
    }, 1500); // 1.5 seconds delay to show feedback
  };
  
  /**
   * Returns CSS class names for the feedback box based on selected grade
   * @returns {string} CSS class names for styling the feedback box
   */
  const getFeedbackStyles = () => {
    switch(selectedGrade) {
      case 'again':
        return "bg-red-100 border-l-4 border-red-500 text-red-700";
      case 'hard':
        return "bg-orange-100 border-l-4 border-orange-500 text-orange-700";
      case 'good':
        return "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700";
      case 'easy':
        return "bg-green-100 border-l-4 border-green-500 text-green-700";
      default:
        return "bg-white text-gray-700";
    }
  };
  
  // If both question and answer are empty, show empty state message
  if (!question && !answer) {
    return (
      <div className="flex flex-col h-[300px]">
        <div className="bg-white border-y border-gray-200 p-6 rounded-xl h-full flex items-center justify-center">
          <div className="text-gray-400 italic text-center">
            <p>This card is empty, please add content</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      {/* Question Section */}
      <div className="bg-white border-y border-gray-200 p-6 rounded-t-xl">
        <div className="flashcard-study-question min-h-[100px]">
          <h2 className="text-xl font-medium mb-2">Question</h2>
          <div className="text-gray-800">
            <MDEditor.Markdown source={question || ""} />
          </div>
        </div>
      </div>
      
      {/* Answer Section - Only shown after user requests it */}
      {showAnswer && (
        <div className="bg-white border-y border-gray-200 p-6">
          <div className="flashcard-study-answer min-h-[100px]">
            <h2 className="text-xl font-medium mb-2">Answer</h2>
            <div className="text-gray-800">
              <MDEditor.Markdown source={answer || ""} />
            </div>
          </div>
        </div>
      )}
      
      {/* Controls Section - Changes based on study state */}
      <div className="bg-blue-50 p-6 rounded-b-xl">
        {!answered ? (
          <button 
            className="flashcard-show-answer"
            onClick={handleShowAnswer}
          >
            Show Answer
          </button>
        ) : (
          <div>
            {showFeedback ? (
              <div className={`text-center py-3 px-4 rounded-lg shadow-sm animate-pulse ${getFeedbackStyles()}`}>
                <p className="font-medium">{feedback}</p>
              </div>
            ) : (
              <>
                <h3 className="text-sm text-center mb-3 text-gray-600">How well did you know this?</h3>
                <div className="flashcard-grade-buttons">
                  <button 
                    className="flashcard-grade-button flashcard-grade-again"
                    onClick={() => handleGrade('again')}
                  >
                    Again
                  </button>
                  <button 
                    className="flashcard-grade-button flashcard-grade-hard"
                    onClick={() => handleGrade('hard')}
                  >
                    Hard
                  </button>
                  <button 
                    className="flashcard-grade-button flashcard-grade-good"
                    onClick={() => handleGrade('good')}
                  >
                    Good
                  </button>
                  <button 
                    className="flashcard-grade-button flashcard-grade-easy"
                    onClick={() => handleGrade('easy')}
                  >
                    Easy
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard; 