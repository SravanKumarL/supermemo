import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import { generateTopics, createTopicTreeNodes } from "./ai-service";

function AITopics({ onClose, onAddTopics }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Handle prompt submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call AI service to generate topics
      const topics = await generateTopics(prompt);
      
      setSuggestedTopics(topics);
      setSelectedTopics(topics.map(topic => topic.id)); // Select all by default
    } catch (error) {
      console.error("Error generating topics:", error);
      // Handle error - could show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle topic selection
  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Handle adding topics to the tree
  const handleAddTopics = async () => {
    if (selectedTopics.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Filter selected topics
      const topicsToAdd = suggestedTopics.filter(topic => 
        selectedTopics.includes(topic.id)
      );
      
      // Create topic tree nodes with flashcards
      const topicNodes = await createTopicTreeNodes(topicsToAdd);
      
      // Pass the created nodes to the parent component
      onAddTopics(topicNodes);
      onClose();
    } catch (error) {
      console.error("Error adding topics:", error);
      setIsLoading(false);
      // Handle error - could show an error message to the user
    }
  };

  return (
    <div className="ai-topics-overlay">
      <motion.div 
        className="ai-topics-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="ai-topics-header">
          <h2>Create Topics with AI</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="ai-topics-content">
          {suggestedTopics.length === 0 ? (
            <div className="prompt-container">
              <p className="ai-instruction">Ask me what you want to learn about, and I'll suggest topics and create flashcards for you.</p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to learn about quantum physics and understand its fundamental principles"
                  rows="4"
                  className="prompt-input"
                />
                <button 
                  type="submit" 
                  className="generate-button"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>Generate Topics</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="topics-result">
              <h3>Suggested Topics</h3>
              <p className="selection-instruction">Select topics you want to add to your learning tree:</p>
              
              <div className="topic-bubbles">
                {suggestedTopics.map(topic => (
                  <div 
                    key={topic.id}
                    className={`topic-bubble ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    {topic.title}
                    {selectedTopics.includes(topic.id) && (
                      <span className="check-mark">✓</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="secondary-button" 
                  onClick={() => {
                    setSuggestedTopics([]);
                    setSelectedTopics([]);
                    setPrompt("");
                  }}
                  disabled={isLoading}
                >
                  Start Over
                </button>
                <button 
                  className="primary-button"
                  onClick={handleAddTopics}
                  disabled={isLoading || selectedTopics.length === 0}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>Add {selectedTopics.length} Topics</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AITopics; 