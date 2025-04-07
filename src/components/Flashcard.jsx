import React, { useState } from 'react';
import MDEditor from "@uiw/react-md-editor";

const Flashcard = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswered(true);
  };
  
  const handleGrade = (grade) => {
    // This would normally update spaced repetition algorithm
    // For now we just reset the card
    setShowAnswer(false);
    setAnswered(false);
  };
  
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
      
      {/* Answer Section */}
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
      
      {/* Control Section */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard; 