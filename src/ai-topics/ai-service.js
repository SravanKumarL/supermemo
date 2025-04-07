/**
 * AI Service for generating topics and flashcards
 * 
 * This service provides functions for interacting with an AI to generate
 * learning content based on user prompts.
 */

// In a real implementation, this would call an actual AI API
// For now, we'll use mock data to simulate the AI response

/**
 * Generate topics based on a user prompt
 * @param {string} prompt - The user's prompt or question
 * @returns {Promise<Array>} - Array of topic objects
 */
export const generateTopics = async (prompt) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This would be replaced with an actual API call in production
  // Example response format
  return [
    { 
      id: 1, 
      title: "Quantum Physics", 
      category: "Physics",
      description: "The branch of physics dealing with quantum theory and phenomena at atomic and subatomic scales."
    },
    { 
      id: 2, 
      title: "Wave-Particle Duality", 
      category: "Physics",
      description: "The concept that every particle exhibits the properties of both particles and waves."
    },
    { 
      id: 3, 
      title: "Quantum Entanglement", 
      category: "Physics",
      description: "A phenomenon where pairs of particles remain connected so that the quantum state of each particle cannot be described independently."
    },
    { 
      id: 4, 
      title: "Heisenberg Uncertainty Principle", 
      category: "Physics",
      description: "The principle that states the position and momentum of a particle cannot be simultaneously measured with arbitrarily high precision."
    },
    { 
      id: 5, 
      title: "Quantum Mechanics", 
      category: "Physics",
      description: "The branch of physics that deals with the mathematical description of the motion and interaction of subatomic particles."
    },
    { 
      id: 6, 
      title: "Schrödinger's Equation", 
      category: "Physics",
      description: "A fundamental equation in quantum mechanics that describes how the quantum state of a physical system changes over time."
    }
  ];
};

/**
 * Generate flashcards for a specific topic
 * @param {Object} topic - The topic object
 * @returns {Promise<Array>} - Array of flashcard objects
 */
export const generateFlashcards = async (topic) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would be replaced with an actual API call in production
  // Map of topic titles to flashcards
  const flashcardMap = {
    "Quantum Physics": [
      {
        title: "Definition of Quantum Physics",
        type: "flashcard",
        category: "Quantum Physics",
        content: "What is Quantum Physics?\n---\nQuantum physics is the branch of physics that deals with the behavior of matter and energy at the smallest scales, particularly at the level of atoms and subatomic particles."
      },
      {
        title: "Key Contributors",
        type: "flashcard",
        category: "Quantum Physics",
        content: "Name three key contributors to quantum physics.\n---\nNiels Bohr, Werner Heisenberg, and Erwin Schrödinger are three key contributors to the development of quantum physics."
      }
    ],
    "Wave-Particle Duality": [
      {
        title: "Double-Slit Experiment",
        type: "flashcard",
        category: "Wave-Particle Duality",
        content: "What does the double-slit experiment demonstrate?\n---\nThe double-slit experiment demonstrates that particles like electrons can exhibit wave-like behavior, creating an interference pattern when passing through two slits."
      }
    ],
    "Quantum Entanglement": [
      {
        title: "Definition of Entanglement",
        type: "flashcard",
        category: "Quantum Entanglement",
        content: "What is quantum entanglement?\n---\nQuantum entanglement is a physical phenomenon where pairs or groups of particles are generated or interact in ways such that the quantum state of each particle cannot be described independently of the others."
      }
    ],
    "Heisenberg Uncertainty Principle": [
      {
        title: "Uncertainty Principle",
        type: "flashcard",
        category: "Heisenberg Uncertainty Principle",
        content: "State the Heisenberg Uncertainty Principle.\n---\nThe more precisely the position of a particle is determined, the less precisely its momentum can be known, and vice versa."
      }
    ],
    "Quantum Mechanics": [
      {
        title: "Mathematical Formalism",
        type: "flashcard",
        category: "Quantum Mechanics",
        content: "What is the mathematical formalism used in quantum mechanics?\n---\nQuantum mechanics uses linear algebra and complex numbers, particularly Hilbert spaces, operators, and wave functions to describe quantum states."
      }
    ],
    "Schrödinger's Equation": [
      {
        title: "Schrödinger's Equation",
        type: "flashcard",
        category: "Schrödinger's Equation",
        content: "What does Schrödinger's equation describe?\n---\nSchrödinger's equation describes how the quantum state of a physical system changes over time, providing the evolution of the wave function of the system."
      },
      {
        title: "Schrödinger's Cat",
        type: "flashcard",
        category: "Schrödinger's Equation",
        content: "What is Schrödinger's cat thought experiment?\n---\nSchrödinger's cat is a thought experiment that illustrates the problem of quantum superposition. It involves a cat that may be simultaneously alive and dead, depending on an earlier random event."
      }
    ]
  };
  
  return flashcardMap[topic.title] || [];
};

/**
 * Create topic tree structure from selected topics and their flashcards
 * @param {Array} selectedTopics - Array of topic objects selected by the user
 * @returns {Promise<Array>} - Array of topic tree nodes with flashcards as children
 */
export const createTopicTreeNodes = async (selectedTopics) => {
  const topicNodes = [];
  
  for (const topic of selectedTopics) {
    // Generate flashcards for this topic
    const flashcards = await generateFlashcards(topic);
    
    // Create topic node with flashcards as children
    const topicNode = {
      title: topic.title,
      type: "topic",
      category: topic.category,
      content: topic.description || "",
      expanded: true,
      author: "AI Assistant",
      timestamp: new Date().toISOString().split('T')[0],
      children: flashcards
    };
    
    topicNodes.push(topicNode);
  }
  
  return topicNodes;
}; 