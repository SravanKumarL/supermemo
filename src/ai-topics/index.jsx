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
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import "../supermemo-tree.css"; // Import SuperMemo tree styles
import { generateTopics, createTopicTreeNodes, generateSubTopics, generateFlashcards, generateSubTopicFlashcards } from "./ai-service";

/**
 * Predefined prompt suggestions to help users get started quickly
 * @type {Array<string>}
 */
const PROMPT_SUGGESTIONS = [
  "Quantum physics",
  "Machine learning",
  "Neural networks",
  "Blockchain",
  "Cryptocurrency",
  "Psychology",
  "Cognitive psychology",
  "Chemistry",
  "Organic chemistry",
  "World history",
  "Ancient civilizations",
  "Astronomy",
  "Astrophysics",
  "Biology",
  "Genetics"
];

// Add this new component to simulate text diffusion effect
const TextDiffusion = ({ finalText, duration = 1.5 }) => {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/';
  
  useEffect(() => {
    if (!finalText) return;
    
    let iterations = 0;
    const maxIterations = 15;  // Increased from 10 to 15 for slower animation
    const interval = Math.floor(duration * 1000 / maxIterations);
    
    const scrambleText = () => {
      if (iterations >= maxIterations) {
        setDisplayText(finalText);
        return;
      }
      
      // Calculate how much of the final text to reveal based on current iteration
      const progress = iterations / maxIterations;
      const revealLength = Math.ceil(finalText.length * progress);
      
      // Create scrambled text with progressively more correct characters
      let result = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealLength) {
          // Revealed part shows the correct character
          result += finalText[i];
        } else {
          // Unrevealed part shows random character
          const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
          result += randomChar;
        }
      }
      
      setDisplayText(result);
      iterations++;
    };
    
    // Initial scramble
    scrambleText();
    
    // Set up interval for animation
    const timer = setInterval(scrambleText, interval);
    
    return () => clearInterval(timer);
  }, [finalText, duration]);
  
  return <>{displayText}</>;
};

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
  const [generatedTreeData, setGeneratedTreeData] = useState(null);
  const [showGenerationView, setShowGenerationView] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState({
    topics: [],
    subTopics: {},
    flashcards: {}
  });
  
  // Refs for auto-scrolling
  const generationContainerRef = useRef(null);
  const lastTopicRef = useRef(null);
  const lastSubtopicRefs = useRef({});
  const lastFlashcardRefs = useRef({});

  // Effect for auto-scrolling to the most recently added items
  useEffect(() => {
    if (lastTopicRef.current) {
      lastTopicRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [generationProgress.topics.length]);

  useEffect(() => {
    const topicIds = Object.keys(generationProgress.subTopics);
    if (topicIds.length > 0) {
      const lastTopicId = topicIds[topicIds.length - 1];
      if (lastSubtopicRefs.current[lastTopicId]) {
        lastSubtopicRefs.current[lastTopicId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [generationProgress.subTopics]);

  useEffect(() => {
    const topicIds = Object.keys(generationProgress.flashcards);
    if (topicIds.length > 0) {
      const lastTopicId = topicIds[topicIds.length - 1];
      if (lastFlashcardRefs.current[lastTopicId]) {
        lastFlashcardRefs.current[lastTopicId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [generationProgress.flashcards]);

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
      
      // Store the suggested topics (limit to 5)
      const limitedTopics = topics.slice(0, 5);
      setSuggestedTopics(limitedTopics);
      
      // Select all topics by default (store just the IDs)
      const topicIds = limitedTopics.map(topic => topic.id);
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
   * Shows the animated generation of the learning map
   */
  const handleStartGeneration = async () => {
    if (selectedTopics.length === 0) {
      console.warn("No topics selected, cannot add to tree");
      return;
    }
    
    console.log("Starting generation animation with selected topic IDs:", selectedTopics);
    
    setIsLoading(true);
    setShowGenerationView(true);
    setGenerationStep(1);
    // Reset the tree data to avoid stale data
    setGeneratedTreeData(null);
    
    try {
      // Create a map of ID strings to make lookup faster
      const selectedIdsSet = new Set(selectedTopics.map(id => String(id)));
      
      // Filter selected topics
      const topicsToAdd = suggestedTopics.filter(topic => 
        selectedIdsSet.has(String(topic.id))
      );
      
      console.log("Topics selected to add:", topicsToAdd);
      
      if (topicsToAdd.length === 0) {
        console.error("No matching topics found to add despite having selected topics");
        setIsLoading(false);
        setShowGenerationView(false);
        return;
      }
      
      // Reset refs for auto-scrolling
      lastSubtopicRefs.current = {};
      lastFlashcardRefs.current = {};
      
      // First create the full topic nodes to ensure consistency
      const generatedNodes = [];
      
      // Start animating topic generation
      // Process topics in parallel to speed up
      await Promise.all(topicsToAdd.map(async (topic, topicIndex) => {
        // Add a slight delay between each topic to make the animation visible
        await new Promise(resolve => setTimeout(resolve, 1200 * topicIndex));
        
        // Add this topic to the progress
        setGenerationProgress(prev => ({
          ...prev,
          topics: [...prev.topics, topic]
        }));
        
        // Generate sub-topics for this topic
        const subTopics = await generateSubTopics(topic);
        
        // Only show a limited number of subtopics (maximum 3)
        const limitedSubTopics = subTopics.slice(0, 3);
        
        // Wait a moment before showing subtopics
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update all subtopics at once to speed up the animation
        setGenerationProgress(prev => ({
          ...prev,
          subTopics: {
            ...prev.subTopics,
            [topic.id]: limitedSubTopics
          }
        }));
        
        // Create array to hold sub-topic nodes with their flashcards
        const subTopicNodes = [];
        setGenerationStep(2);
        
        // Wait a moment before showing flashcards
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For each subtopic, generate and add a limited number of flashcards
        await Promise.all(limitedSubTopics.map(async (subTopic, subTopicIndex) => {
          // Add a delay between each subtopic's flashcards
          await new Promise(resolve => setTimeout(resolve, 600 * subTopicIndex));
          
          // Generate flashcards but only use a few
          const flashcards = await generateSubTopicFlashcards(subTopic, topic);
          const limitedFlashcards = flashcards.slice(0, 2); // Only keep 2 flashcards
          
          // Update flashcards state
          setGenerationProgress(prev => ({
            ...prev,
            flashcards: {
              ...prev.flashcards,
              [topic.id]: {
                ...prev.flashcards[topic.id],
                [subTopic.title]: limitedFlashcards
              }
            }
          }));
          
          // Create sub-topic node with limited flashcards as children
          const subTopicNode = {
            title: subTopic.title,
            type: "sub-topic",
            category: subTopic.category,
            content: subTopic.description || "",
            expanded: true,
            children: limitedFlashcards.map(card => ({
              ...card,
              id: card.id || Math.random().toString(36).substr(2, 9)
            }))
          };
          
          subTopicNodes.push(subTopicNode);
        }));
        
        // Add just 1 general flashcard for overview
        const generalFlashcards = await generateFlashcards(topic);
        const singleGeneralFlashcard = generalFlashcards.slice(0, 1);
        
        setGenerationProgress(prev => ({
          ...prev,
          flashcards: {
            ...prev.flashcards,
            [topic.id]: {
              ...prev.flashcards[topic.id],
              overview: singleGeneralFlashcard
            }
          }
        }));
        
        const generalFlashcardsNode = {
          title: "Overview",
          type: "sub-topic",
          category: topic.category,
          content: "General concepts and principles of the topic.",
          expanded: true,
          children: singleGeneralFlashcard.map(card => ({
            ...card,
            id: card.id || Math.random().toString(36).substr(2, 9)
          }))
        };
        
        // Create topic node with sub-topics as children
        const topicNode = {
          title: topic.title,
          type: "topic",
          category: topic.category,
          content: topic.description || "",
          expanded: true,
          author: "AI Assistant",
          timestamp: new Date().toISOString().split('T')[0],
          children: [generalFlashcardsNode, ...subTopicNodes]
        };
        
        // Store the generated node
        generatedNodes.push(topicNode);
      }));
      
      console.log("Generated tree nodes:", generatedNodes);
      
      // Set the entire tree data at once to ensure consistency
      setGeneratedTreeData(generatedNodes);
      
      // Set generation step to completed
      setGenerationStep(3);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error generating topics:", error);
      setIsLoading(false);
      setShowGenerationView(false);
    }
  };

  /**
   * Confirms and adds the generated topics to the tree
   */
  const handleConfirmAddition = () => {
    console.log("handleConfirmAddition called");
    console.log("Generated tree data:", generatedTreeData);
    
    if (!generatedTreeData || generatedTreeData.length === 0) {
      console.error("No topic nodes were created to confirm");
      return;
    }
    
    try {
      // Generate a parent topic name based on the selected topics
      let parentTopicName;
      if (generatedTreeData.length === 1) {
        parentTopicName = generatedTreeData[0].title;
      } else if (generatedTreeData.length === 2) {
        parentTopicName = `${generatedTreeData[0].title} and ${generatedTreeData[1].title}`;
      } else {
        // Use the first topic and indicate there are more
        parentTopicName = `${generatedTreeData[0].title} and related topics`;
      }
      
      console.log("Creating parent topic:", parentTopicName);
      console.log("Number of topics to add:", generatedTreeData.length);
      console.log("onAddTopics function type:", typeof onAddTopics);
      
      // Ensure all nodes have proper IDs before adding to the main tree
      const childNodes = generatedTreeData.map((topicNode, index) => {
        // Create a unique ID for the topic if it doesn't have one
        const topicId = topicNode.id || `topic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`Processing topic ${index + 1}/${generatedTreeData.length}: ${topicNode.title} (ID: ${topicId})`);
        
        // Process children (sub-topics)
        const children = (topicNode.children || []).map((subTopic, subIndex) => {
          // Create a unique ID for the sub-topic
          const subTopicId = subTopic.id || `subtopic-${topicId}-${Math.random().toString(36).substring(2, 9)}`;
          console.log(`  Processing subtopic ${subIndex + 1}: ${subTopic.title} (ID: ${subTopicId})`);
          
          // Process flashcards within this sub-topic
          const flashcards = (subTopic.children || []).map((flashcard, flashIndex) => {
            // Ensure each flashcard has an ID
            const flashcardId = flashcard.id || `flashcard-${subTopicId}-${Math.random().toString(36).substring(2, 9)}`;
            console.log(`    Processing flashcard ${flashIndex + 1}: ${flashcard.title} (ID: ${flashcardId})`);
            
            return {
              ...flashcard,
              id: flashcardId,
              type: "flashcard", // Ensure type is set correctly
              isNew: true, // Mark as new for highlighting
              highlightUntil: Date.now() + (20 * 1000) // Highlight for 20 seconds
            };
          });
          
          // Return sub-topic with ID and processed flashcards
          return {
            ...subTopic,
            id: subTopicId,
            type: "sub-topic", // Ensure type is set correctly
            children: flashcards,
            isNew: true, // Mark as new for highlighting
            highlightUntil: Date.now() + (20 * 1000) // Highlight for 20 seconds
          };
        });
        
        // Return topic with ID and processed children
        return {
          ...topicNode,
          id: topicId,
          type: "topic", // Ensure type is set correctly
          children: children,
          isNew: true, // Mark as new for highlighting
          highlightUntil: Date.now() + (20 * 1000) // Highlight for 20 seconds
        };
      });
      
      // Create a single parent topic that contains all the generated topics as children
      const mainParentTopic = {
        title: parentTopicName,
        type: "topic",
        category: generatedTreeData[0].category || "Learning Map",
        content: `A collection of topics related to ${parentTopicName}.`,
        expanded: true, // Ensure the main parent is expanded
        author: "AI Assistant",
        timestamp: new Date().toISOString().split('T')[0],
        id: `main-topic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        children: childNodes,
        isNew: true, // Mark the parent topic as new too
        highlightUntil: Date.now() + (20 * 1000) // Highlight for 20 seconds
      };
      
      // Recursively ensure all nodes are marked as expanded
      const ensureExpanded = (node) => {
        if (!node) return node;
        
        // Set expanded flag on this node
        node.expanded = true;
        
        // Process children recursively
        if (node.children && Array.isArray(node.children)) {
          node.children = node.children.map(ensureExpanded);
        }
        
        return node;
      };
      
      // Apply the expanded flags to our topic tree
      const expandedTopic = ensureExpanded(mainParentTopic);
      
      // Add detailed debug info
      console.log("========== TOPIC TREE DATA ==========");
      console.log("Adding topics under a single parent topic:", expandedTopic.title);
      console.log("Parent topic ID:", expandedTopic.id);
      console.log("Child topic count:", expandedTopic.children.length);
      console.log("Full structure:", JSON.stringify(expandedTopic, null, 2));
      
      // Pass the parent topic to the parent component
      if (typeof onAddTopics !== 'function') {
        console.error("onAddTopics is not a function:", onAddTopics);
        alert("Error: The add topics function is not available. Please try again later.");
        return;
      }
      
      // Create a standalone copy of the topic structure to avoid any reference issues
      const topicToAdd = JSON.parse(JSON.stringify(expandedTopic));
      
      try {
        console.log("Calling onAddTopics with:", [topicToAdd]);
        
        // Double-check that we have valid data
        if (!topicToAdd || !topicToAdd.id || !topicToAdd.title) {
          console.error("Invalid topic data - missing required fields");
          console.log("Attempting to fix data structure...");
          
          // Create a minimal valid structure if needed
          const fixedTopic = {
            ...topicToAdd,
            id: topicToAdd.id || `main-topic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: topicToAdd.title || "Learning Map",
            type: "topic",
            expanded: true,
            children: topicToAdd.children || []
          };
          
          console.log("Fixed topic to add:", fixedTopic);
          onAddTopics([fixedTopic]);
        } else {
          // Call the parent function with the original data
          onAddTopics([topicToAdd]);
        }
        
        console.log("Topics successfully passed to parent component");
        
        // Delay closing to ensure state updates are processed
        setTimeout(() => {
          console.log("Closing modal after successful topic addition");
          onClose();
        }, 500);
      } catch (error) {
        console.error("Error in onAddTopics:", error);
        alert(`There was an error adding the topics: ${error.message}. Please try again.`);
      }
    } catch (error) {
      console.error("Error adding topics to tree:", error);
      alert(`Error processing topics: ${error.message}. Please try again.`);
    }
  };

  /**
   * Cancels the topic addition and returns to selection
   */
  const handleCancelAddition = () => {
    setShowGenerationView(false);
    setGenerationStep(0);
    setGeneratedTreeData(null);
    setGenerationProgress({
      topics: [],
      subTopics: {},
      flashcards: {}
    });
  };

  // Render the animated generation view
  const renderGenerationView = () => {
    return (
      <div className="generation-view">
        <h3>Generating Learning Map</h3>
        
        <div className="generation-container supermemo-tree-content" ref={generationContainerRef}>
          {generationProgress.topics.map((topic, topicIndex) => {
            const isLastTopic = topicIndex === generationProgress.topics.length - 1;
            return (
              <motion.div 
                key={topic.id}
                className="generated-topic supermemo-node"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 2.0,
                  ease: "easeOut"
                }}
                ref={isLastTopic ? lastTopicRef : null}
              >
                <div className="supermemo-node-content">
                  <div className="supermemo-node-title-container">
                    <div className="supermemo-node-icon supermemo-topic-icon">T</div>
                    <div className="supermemo-node-title">
                      <TextDiffusion finalText={topic.title} duration={2.5} />
                    </div>
                    {topic.category && (
                      <div className="supermemo-node-category">
                        <TextDiffusion finalText={topic.category} duration={2.0} />
                      </div>
                    )}
                  </div>
                </div>
                
                {generationProgress.subTopics[topic.id] && (
                  <div className="generated-subtopics" style={{ marginLeft: "24px" }}>
                    {generationProgress.subTopics[topic.id].map((subTopic, subTopicIndex) => {
                      const isLastSubtopic = subTopicIndex === (generationProgress.subTopics[topic.id]?.length || 0) - 1;
                      
                      if (isLastSubtopic) {
                        lastSubtopicRefs.current[topic.id] = null;
                      }
                      
                      return (
                        <motion.div 
                          key={`${topic.id}-${subTopic.title}`}
                          className="generated-subtopic supermemo-node"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 1.5,
                            ease: "easeOut",
                            delay: 0.5 + (subTopicIndex * 0.4)
                          }}
                          ref={isLastSubtopic ? (el) => {
                            lastSubtopicRefs.current[topic.id] = el;
                          } : null}
                        >
                          <div className="supermemo-node-content">
                            <div className="supermemo-node-title-container">
                              <div className="supermemo-node-icon supermemo-topic-icon" style={{ fontSize: "0.7rem" }}>ST</div>
                              <div className="supermemo-node-title">
                                <TextDiffusion finalText={subTopic.title} duration={2.0} />
                              </div>
                            </div>
                          </div>
                          
                          {generationProgress.flashcards[topic.id] && 
                           generationProgress.flashcards[topic.id][subTopic.title] && (
                            <div className="generated-flashcards" style={{ marginLeft: "24px" }}>
                              {generationProgress.flashcards[topic.id][subTopic.title].map((flashcard, flashcardIndex) => {
                                const isLastFlashcard = flashcardIndex === (generationProgress.flashcards[topic.id][subTopic.title]?.length || 0) - 1;
                                
                                if (isLastFlashcard) {
                                  lastFlashcardRefs.current[topic.id] = null;
                                }
                                
                                return (
                                  <motion.div 
                                    key={flashcard.id || `${topic.id}-${subTopic.title}-${flashcardIndex}`}
                                    className="generated-flashcard supermemo-node"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ 
                                      duration: 1.2,
                                      ease: "easeOut",
                                      delay: 0.8 + (flashcardIndex * 0.5)
                                    }}
                                    ref={isLastFlashcard ? (el) => {
                                      lastFlashcardRefs.current[topic.id] = el;
                                    } : null}
                                  >
                                    <div className="supermemo-node-content">
                                      <div className="supermemo-node-title-container">
                                        <div className="supermemo-node-icon supermemo-flashcard-icon" style={{ fontSize: "0.7rem" }}>F</div>
                                        <div className="supermemo-node-title">
                                          <TextDiffusion finalText={flashcard.title} duration={1.8} />
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                    
                    {/* Overview flashcards */}
                    {generationProgress.flashcards[topic.id] && 
                     generationProgress.flashcards[topic.id].overview && (
                      <motion.div 
                        className="generated-subtopic supermemo-node"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 1.0,
                          ease: "easeOut",
                          delay: 0.3 + (generationProgress.subTopics[topic.id]?.length || 0) * 0.2
                        }}
                      >
                        <div className="supermemo-node-content">
                          <div className="supermemo-node-title-container">
                            <div className="supermemo-node-icon supermemo-topic-icon" style={{ fontSize: "0.7rem" }}>OV</div>
                            <div className="supermemo-node-title">
                              <TextDiffusion finalText="Overview" duration={1.0} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="generated-flashcards" style={{ marginLeft: "24px" }}>
                          {generationProgress.flashcards[topic.id].overview.map((flashcard, flashcardIndex) => (
                            <motion.div 
                              key={flashcard.id || `${topic.id}-overview-${flashcardIndex}`}
                              className="generated-flashcard supermemo-node"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                duration: 0.8,
                                ease: "easeOut",
                                delay: 0.5 + (flashcardIndex * 0.3)
                              }}
                            >
                              <div className="supermemo-node-content">
                                <div className="supermemo-node-title-container">
                                  <div className="supermemo-node-icon supermemo-flashcard-icon" style={{ fontSize: "0.7rem" }}>F</div>
                                  <div className="supermemo-node-title">
                                    <TextDiffusion finalText={flashcard.title} duration={1.0} />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {generationStep === 3 && generatedTreeData && (
          <div className="action-buttons">
            <button 
              className="secondary-button" 
              onClick={handleCancelAddition}
              disabled={isLoading}
            >
              Back to Selection
            </button>
            <button 
              className="primary-button"
              onClick={handleConfirmAddition}
              disabled={isLoading}
            >
              Confirm and Add as Learning Map
            </button>
          </div>
        )}
        
        {generationStep < 3 && (
          <div className="generation-status">
            <div className="loading-spinner"></div>
            <p>{generationStep === 1 ? "Generating topics..." : "Creating subtopics & flashcards..."}</p>
          </div>
        )}
      </div>
    );
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
        
        {/* Content Section - Conditionally shows either prompt input, topic selection, or generation view */}
        <div className="ai-topics-content">
          {showGenerationView ? (
            renderGenerationView()
          ) : suggestedTopics.length === 0 ? (
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
                  onClick={handleStartGeneration}
                  disabled={isLoading || selectedTopics.length === 0}
                >
                  Generate {selectedTopics.length} {selectedTopics.length === 1 ? 'Topic' : 'Topics'}
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