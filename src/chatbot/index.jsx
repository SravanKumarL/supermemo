import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { normalizeTreeData } from "../shared";
import { changeNodeAtPath, addNodeUnderParent } from "@nosferatu500/react-sortable-tree";

const ChatBot = ({ onTopicsConfirmed, treeData, onTreeDataChange, stage, setStage, inTreeView = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions] = useState([
    "Explain the solar system to me",
    "How does gravity work?",
    "What are the basic principles of quantum mechanics?",
    "Tell me about photosynthesis",
    "I want to learn about neural networks",
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const localStage = stage || "input"; // Use provided stage or default to "input"
  const inputRef = useRef(null);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const customTopicInputRef = useRef(null);
  const [showCustomTopicSection, setShowCustomTopicSection] = useState(false);
  
  // New states for sequential topic addition
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(-1);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [targetContent, setTargetContent] = useState("");
  const [contentProgress, setContentProgress] = useState(0);
  const [currentPath, setCurrentPath] = useState("");

  // Update App component with the current path for tree highlighting
  useEffect(() => {
    if (window.updateCurrentPath && currentPath) {
      window.updateCurrentPath(currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    if (localStage === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [localStage]);

  // Text diffusion animation effect
  useEffect(() => {
    if (generatingContent && contentProgress < 100) {
      const timer = setTimeout(() => {
        const newProgress = Math.min(contentProgress + 5, 100);
        setContentProgress(newProgress);
        
        // Calculate how much of the target content to show based on progress
        const length = Math.floor((targetContent.length * newProgress) / 100);
        setCurrentContent(targetContent.substring(0, length));
        
        if (newProgress === 100) {
          // Once content generation is complete, move to next flashcard or topic
          setTimeout(() => {
            setGeneratingContent(false);
            
            if (localStage === "adding") {
              if (currentFlashcardIndex >= 0) {
                // If we just finished a flashcard, add it to the tree
                addFlashcardToTree();
              }
              
              if (currentFlashcardIndex < selectedTopics[currentTopicIndex].flashcards.length - 1) {
                // Move to next flashcard in current topic
                setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                startContentGeneration();
              } else {
                // Move to next topic
                if (currentTopicIndex < selectedTopics.length - 1) {
                  setCurrentTopicIndex(currentTopicIndex + 1);
                  setCurrentFlashcardIndex(-1);
                  startContentGeneration();
                } else {
                  // All topics added, complete the process
                  if (setStage) {
                    setStage("complete");
                  }
                  
                  // Notify parent that topics have been added
                  if (onTopicsConfirmed) {
                    onTopicsConfirmed(selectedTopics);
                  }
                }
              }
            }
          }, 500);
        }
      }, 50); // Speed of the animation
      
      return () => clearTimeout(timer);
    }
  }, [generatingContent, contentProgress, targetContent, localStage, currentTopicIndex, currentFlashcardIndex, selectedTopics]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(e.target.value === "");
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    // Simulate processing
    setTimeout(() => processInput(suggestion), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processInput(inputValue);
    }
  };

  const processInput = (input) => {
    // This would typically be an API call to an LLM
    // For demo purposes, we'll just simulate it
    if (setStage) {
      setStage("processing");
    }
    
    setTimeout(() => {
      // Simulated response - in a real implementation this would come from the LLM
      let topics = [];
      let mainCategory = "";
      
      if (input.toLowerCase().includes("solar system")) {
        topics = ["Solar System", "Planets", "Orbital Mechanics", "Astronomy", "Astrophysics"];
        mainCategory = "Astronomy";
      } else if (input.toLowerCase().includes("gravity")) {
        topics = ["Gravity", "Newton's Laws", "General Relativity", "Physics", "Orbital Mechanics"];
        mainCategory = "Physics";
      } else if (input.toLowerCase().includes("quantum")) {
        topics = ["Quantum Mechanics", "Wave-Particle Duality", "Uncertainty Principle", "Quantum Field Theory"];
        mainCategory = "Physics";
      } else if (input.toLowerCase().includes("photosynthesis")) {
        topics = ["Photosynthesis", "Cellular Respiration", "Plant Biology", "Chlorophyll", "Botany"];
        mainCategory = "Biology";
      } else if (input.toLowerCase().includes("neural network")) {
        topics = ["Neural Networks", "Deep Learning", "Artificial Intelligence", "Machine Learning", "Data Science"];
        mainCategory = "Computer Science";
      } else {
        // Generic topics if no specific keywords match
        topics = ["Science", "Physics", "Biology", "Chemistry", "Mathematics", "Computer Science"];
        mainCategory = "Science";
      }
      
      // Generate some topic-specific flashcards
      const topicsWithMetadata = topics.map(topic => ({
        title: topic,
        category: mainCategory,
        flashcards: generateFlashcardsForTopic(topic)
      }));
      
      setSuggestedTopics(topicsWithMetadata);
      setSelectedTopics(topicsWithMetadata); // By default, all topics are selected
      // Set the default category for custom topics based on the main category
      setCustomCategory(mainCategory);
      // Reset the custom topic section visibility
      setShowCustomTopicSection(false);
      if (setStage) {
        setStage("topics");
      }
    }, 1500);
  };

  // Generate flashcards based on topic (simulated content)
  const generateFlashcardsForTopic = (topic) => {
    const flashcards = [];
    
    // Simulate 1-3 flashcards per topic
    const numFlashcards = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numFlashcards; i++) {
      let flashcard = {
        type: "flashcard",
        category: topic,
        author: "AI Assistant",
        timestamp: new Date().toISOString().split('T')[0],
        source: "Generated by AI",
      };
      
      // Topic-specific flashcard content
      switch (topic) {
        case "Solar System":
          flashcard.title = ["Order of Planets", "Solar System Formation", "Dwarf Planets"][i % 3];
          flashcard.question = ["What is the order of planets from the Sun?", "How did the Solar System form?", "What are the dwarf planets in our Solar System?"][i % 3];
          flashcard.answer = [
            "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
            "The Solar System formed from a giant cloud of gas and dust that collapsed under its gravity about 4.6 billion years ago.",
            "The five recognized dwarf planets are Ceres, Pluto, Haumea, Makemake, and Eris."
          ][i % 3];
          break;
        case "Quantum Mechanics":
          flashcard.title = ["Schrödinger's Equation", "Heisenberg Uncertainty", "Wave-Particle Duality"][i % 3];
          flashcard.question = ["What is Schrödinger's Equation?", "What is Heisenberg's Uncertainty Principle?", "What is wave-particle duality?"][i % 3];
          flashcard.answer = [
            "Schrödinger's Equation describes how the quantum state of a physical system changes over time.",
            "The Heisenberg Uncertainty Principle states that the position and momentum of a particle cannot be simultaneously measured with high precision.",
            "Wave-particle duality states that every particle or quantum entity may be described as either a particle or a wave, depending on the experiment."
          ][i % 3];
          break;
        case "Neural Networks":
          flashcard.title = ["Activation Functions", "Backpropagation", "Types of Neural Networks"][i % 3];
          flashcard.question = ["What are activation functions in neural networks?", "What is backpropagation?", "What are the main types of neural networks?"][i % 3];
          flashcard.answer = [
            "Activation functions determine the output of a neural network node, introducing non-linear properties to the network. Common ones include ReLU, Sigmoid, and Tanh.",
            "Backpropagation is an algorithm for training neural networks by calculating gradients of the loss function with respect to the weights, allowing the network to learn from errors.",
            "Main types include Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), Feedforward Neural Networks, and Transformers."
          ][i % 3];
          break;
        default:
          flashcard.title = `${topic} Concept ${i+1}`;
          flashcard.question = `What is an important concept in ${topic}?`;
          flashcard.answer = `This is a key concept in ${topic} that would be explained in detail by the AI in a real implementation.`;
      }
      
      // Add content field for compatibility with existing app
      flashcard.content = `${flashcard.question}\n---\n${flashcard.answer}`;
      
      flashcards.push(flashcard);
    }
    
    return flashcards;
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (customTopicInput.trim()) {
      // Create a new topic with the custom name
      const newCustomTopic = {
        title: customTopicInput.trim(),
        category: customCategory || "Custom",
        flashcards: []
      };
      
      // Add to suggested and selected topics
      setSuggestedTopics([...suggestedTopics, newCustomTopic]);
      setSelectedTopics([...selectedTopics, newCustomTopic]);
      
      // Clear the input
      setCustomTopicInput("");
      
      // Focus back on the input for easy addition of multiple topics
      if (customTopicInputRef.current) {
        customTopicInputRef.current.focus();
      }
    }
  };

  const handleTopicsConfirm = () => {
    if (selectedTopics.length > 0) {
      // Initialize the sequential addition of topics
      setCurrentTopicIndex(0);
      setCurrentFlashcardIndex(-1);
      if (setStage) {
        setStage("adding");
      }
      startContentGeneration();
    }
  };

  // Start the content generation animation for the current topic/flashcard
  const startContentGeneration = () => {
    const currentTopic = selectedTopics[currentTopicIndex];
    
    if (currentFlashcardIndex === -1) {
      // Generating the topic content
      const content = `${currentTopic.title} is a key concept in ${currentTopic.category}.`;
      setTargetContent(content);
      setCurrentContent("");
      setContentProgress(0);
      setGeneratingContent(true);
      
      // Set the path in the tree where this topic is being added
      const path = `${currentTopic.category} > ${currentTopic.title}`;
      setCurrentPath(path);
      
      // Make the path available to the App component through the window object
      if (window.updateCurrentPath) {
        window.updateCurrentPath(path);
      }
      
      // Add the topic to the tree
      addTopicToTree(currentTopic);
    } else {
      // Generating flashcard content
      const flashcard = currentTopic.flashcards[currentFlashcardIndex];
      setTargetContent(flashcard.content);
      setCurrentContent("");
      setContentProgress(0);
      setGeneratingContent(true);
      
      // Set the path in the tree where this flashcard is being added
      const path = `${currentTopic.category} > ${currentTopic.title} > ${flashcard.title}`;
      setCurrentPath(path);
      
      // Make the path available to the App component
      if (window.updateCurrentPath) {
        window.updateCurrentPath(path);
      }
    }
  };

  // Add a single topic to the tree
  const addTopicToTree = (topic) => {
    // Clone the current tree data to work with
    let newTreeData = [...treeData];
    
    // Find if the main category exists
    const categoryIndex = newTreeData.findIndex(
      node => node.title.toLowerCase() === topic.category.toLowerCase()
    );
    
    if (categoryIndex >= 0) {
      // Category exists, add topic as child
      const newNode = {
        title: topic.title,
        type: "topic",
        category: topic.category,
        expanded: true,
        content: `${topic.title} is a key concept in ${topic.category}.`,
        author: "AI Assistant",
        timestamp: new Date().toISOString().split('T')[0],
        source: "Generated by AI",
        children: [] // We'll add flashcards one by one
      };
      
      // Add to existing category
      newTreeData = addNodeUnderParent({
        treeData: newTreeData,
        parentKey: categoryIndex,
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: newNode,
      }).treeData;
      
    } else {
      // Category doesn't exist, create it
      const newCategory = {
        title: topic.category,
        type: "topic",
        category: topic.category,
        expanded: true,
        content: `${topic.category} is a field of study that includes various concepts and principles.`,
        author: "AI Assistant",
        timestamp: new Date().toISOString().split('T')[0],
        source: "Generated by AI",
        children: [
          {
            title: topic.title,
            type: "topic",
            category: topic.category,
            expanded: true,
            content: `${topic.title} is a key concept in ${topic.category}.`,
            author: "AI Assistant",
            timestamp: new Date().toISOString().split('T')[0],
            source: "Generated by AI",
            children: [] // We'll add flashcards one by one
          }
        ]
      };
      
      // Add new category to root
      newTreeData.push(newCategory);
    }
    
    // Update the tree data in the parent component
    onTreeDataChange(newTreeData);
  };

  // Add a flashcard to the current topic
  const addFlashcardToTree = () => {
    if (currentFlashcardIndex >= 0 && selectedTopics[currentTopicIndex].flashcards[currentFlashcardIndex]) {
      const topic = selectedTopics[currentTopicIndex];
      const flashcard = topic.flashcards[currentFlashcardIndex];
      
      // Clone the current tree data
      let newTreeData = [...treeData];
      
      // Find the topic node
      const flattenedTree = normalizeTreeData(newTreeData);
      const topicNode = flattenedTree.find(node => 
        node.node.title === topic.title && 
        node.node.category === topic.category
      );
      
      if (topicNode) {
        // Create the flashcard node
        const flashcardNode = {
          title: flashcard.title,
          type: "flashcard",
          category: topic.category,
          content: flashcard.content,
          question: flashcard.question,
          answer: flashcard.answer,
          author: "AI Assistant",
          timestamp: new Date().toISOString().split('T')[0],
          source: "Generated by AI",
        };
        
        // Add flashcard under the topic
        newTreeData = addNodeUnderParent({
          treeData: newTreeData,
          parentKey: topicNode.treeIndex,
          expandParent: true,
          getNodeKey: ({ treeIndex }) => treeIndex,
          newNode: flashcardNode,
        }).treeData;
        
        // Update tree data
        onTreeDataChange(newTreeData);
      }
    }
  };
  
  // When in tree view mode, show a simplified UI for content generation
  if (inTreeView && localStage === "adding") {
    return (
      <div className="content-generation-in-tree p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Building Your Knowledge Tree
        </h2>
        
        <div className="adding-info p-4 bg-gray-50 rounded-lg mb-4">
          <p className="text-gray-600">
            <span className="font-medium">Adding:</span> 
            <span className="ml-2 text-indigo-600">{currentPath}</span>
          </p>
          
          <p className="text-gray-600 mt-2">
            <span className="font-medium">Progress:</span> 
            <span className="ml-2">{currentTopicIndex + 1} of {selectedTopics.length} topics</span>
            {currentFlashcardIndex >= 0 && (
              <span className="ml-2">
                (Flashcard {currentFlashcardIndex + 1} of {selectedTopics[currentTopicIndex].flashcards.length})
              </span>
            )}
          </p>
        </div>
        
        {/* Content generation animation */}
        <div className="content-generation-inline">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {currentFlashcardIndex === -1 ? "Generating topic content:" : "Generating flashcard content:"}
          </h3>
          
          <div className="diffusion-text p-3 bg-gray-50 rounded font-mono text-gray-700 relative">
            {currentContent}
            {generatingContent && (
              <span className="cursor">|</span>
            )}
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
                style={{ width: `${contentProgress}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-500 italic">
            Watch as content is added to the highlighted locations in the tree.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            What would you like to learn today?
          </h1>
          
          {localStage === "input" && (
            <>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ask me anything..."
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 text-indigo-600 hover:text-indigo-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {showSuggestions && (
                <div className="suggestion-bubbles">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-bubble"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {localStage === "processing" && (
            <div className="flex justify-center items-center py-10">
              <div className="loader"></div>
              <p className="ml-3 text-gray-600">Analyzing your request...</p>
            </div>
          )}

          {localStage === "topics" && (
            <div className="topic-selection">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">
                Relevant topics found:
              </h2>
              <p className="text-gray-600 mb-4">
                Select the topics you'd like to add to your knowledge tree:
              </p>
              
              <div className="topic-bubbles">
                {suggestedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTopic(topic)}
                    className={`topic-bubble ${
                      selectedTopics.includes(topic) ? "selected" : ""
                    }`}
                  >
                    {topic.title}
                    {selectedTopics.includes(topic) ? (
                      <span className="ml-2 text-white">✓</span>
                    ) : (
                      <span className="ml-2">+</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Button to show custom topic section */}
              {!showCustomTopicSection && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowCustomTopicSection(true)}
                    className="px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors duration-300 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    I want to add my own topics
                  </button>
                </div>
              )}

              {/* Custom topic input section */}
              {showCustomTopicSection && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Add your own topics:
                  </h3>
                  <form onSubmit={handleAddCustomTopic} className="flex flex-col space-y-3">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="custom-topic" className="text-sm text-gray-600">
                        Topic Name:
                      </label>
                      <input
                        id="custom-topic"
                        ref={customTopicInputRef}
                        type="text"
                        value={customTopicInput}
                        onChange={(e) => setCustomTopicInput(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your own topic..."
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="custom-category" className="text-sm text-gray-600">
                        Category:
                      </label>
                      <input
                        id="custom-category"
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Category (e.g. Physics, Biology)"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-all duration-300 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Topic
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowCustomTopicSection(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleTopicsConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  disabled={selectedTopics.length === 0}
                >
                  Add Selected Topics
                </button>
              </div>
            </div>
          )}

          {localStage === "complete" && (
            <div className="text-center py-8">
              <div className="complete-checkmark mb-4">✓</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Topics Added Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your knowledge tree has been updated with {selectedTopics.length} new topics and flashcards.
              </p>
              <button
                onClick={() => {
                  if (setStage) {
                    setStage("input");
                  }
                  setInputValue("");
                  setSuggestedTopics([]);
                  setSelectedTopics([]);
                  setShowSuggestions(true);
                  setCustomTopicInput("");
                  setCustomCategory("");
                  setShowCustomTopicSection(false);
                  setCurrentTopicIndex(0);
                  setCurrentFlashcardIndex(-1);
                }}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-all duration-300"
              >
                Ask Another Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 