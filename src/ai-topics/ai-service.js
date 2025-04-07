/**
 * AI Service for generating topics and flashcards
 * 
 * This service provides functions for interacting with an AI to generate
 * learning content based on user prompts.
 */

// Topic suggestions for different subject areas
const TOPIC_SUGGESTIONS = {
  "quantum physics": [
    { 
      id: 1, 
      title: "Quantum Mechanics", 
      category: "Physics",
      description: "The branch of physics dealing with the mathematical description of the motion and interaction of subatomic particles."
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
    }
  ],
  "machine learning": [
    { 
      id: 1, 
      title: "Supervised Learning", 
      category: "Computer Science",
      description: "A type of machine learning where the algorithm is trained on labeled data."
    },
    { 
      id: 2, 
      title: "Neural Networks", 
      category: "Computer Science",
      description: "Computing systems inspired by the biological neural networks that constitute animal brains."
    },
    { 
      id: 3, 
      title: "Deep Learning", 
      category: "Computer Science",
      description: "A subset of machine learning based on artificial neural networks with representation learning."
    },
    { 
      id: 4, 
      title: "Reinforcement Learning", 
      category: "Computer Science",
      description: "An area of machine learning concerned with how intelligent agents ought to take actions to maximize the notion of cumulative reward."
    }
  ],
  "blockchain": [
    { 
      id: 1, 
      title: "Distributed Ledger Technology", 
      category: "Computer Science",
      description: "A consensually shared and synchronized digital data structure with decentralized control."
    },
    { 
      id: 2, 
      title: "Cryptocurrency", 
      category: "Finance",
      description: "Digital or virtual currency that uses cryptography for security and operates on a blockchain."
    },
    { 
      id: 3, 
      title: "Smart Contracts", 
      category: "Computer Science",
      description: "Self-executing contracts with the terms directly written into code."
    },
    { 
      id: 4, 
      title: "Consensus Algorithms", 
      category: "Computer Science",
      description: "Methods by which blockchain networks achieve agreement on the state of the distributed ledger."
    }
  ],
  "psychology": [
    { 
      id: 1, 
      title: "Cognitive Psychology", 
      category: "Psychology",
      description: "The scientific study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking."
    },
    { 
      id: 2, 
      title: "Behavioral Psychology", 
      category: "Psychology",
      description: "A systematic approach to understanding human and animal behavior."
    },
    { 
      id: 3, 
      title: "Developmental Psychology", 
      category: "Psychology",
      description: "The scientific study of how and why humans change over the course of their life."
    },
    { 
      id: 4, 
      title: "Social Psychology", 
      category: "Psychology",
      description: "The scientific study of how the thoughts, feelings, and behaviors of individuals are influenced by the presence of others."
    }
  ],
  "chemistry": [
    { 
      id: 1, 
      title: "Organic Chemistry", 
      category: "Chemistry",
      description: "The study of the structure, properties, composition, reactions, and preparation of carbon-containing compounds."
    },
    { 
      id: 2, 
      title: "Inorganic Chemistry", 
      category: "Chemistry",
      description: "The study of the synthesis and behavior of inorganic and organometallic compounds."
    },
    { 
      id: 3, 
      title: "Physical Chemistry", 
      category: "Chemistry",
      description: "The study of macroscopic, atomic, subatomic, and particulate phenomena in chemical systems."
    },
    { 
      id: 4, 
      title: "Biochemistry", 
      category: "Chemistry",
      description: "The study of chemical processes within and relating to living organisms."
    }
  ],
  "world history": [
    { 
      id: 1, 
      title: "Ancient Civilizations", 
      category: "History",
      description: "The study of the first civilizations that developed in Mesopotamia, Egypt, China, and the Indus Valley."
    },
    { 
      id: 2, 
      title: "Medieval Period", 
      category: "History",
      description: "The period in European history from the collapse of the Western Roman Empire to the Renaissance."
    },
    { 
      id: 3, 
      title: "Industrial Revolution", 
      category: "History",
      description: "The transition to new manufacturing processes in Europe and the United States from 1760 to 1840."
    },
    { 
      id: 4, 
      title: "World Wars", 
      category: "History",
      description: "The global wars that took place between 1914-1918 (World War I) and 1939-1945 (World War II)."
    }
  ],
  "astronomy": [
    { 
      id: 1, 
      title: "Solar System", 
      category: "Astronomy",
      description: "The collection of planets, moons, asteroids, comets, and other bodies that orbit the Sun."
    },
    { 
      id: 2, 
      title: "Stellar Evolution", 
      category: "Astronomy",
      description: "The process by which a star changes over the course of time, from formation to eventual death."
    },
    { 
      id: 3, 
      title: "Galaxies", 
      category: "Astronomy",
      description: "Large systems of stars, gas, dust, and dark matter held together by gravity."
    },
    { 
      id: 4, 
      title: "Cosmology", 
      category: "Astronomy",
      description: "The scientific study of the origin, evolution, and eventual fate of the universe."
    }
  ]
};

// Default topics for when no match is found
const DEFAULT_TOPICS = [
  { 
    id: 1, 
    title: "Introduction to Subject", 
    category: "General",
    description: "The fundamental concepts and principles of the subject."
  },
  { 
    id: 2, 
    title: "Historical Development", 
    category: "General",
    description: "The historical evolution and development of key ideas in this field."
  },
  { 
    id: 3, 
    title: "Modern Applications", 
    category: "General",
    description: "Current uses and applications of this knowledge in today's world."
  },
  { 
    id: 4, 
    title: "Future Directions", 
    category: "General",
    description: "Emerging trends and potential future developments in this area."
  }
];

/**
 * Generate topics based on a user prompt
 * @param {string} prompt - The user's prompt or question
 * @returns {Promise<Array>} - Array of topic objects
 */
export const generateTopics = async (prompt) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if the prompt contains any of our predefined categories
  const lowerPrompt = prompt.toLowerCase();
  
  // Find matching category
  for (const [category, topics] of Object.entries(TOPIC_SUGGESTIONS)) {
    if (lowerPrompt.includes(category)) {
      return topics;
    }
  }
  
  // If no match found, return default topics
  return DEFAULT_TOPICS;
};

/**
 * Generate flashcards for a specific topic
 * @param {Object} topic - The topic object
 * @returns {Promise<Array>} - Array of flashcard objects
 */
export const generateFlashcards = async (topic) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Define some default flashcards for each topic category
  const defaultFlashcards = {
    "Physics": [
      {
        title: "Basic Principles",
        type: "flashcard",
        category: topic.category,
        content: `What are the basic principles of ${topic.title}?\n---\nThe basic principles include fundamental concepts that explain how matter and energy interact in this domain.`
      },
      {
        title: "Key Equations",
        type: "flashcard",
        category: topic.category,
        content: `What are the key equations in ${topic.title}?\n---\nThe key equations mathematically describe the relationships between different physical quantities in this field.`
      }
    ],
    "Computer Science": [
      {
        title: "Core Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the core concepts of ${topic.title}?\n---\nThe core concepts include the fundamental principles and ideas that form the foundation of this computing domain.`
      },
      {
        title: "Applications",
        type: "flashcard",
        category: topic.category,
        content: `What are the main applications of ${topic.title}?\n---\nThe main applications include various ways this technology is used to solve real-world problems.`
      }
    ],
    "Psychology": [
      {
        title: "Major Theories",
        type: "flashcard",
        category: topic.category,
        content: `What are the major theories in ${topic.title}?\n---\nThe major theories include different frameworks that explain human behavior and mental processes in this domain.`
      },
      {
        title: "Research Methods",
        type: "flashcard",
        category: topic.category,
        content: `What research methods are used in ${topic.title}?\n---\nResearchers in this field use various scientific methods to study psychological phenomena, including experiments, surveys, case studies, and observational research.`
      }
    ],
    "Chemistry": [
      {
        title: "Key Reactions",
        type: "flashcard",
        category: topic.category,
        content: `What are the key reactions in ${topic.title}?\n---\nThe key reactions include important chemical processes that define this branch of chemistry.`
      },
      {
        title: "Important Compounds",
        type: "flashcard",
        category: topic.category,
        content: `What are some important compounds studied in ${topic.title}?\n---\nSeveral compounds play crucial roles in this field due to their structures, properties, or reactions.`
      }
    ],
    "History": [
      {
        title: "Key Events",
        type: "flashcard",
        category: topic.category,
        content: `What are the key events in ${topic.title}?\n---\nThe key events include pivotal moments that shaped the course of history during this period.`
      },
      {
        title: "Important Figures",
        type: "flashcard",
        category: topic.category,
        content: `Who are the important figures in ${topic.title}?\n---\nSeveral influential individuals played significant roles in shaping the events and developments of this historical period.`
      }
    ],
    "Astronomy": [
      {
        title: "Main Features",
        type: "flashcard",
        category: topic.category,
        content: `What are the main features of ${topic.title}?\n---\nThe main features include the characteristic properties and structures that define this astronomical concept.`
      },
      {
        title: "Scientific Discoveries",
        type: "flashcard",
        category: topic.category,
        content: `What are the major scientific discoveries related to ${topic.title}?\n---\nSeveral breakthroughs in understanding have advanced our knowledge of this astronomical phenomenon.`
      }
    ],
    "Finance": [
      {
        title: "Basic Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the basic concepts of ${topic.title}?\n---\nThe basic concepts include fundamental principles that govern how this financial system works.`
      },
      {
        title: "Market Dynamics",
        type: "flashcard",
        category: topic.category,
        content: `What are the market dynamics of ${topic.title}?\n---\nMarket dynamics include supply, demand, price determination, and the factors that influence them in this context.`
      }
    ],
    "General": [
      {
        title: "Key Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the key concepts of ${topic.title}?\n---\nThe key concepts include the fundamental ideas and principles that define this subject area.`
      },
      {
        title: "Practical Applications",
        type: "flashcard",
        category: topic.category,
        content: `What are the practical applications of ${topic.title}?\n---\nThis knowledge has several real-world applications that demonstrate its importance and utility.`
      }
    ]
  };
  
  // Return the appropriate flashcards based on the topic's category
  return defaultFlashcards[topic.category] || defaultFlashcards["General"];
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