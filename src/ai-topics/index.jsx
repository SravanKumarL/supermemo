/**
 * AI Topics Component
 * 
 * A modal interface that allows users to generate and select AI-suggested learning topics
 * based on a prompt. Selected topics can be added to the learning tree.
 * 
 * Features:
 * - Prompt suggestions for quick topic generation
 * - AI-generated topic suggestions
 * - Selection of which topics to add to the tree
 * - Automatic flashcard generation for selected topics
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import { generateTopics, createTopicTreeNodes } from "./ai-service";

/**
 * Predefined prompt suggestions to help users get started quickly
 * @type {Array<string>}
 */
const PROMPT_SUGGESTIONS = [
  "Quantum physics",
  "Machine learning",
  "Blockchain",
  "Psychology",
  "Chemistry",
  "World history",
  "Astronomy"
];

/**
 * AI Topics Modal Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onAddTopics - Function to call with generated topic nodes when adding to tree
 * @returns {JSX.Element} The AI Topics modal component
 */
function AITopics({ onClose, onAddTopics }) {
  // State management
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  /**
   * Handles clicking on a prompt suggestion by setting it as the current prompt
   * @param {string} suggestion - The suggestion text to use
   */
  const handleSuggestionClick = (suggestion) => {
    setPrompt(`I want to learn about ${suggestion}`);
  };

  /**
   * Handles submission of the prompt to generate topics
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call AI service to generate topics
      const topics = await generateTopics(prompt);
      
      console.log("Topics generated from prompt:", topics);
      
      // Store the suggested topics
      setSuggestedTopics(topics);
      
      // Select all topics by default (store just the IDs)
      const topicIds = topics.map(topic => topic.id);
      setSelectedTopics(topicIds);
      
      console.log("Selected topic IDs:", topicIds);
    } catch (error) {
      console.error("Error generating topics:", error);
      // Handle error - could show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles selection state of a topic 
   * @param {number|string} topicId - ID of the topic to toggle
   */
  const toggleTopic = (topicId) => {
    // Convert to string for consistent comparison
    const topicIdStr = String(topicId);
    
    setSelectedTopics(prev => {
      // Convert all IDs to strings for comparison
      const prevAsStrings = prev.map(id => String(id));
      
      // Check if this ID is already in the selection
      const isAlreadySelected = prevAsStrings.includes(topicIdStr);
      
      console.log(`Topic ${topicIdStr} (${isAlreadySelected ? 'selected' : 'not selected'}) is being ${isAlreadySelected ? 'removed' : 'added'}`);
      
      if (isAlreadySelected) {
        // Remove this ID
        return prev.filter(id => String(id) !== topicIdStr);
      } else {
        // Add this ID
        return [...prev, topicId];
      }
    });
  };

  /**
   * Processes selected topics, generates flashcards, and adds them to the tree
   */
  const handleAddTopics = async () => {
    if (selectedTopics.length === 0) {
      console.warn("No topics selected, cannot add to tree");
      return;
    }
    
    console.log("Starting handleAddTopics with selected topic IDs:", selectedTopics);
    
    setIsLoading(true);
    
    try {
      // Create a map of ID strings to make lookup faster
      const selectedIdsSet = new Set(selectedTopics.map(id => String(id)));
      
      // Filter selected topics
      const topicsToAdd = suggestedTopics.filter(topic => 
        selectedIdsSet.has(String(topic.id))
      );
      
      console.log("Topics selected to add:", topicsToAdd);
      console.log("Number of topics to add:", topicsToAdd.length);
      
      if (topicsToAdd.length === 0) {
        console.error("No matching topics found to add despite having selected topics");
        setIsLoading(false);
        return;
      }
      
      // Create topic tree nodes with flashcards
      const topicNodes = await createTopicTreeNodes(topicsToAdd);
      
      console.log("Topic nodes created, passing to parent:", topicNodes);
      console.log("Number of topic nodes created:", topicNodes.length);
      
      if (!topicNodes || topicNodes.length === 0) {
        console.error("No topic nodes were created");
        setIsLoading(false);
        return;
      }
      
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
        {/* Header Section */}
        <div className="ai-topics-header">
          <h2>Generate Learning Map</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Content Section - Conditionally shows either prompt input or topic selection */}
        <div className="ai-topics-content">
          {suggestedTopics.length === 0 ? (
            /* Prompt Input View */
            <div className="prompt-container">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to learn about quantum physics and understand its fundamental principles"
                  rows="4"
                  className="prompt-input"
                />
              
                {/* Prompt suggestion bubbles for quick selection */}
                <div className="prompt-suggestion-bubbles">
                  <div className="suggestion-bubbles">
                    {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="suggestion-bubble"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="generate-button"
                  disabled={isLoading || !prompt.trim()}
                >
                  Generate Map
                </button>
              </form>
            </div>
          ) : (
            /* Topic Selection View */
            <div className="topics-result">
              <h3>Suggested Topics</h3>
              <p className="selection-instruction">Select topics you want to add to your learning tree:</p>
              
              {/* Interactive topic selection bubbles */}
              <div className="topic-bubbles">
                {suggestedTopics.map(topic => {
                  // Consistent conversion for comparison
                  const isSelected = selectedTopics.some(id => String(id) === String(topic.id));
                  return (
                    <div 
                      key={topic.id}
                      className={`topic-bubble ${isSelected ? 'selected' : 'unselected'}`}
                      onClick={() => toggleTopic(topic.id)}
                    >
                      {topic.title}
                      {isSelected ? (
                        <span className="check-mark">✓</span>
                      ) : (
                        <span className="uncheck-mark" style={{ color: 'red', marginLeft: '4px' }}>×</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Action buttons for topic selection view */}
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
                  Add {selectedTopics.length} {selectedTopics.length === 1 ? 'Topic' : 'Topics'}
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