/**
 * AI Service for generating topics and flashcards
 * 
 * This service provides functions for interacting with an AI to generate
 * learning content based on user prompts. It simulates the behavior of an AI
 * by providing predefined responses for common topics.
 * 
 * The service supports:
 * - Generating topic suggestions based on user input
 * - Creating flashcards for selected topics
 * - Building a hierarchical topic tree with flashcards as children
 */

/**
 * Predefined topic suggestions for different subject areas.
 * Each topic includes an ID, title, category, and description.
 * These are used to simulate AI-generated content.
 * @type {Object.<string, Array>}
 */
const TOPIC_SUGGESTIONS = {
  "quantum physics": [
    { 
      id: 1, 
      title: "Quantum Mechanics", 
      category: "Physics",
      description: "The branch of physics dealing with the mathematical description of the motion and interaction of subatomic particles. It forms the foundation for understanding phenomena at microscopic scales and has revolutionized our understanding of nature at its most fundamental level."
    },
    { 
      id: 2, 
      title: "Wave-Particle Duality", 
      category: "Physics",
      description: "The concept that every particle exhibits the properties of both particles and waves. This fundamental principle of quantum mechanics challenges classical intuition and has been demonstrated in various experiments, including the famous double-slit experiment with electrons and photons."
    },
    { 
      id: 3, 
      title: "Quantum Entanglement", 
      category: "Physics",
      description: "A phenomenon where pairs of particles remain connected so that the quantum state of each particle cannot be described independently. Einstein referred to this as 'spooky action at a distance,' and it forms the basis for quantum computing and quantum cryptography applications."
    },
    { 
      id: 4, 
      title: "Heisenberg Uncertainty Principle", 
      category: "Physics",
      description: "The principle that states the position and momentum of a particle cannot be simultaneously measured with arbitrarily high precision. This fundamental limit is not due to technological constraints but is inherent in the nature of quantum systems and has profound implications for our understanding of reality."
    },
    { 
      id: 5, 
      title: "Quantum Field Theory", 
      category: "Physics",
      description: "A theoretical framework that combines quantum mechanics with special relativity to explain the behavior of subatomic particles. It treats particles as excited states of underlying fields and has been incredibly successful in predicting experimental results in particle physics."
    },
    { 
      id: 6, 
      title: "Quantum Computing", 
      category: "Physics",
      description: "An emerging field that exploits quantum mechanical phenomena to perform computational tasks. Quantum computers leverage quantum bits or 'qubits' that can exist in superpositions of states, potentially solving certain problems exponentially faster than classical computers."
    },
    { 
      id: 7, 
      title: "Quantum Tunneling", 
      category: "Physics",
      description: "A quantum mechanical phenomenon where particles pass through energy barriers that would be impossible to overcome according to classical physics. This effect is crucial for nuclear fusion in stars, scanning tunneling microscopy, and various electronic devices."
    },
    { 
      id: 8, 
      title: "Quantum Information Theory", 
      category: "Physics",
      description: "The study of information processing with quantum-mechanical systems. This field explores how quantum properties can be used to encode, transmit, and manipulate information, with applications in quantum computing, cryptography, and communication protocols."
    },
    { 
      id: 9, 
      title: "Quantum Optics", 
      category: "Physics",
      description: "The investigation of light-matter interactions at the quantum level. This field studies photons and their interactions with atoms and other particles, leading to technologies like lasers, optical tweezers, and quantum communication systems."
    },
    { 
      id: 10, 
      title: "Quantum Thermodynamics", 
      category: "Physics",
      description: "The extension of thermodynamics to quantum systems. This emerging field explores how concepts like entropy, work, and heat apply at quantum scales, with implications for understanding quantum engines, refrigerators, and the fundamental limits of energy conversion."
    }
  ],
  "machine learning": [
    { 
      id: 1, 
      title: "Supervised Learning", 
      category: "Computer Science",
      description: "A type of machine learning where the algorithm is trained on labeled data. Models learn to map inputs to outputs based on example pairs, allowing them to make predictions on new, unseen data. Common applications include classification, regression, and image recognition problems."
    },
    { 
      id: 2, 
      title: "Neural Networks", 
      category: "Computer Science",
      description: "Computing systems inspired by the biological neural networks that constitute animal brains. These interconnected nodes or 'neurons' can learn to recognize patterns in data through a process of weights adjustment. Deep neural networks with many layers have revolutionized fields like computer vision and natural language processing."
    },
    { 
      id: 3, 
      title: "Deep Learning", 
      category: "Computer Science",
      description: "A subset of machine learning based on artificial neural networks with representation learning. These architectures can automatically discover intricate structures in high-dimensional data through multiple layers of abstraction, enabling breakthroughs in image and speech recognition, language translation, and game playing."
    },
    { 
      id: 4, 
      title: "Reinforcement Learning", 
      category: "Computer Science",
      description: "An area of machine learning concerned with how intelligent agents ought to take actions to maximize the notion of cumulative reward. This paradigm has enabled systems to master complex environments and games through trial and error, including achievements like beating human champions in Chess, Go, and complex video games."
    },
    { 
      id: 5, 
      title: "Unsupervised Learning", 
      category: "Computer Science",
      description: "A type of machine learning where models identify patterns in unlabeled data. These algorithms discover hidden structures or relationships without explicit guidance, used for clustering, dimensionality reduction, and anomaly detection in various domains from marketing to cybersecurity."
    },
    { 
      id: 6, 
      title: "Transfer Learning", 
      category: "Computer Science",
      description: "A research problem in machine learning that focuses on storing knowledge gained while solving one problem and applying it to a different but related problem. This approach drastically reduces the amount of data needed to develop performant models for new tasks, making AI more accessible and efficient."
    },
    { 
      id: 7, 
      title: "Generative AI", 
      category: "Computer Science",
      description: "AI systems capable of generating new content that resembles but does not exactly replicate their training data. These models can create realistic images, write coherent text, compose music, and even generate code, opening new frontiers in creativity and automation."
    },
    { 
      id: 8, 
      title: "Ethical AI", 
      category: "Computer Science",
      description: "The study and implementation of AI systems that operate according to human ethical values. This emerging field addresses challenges like bias, fairness, transparency, privacy, and accountability in AI systems to ensure they benefit humanity and minimize potential harms."
    },
    { 
      id: 9, 
      title: "Few-Shot Learning", 
      category: "Computer Science",
      description: "Machine learning techniques that can learn from a very small number of examples. Unlike traditional approaches requiring large datasets, these methods leverage prior knowledge and meta-learning strategies to generalize effectively from limited training data."
    },
    { 
      id: 10, 
      title: "Self-Supervised Learning", 
      category: "Computer Science",
      description: "A learning paradigm where models are trained to predict parts of the input from other parts, without requiring explicit labels. This approach leverages inherent structure in data to create powerful representations that can be fine-tuned for downstream tasks."
    },
    { 
      id: 11, 
      title: "Federated Learning", 
      category: "Computer Science",
      description: "A distributed machine learning approach where models are trained across multiple decentralized devices holding local data samples. This preserves privacy by keeping data on devices while allowing collaborative model improvement through parameter sharing."
    },
    { 
      id: 12, 
      title: "Explainable AI", 
      category: "Computer Science",
      description: "Methods and techniques to make artificial intelligence systems' decisions interpretable and transparent to humans. This field addresses the 'black box' problem by creating tools to understand, trust, and effectively manage AI solutions."
    }
  ],
  "blockchain": [
    { 
      id: 1, 
      title: "Distributed Ledger Technology", 
      category: "Computer Science",
      description: "A consensually shared and synchronized digital data structure with decentralized control. This technology enables a secure system of record that is maintained across several nodes in a peer-to-peer network, with no central administrator or centralized data storage."
    },
    { 
      id: 2, 
      title: "Cryptocurrency", 
      category: "Finance",
      description: "Digital or virtual currency that uses cryptography for security and operates on a blockchain. Unlike traditional currencies issued by central banks, cryptocurrencies typically use decentralized control systems based on blockchain technology, enabling peer-to-peer transactions without intermediaries."
    },
    { 
      id: 3, 
      title: "Smart Contracts", 
      category: "Computer Science",
      description: "Self-executing contracts with the terms directly written into code. These automated agreements run on blockchain networks and automatically execute when predetermined conditions are met, reducing the need for intermediaries and enhancing transparency, efficiency, and trust in business relationships."
    },
    { 
      id: 4, 
      title: "Consensus Algorithms", 
      category: "Computer Science",
      description: "Methods by which blockchain networks achieve agreement on the state of the distributed ledger. These algorithms, including Proof of Work, Proof of Stake, and Delegated Proof of Stake, ensure all participants agree on the validity of transactions, preventing double-spending and maintaining network integrity."
    },
    { 
      id: 5, 
      title: "Tokenization", 
      category: "Finance",
      description: "The process of converting rights to an asset into a digital token on a blockchain. This enables fractional ownership of assets like real estate or art, improves liquidity, reduces transaction costs, and creates new investment opportunities through the representation of real-world assets as digital tokens."
    },
    { 
      id: 6, 
      title: "Decentralized Finance (DeFi)", 
      category: "Finance",
      description: "An ecosystem of financial applications built on blockchain networks that operate without central financial intermediaries. DeFi platforms enable lending, borrowing, trading, and earning interest on crypto assets through open, permissionless protocols, potentially democratizing access to financial services."
    },
    { 
      id: 7, 
      title: "Blockchain Governance", 
      category: "Computer Science",
      description: "The mechanisms by which blockchain protocols make decisions and implement changes. Governance models vary from centralized control to community-based voting systems, determining how upgrades, improvements, and conflict resolution occur within blockchain ecosystems."
    },
    { 
      id: 8, 
      title: "Layer 2 Scaling Solutions", 
      category: "Computer Science",
      description: "Technologies built on top of existing blockchain networks to improve throughput and efficiency. These solutions process transactions off the main chain while maintaining security guarantees, addressing the scalability challenges of major blockchain networks."
    },
    { 
      id: 9, 
      title: "Non-Fungible Tokens (NFTs)", 
      category: "Finance",
      description: "Unique digital assets recorded on a blockchain that represent ownership of specific items. Unlike cryptocurrencies, NFTs are not interchangeable, enabling verifiable digital scarcity, ownership, and authenticity for digital art, collectibles, and other unique items."
    },
    { 
      id: 10, 
      title: "Interoperability Protocols", 
      category: "Computer Science",
      description: "Standards and technologies that allow different blockchain networks to communicate and share information. These protocols enable cross-chain transactions, asset transfers, and data sharing, working toward a more connected blockchain ecosystem."
    }
  ],
  "psychology": [
    { 
      id: 1, 
      title: "Cognitive Psychology", 
      category: "Psychology",
      description: "The scientific study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking. It investigates how humans process information, form and update mental representations, and how these processes influence behavior and decision-making."
    },
    { 
      id: 2, 
      title: "Behavioral Psychology", 
      category: "Psychology",
      description: "A systematic approach to understanding human and animal behavior. This perspective emphasizes observable behaviors and the role of environmental stimuli in shaping responses through conditioning, reinforcement, and punishment, with influential contributions from psychologists like Watson, Skinner, and Pavlov."
    },
    { 
      id: 3, 
      title: "Developmental Psychology", 
      category: "Psychology",
      description: "The scientific study of how and why humans change over the course of their life. It examines physical, cognitive, social, intellectual, perceptual, personality, and emotional growth from infancy through old age, identifying patterns of continuity and change across the lifespan."
    },
    { 
      id: 4, 
      title: "Social Psychology", 
      category: "Psychology",
      description: "The scientific study of how the thoughts, feelings, and behaviors of individuals are influenced by the presence of others. It explores phenomena such as social influence, group behavior, prejudice, conformity, aggression, attraction, and how people form and maintain relationships."
    },
    { 
      id: 5, 
      title: "Clinical Psychology", 
      category: "Psychology",
      description: "The branch of psychology concerned with the assessment and treatment of mental illness, abnormal behavior, and psychiatric disorders. Clinical psychologists integrate science, theory, and practice to understand, prevent, and relieve psychologically-based distress and promote well-being."
    },
    { 
      id: 6, 
      title: "Neuropsychology", 
      category: "Psychology",
      description: "The study of the relationship between brain function and behavior. Neuropsychologists investigate how neurological conditions, brain injuries, and developmental disorders affect cognitive functions, emotions, and behaviors, often working at the intersection of neuroscience and clinical psychology."
    },
    { 
      id: 7, 
      title: "Positive Psychology", 
      category: "Psychology",
      description: "The scientific study of what makes life most worth living, focusing on positive experiences, traits, and institutions. Rather than focusing on pathology, this field examines happiness, well-being, flourishing, strengths, resilience, and optimal human functioning."
    },
    { 
      id: 8, 
      title: "Evolutionary Psychology", 
      category: "Psychology",
      description: "An approach that examines psychological traits as adaptations that evolved to solve recurrent problems in human ancestral environments. It applies principles of evolutionary biology to understand the structure of the human mind, explaining psychological mechanisms as products of natural selection."
    },
    { 
      id: 9, 
      title: "Health Psychology", 
      category: "Psychology",
      description: "The study of psychological factors that influence health, illness, and healthcare. This field examines how behavior, mental processes, and social factors affect physical wellbeing, disease prevention, treatment adherence, and recovery processes."
    },
    { 
      id: 10, 
      title: "Educational Psychology", 
      category: "Psychology",
      description: "The application of psychological theories and concepts to educational settings. This field studies how people learn and retain knowledge, addressing teaching methods, learning environments, motivation, intellectual development, and educational assessment."
    },
    { 
      id: 11, 
      title: "Industrial-Organizational Psychology", 
      category: "Psychology",
      description: "The scientific study of human behavior in the workplace. This applied discipline uses psychological principles to improve productivity, work-life quality, selection methods, training programs, and organizational development."
    },
    { 
      id: 12, 
      title: "Cross-Cultural Psychology", 
      category: "Psychology",
      description: "The examination of how cultural factors influence human behavior, thought, and emotion. This field studies similarities and differences across cultures, addressing topics like cultural values, communication patterns, identity, and psychological universals."
    }
  ],
  "chemistry": [
    { 
      id: 1, 
      title: "Organic Chemistry", 
      category: "Chemistry",
      description: "The study of the structure, properties, composition, reactions, and preparation of carbon-containing compounds. This fundamental branch of chemistry explores the molecules of life, pharmaceuticals, plastics, fuels, and countless materials essential to modern society and biological processes."
    },
    { 
      id: 2, 
      title: "Inorganic Chemistry", 
      category: "Chemistry",
      description: "The study of the synthesis and behavior of inorganic and organometallic compounds. This field examines substances not based primarily on carbon, including metals, minerals, and main-group element compounds, which are crucial for catalysis, materials science, and biological systems."
    },
    { 
      id: 3, 
      title: "Physical Chemistry", 
      category: "Chemistry",
      description: "The study of macroscopic, atomic, subatomic, and particulate phenomena in chemical systems. This discipline applies physics principles to understand chemical systems, investigating thermodynamics, quantum chemistry, kinetics, and the physical properties governing chemical transformations."
    },
    { 
      id: 4, 
      title: "Biochemistry", 
      category: "Chemistry",
      description: "The study of chemical processes within and relating to living organisms. This interdisciplinary field explores the chemical substances and processes occurring in microorganisms, plants, and animals, including the structure and function of biomolecules, metabolic pathways, and genetic information flow."
    },
    { 
      id: 5, 
      title: "Analytical Chemistry", 
      category: "Chemistry",
      description: "The science of obtaining, processing, and communicating information about the composition and structure of matter. It involves separating, identifying, and quantifying substances using various instrumental, chemical, and computational techniques essential for quality control, forensics, and environmental monitoring."
    },
    { 
      id: 6, 
      title: "Polymer Chemistry", 
      category: "Chemistry",
      description: "The study of macromolecules composed of many repeated subunits. This field investigates the synthesis, properties, and applications of polymers, which include both synthetic materials like plastics and natural substances such as proteins and nucleic acids that form the basis of life."
    },
    { 
      id: 7, 
      title: "Environmental Chemistry", 
      category: "Chemistry",
      description: "The scientific study of chemical processes occurring in the environment. This discipline examines how chemicals interact with the atmosphere, hydrosphere, and geosphere, addressing pollution, climate change, and sustainable chemical processes to protect ecosystems and human health."
    },
    { 
      id: 8, 
      title: "Computational Chemistry", 
      category: "Chemistry",
      description: "The use of computer simulations to solve chemical problems. This field applies theoretical models and mathematical approximations to predict molecular structures, reaction mechanisms, and chemical properties, enabling insights that would be difficult to obtain through experiments alone."
    },
    { 
      id: 9, 
      title: "Medicinal Chemistry", 
      category: "Chemistry",
      description: "The discipline at the intersection of chemistry and pharmacology involved in designing and developing pharmaceutical drugs. This field focuses on identifying, synthesizing, and optimizing biologically active compounds for therapeutic purposes."
    },
    { 
      id: 10, 
      title: "Materials Chemistry", 
      category: "Chemistry",
      description: "The preparation, processing, and analysis of materials with desired properties. This multidisciplinary field studies the relationships between the structure and properties of substances, developing new materials for applications in technology, energy, medicine, and manufacturing."
    },
    { 
      id: 11, 
      title: "Electrochemistry", 
      category: "Chemistry",
      description: "The study of chemical processes that cause electrons to move, generating electricity or being caused by electricity. This field examines the relationship between electrical energy and chemical change, with applications in batteries, fuel cells, corrosion prevention, and industrial processes."
    }
  ],
  "world history": [
    { 
      id: 1, 
      title: "Ancient Civilizations", 
      category: "History",
      description: "The study of the first civilizations that developed in Mesopotamia, Egypt, China, and the Indus Valley. These early societies established foundations for agriculture, writing, legal systems, urban planning, and governance that influenced subsequent civilizations and continue to shape contemporary cultures."
    },
    { 
      id: 2, 
      title: "Medieval Period", 
      category: "History",
      description: "The period in European history from the collapse of the Western Roman Empire to the Renaissance. This era saw the rise of feudalism, the growth of Christianity's influence, the development of universities, significant technological innovations, and complex trade networks spanning Europe, Asia, and Africa."
    },
    { 
      id: 3, 
      title: "Industrial Revolution", 
      category: "History",
      description: "The transition to new manufacturing processes in Europe and the United States from 1760 to 1840. This transformative period marked the shift from agrarian economies to industrialized societies, introducing mechanized production, factory systems, steam power, and radically changing social and economic structures."
    },
    { 
      id: 4, 
      title: "World Wars", 
      category: "History",
      description: "The global wars that took place between 1914-1918 (World War I) and 1939-1945 (World War II). These devastating conflicts reshaped international politics, led to technological advancements, contributed to the collapse of empires, and established new global power structures that defined the 20th century."
    },
    { 
      id: 5, 
      title: "Colonialism and Imperialism", 
      category: "History",
      description: "The historical practice of territorial acquisition, economic exploitation, and political domination by powerful nations over less powerful regions. This global phenomenon significantly influenced modern geopolitics, cultural exchange, economic development, and continues to have lasting impacts on postcolonial societies."
    },
    { 
      id: 6, 
      title: "Cold War Era", 
      category: "History",
      description: "The period of geopolitical tension between the United States and the Soviet Union from 1947 to 1991. This ideological conflict between capitalism and communism shaped international relations, drove the arms race and space race, fostered proxy wars, and influenced political developments across the globe."
    },
    { 
      id: 7, 
      title: "Renaissance and Enlightenment", 
      category: "History",
      description: "Intellectual movements in Europe that emphasized reason, individualism, scientific inquiry, and skepticism of religious dogma. These transformative periods witnessed extraordinary achievements in art, literature, philosophy, and science that laid the groundwork for modern political thought and scientific advancement."
    },
    { 
      id: 8, 
      title: "Globalization", 
      category: "History",
      description: "The process of interaction and integration among people, companies, and governments worldwide. This ongoing historical development has accelerated in recent decades through advancements in transportation, communication technology, and economic policy, creating interconnected global markets and cultures."
    },
    { 
      id: 9, 
      title: "Decolonization", 
      category: "History",
      description: "The process by which colonies gained independence from imperial powers in the mid-20th century. This global transformation reshaped international politics, created dozens of new nation-states, and generated ongoing discussions about cultural identity, economic development, and the legacies of colonialism."
    },
    { 
      id: 10, 
      title: "Ancient Greece and Rome", 
      category: "History",
      description: "The classical civilizations that flourished around the Mediterranean from roughly 800 BCE to 500 CE. These societies developed influential political systems, philosophical traditions, artistic achievements, and legal frameworks that continue to shape Western culture and institutions."
    },
    { 
      id: 11, 
      title: "Islamic Golden Age", 
      category: "History",
      description: "The period of cultural, economic, and scientific flourishing in the Islamic world from the 8th to the 14th century. During this era, scholars preserved and expanded upon ancient knowledge, made groundbreaking advances in mathematics, astronomy, medicine, and established vibrant centers of learning."
    },
    { 
      id: 12, 
      title: "Atlantic Slave Trade", 
      category: "History",
      description: "The forced transportation of African people to the Americas from the 16th to the 19th century. This system of exploitation shaped economic development, demographic patterns, and racial ideologies across multiple continents, with enduring effects on social structures and cultural identities."
    }
  ],
  "astronomy": [
    { 
      id: 1, 
      title: "Solar System", 
      category: "Astronomy",
      description: "The collection of planets, moons, asteroids, comets, and other bodies that orbit the Sun. Our solar system consists of eight planets, numerous dwarf planets, and countless smaller objects arranged in a complex gravitational dance that provides insights into planetary formation and evolution."
    },
    { 
      id: 2, 
      title: "Stellar Evolution", 
      category: "Astronomy",
      description: "The process by which a star changes over the course of time, from formation to eventual death. This life cycle begins with gas clouds collapsing to form protostars and continues through various stages depending on the star's mass, including main sequence stars, red giants, and potential supernovae."
    },
    { 
      id: 3, 
      title: "Galaxies", 
      category: "Astronomy",
      description: "Large systems of stars, gas, dust, and dark matter held together by gravity. These vast cosmic structures come in various forms including spiral, elliptical, and irregular types, and provide fundamental insights into the large-scale structure and evolution of the universe."
    },
    { 
      id: 4, 
      title: "Cosmology", 
      category: "Astronomy",
      description: "The scientific study of the origin, evolution, and eventual fate of the universe. This field addresses fundamental questions about the Big Bang, cosmic inflation, dark matter, dark energy, and the overall structure of space-time through astronomical observations and theoretical physics."
    },
    { 
      id: 5, 
      title: "Exoplanets", 
      category: "Astronomy",
      description: "Planets that orbit stars outside our solar system. The discovery and study of these distant worlds has revolutionized our understanding of planetary formation and the potential for life elsewhere in the universe, with thousands now identified using various detection methods."
    },
    { 
      id: 6, 
      title: "Black Holes", 
      category: "Astronomy",
      description: "Regions of spacetime where gravity is so strong that nothing, not even light, can escape from them. These mysterious objects form from the remnants of massive stars and exist at the centers of most galaxies, challenging our understanding of physics at extreme conditions."
    },
    { 
      id: 7, 
      title: "Astrobiology", 
      category: "Astronomy",
      description: "The study of the origin, evolution, and distribution of life in the universe. This interdisciplinary field combines astronomy, biology, chemistry, and planetary science to investigate the potential for life beyond Earth and understand the conditions that make life possible."
    },
    { 
      id: 8, 
      title: "Space Exploration", 
      category: "Astronomy",
      description: "The investigation of physical conditions in space and on celestial bodies using both robotic spacecraft and human missions. This ongoing endeavor has expanded our knowledge of the solar system and beyond, driving technological innovation and inspiring generations to look beyond our planet."
    },
    { 
      id: 9, 
      title: "Planetary Geology", 
      category: "Astronomy",
      description: "The study of the solid bodies in our solar system and beyond. This field investigates the formation, structure, and evolution of planets and their moons, applying geological principles to understand features like craters, mountains, and tectonic activity on distant worlds."
    },
    { 
      id: 10, 
      title: "Radio Astronomy", 
      category: "Astronomy",
      description: "The study of celestial objects that emit radio waves. This observational technique has revealed previously invisible phenomena like pulsars, quasars, and cosmic microwave background radiation, providing insights into the universe that complement optical astronomy."
    },
    { 
      id: 11, 
      title: "Gravitational Waves", 
      category: "Astronomy",
      description: "Ripples in the curvature of spacetime caused by accelerating massive objects. First directly detected in 2015, these waves provide a new medium for astronomical observation, allowing scientists to study phenomena like black hole mergers that were previously unobservable."
    },
    { 
      id: 12, 
      title: "Multi-Messenger Astronomy", 
      category: "Astronomy",
      description: "The simultaneous observation of astronomical events using different types of signals. By combining data from electromagnetic radiation, gravitational waves, neutrinos, and cosmic rays, scientists can gain comprehensive insights into violent cosmic phenomena."
    }
  ]
};

/**
 * Default topics provided when no specific match is found in the user's prompt.
 * These generic topics can be applied to any subject area.
 * @type {Array}
 */
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
 * Generate topics based on a user prompt.
 * This function simulates an AI response by matching keywords in the prompt
 * to predefined topic categories.
 * 
 * @param {string} prompt - The user's prompt or question
 * @returns {Promise<Array>} - Array of topic objects with id, title, category, and description
 */
export const generateTopics = async (prompt) => {
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
 * Generate flashcards for a specific topic.
 * This function creates template flashcards based on the topic's category.
 * 
 * @param {Object} topic - The topic object with title and category
 * @returns {Promise<Array>} - Array of flashcard objects with title, type, category, and content
 */
export const generateFlashcards = async (topic) => {
  console.log("Generating flashcards for topic:", topic);
  
  // Define some default flashcards for each topic category
  const defaultFlashcards = {
    "Physics": [
      {
        title: "Basic Principles",
        type: "flashcard",
        category: topic.category,
        content: `What are the basic principles of ${topic.title}?\n---\nThe basic principles include fundamental concepts that explain how matter and energy interact in this domain. These principles often challenge our classical intuition but provide accurate predictions at quantum scales.`
      },
      {
        title: "Key Equations",
        type: "flashcard",
        category: topic.category,
        content: `What are the key equations in ${topic.title}?\n---\nThe key equations mathematically describe the relationships between different physical quantities in this field. These formulations provide predictive power and insights into the underlying structure of physical reality.`
      },
      {
        title: "Historical Development",
        type: "flashcard",
        category: topic.category,
        content: `How did ${topic.title} develop historically?\n---\nThe historical development includes key experiments, theoretical breakthroughs, and the scientists who contributed to our understanding. This evolution of ideas shows how scientific knowledge builds upon previous discoveries.`
      },
      {
        title: "Experimental Evidence",
        type: "flashcard",
        category: topic.category,
        content: `What experimental evidence supports ${topic.title}?\n---\nCrucial experiments have confirmed the predictions of this theory, often with extraordinary precision. These experimental validations have been essential for establishing the theory's credibility and refining its mathematical formulation.`
      },
      {
        title: "Practical Applications",
        type: "flashcard",
        category: topic.category,
        content: `What are the practical applications of ${topic.title}?\n---\nDespite often being considered abstract and theoretical, this physical concept has led to numerous practical technologies and applications that impact our daily lives, from medical imaging to electronic devices.`
      }
    ],
    "Computer Science": [
      {
        title: "Core Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the core concepts of ${topic.title}?\n---\nThe core concepts include the fundamental principles and ideas that form the foundation of this computing domain. These concepts provide the theoretical framework for implementation and further development.`
      },
      {
        title: "Applications",
        type: "flashcard",
        category: topic.category,
        content: `What are the main applications of ${topic.title}?\n---\nThe main applications include various ways this technology is used to solve real-world problems across industries like healthcare, finance, entertainment, and transportation.`
      },
      {
        title: "Algorithms and Methods",
        type: "flashcard",
        category: topic.category,
        content: `What are the key algorithms and methods in ${topic.title}?\n---\nThese algorithmic approaches provide systematic procedures for solving problems in this domain. They range from foundational techniques to cutting-edge methods that push the boundaries of what's computationally possible.`
      },
      {
        title: "Implementation Challenges",
        type: "flashcard",
        category: topic.category,
        content: `What challenges are faced when implementing ${topic.title}?\n---\nPractical implementation often encounters difficulties with data quality, computational efficiency, scalability, and integration with existing systems. Addressing these challenges requires both theoretical understanding and practical engineering skills.`
      },
      {
        title: "Future Directions",
        type: "flashcard",
        category: topic.category,
        content: `What are the emerging trends and future directions in ${topic.title}?\n---\nThis field is rapidly evolving with new research breakthroughs, hardware advances, and novel applications. Understanding current research frontiers provides insight into where the technology is headed in coming years.`
      }
    ],
    "Psychology": [
      {
        title: "Major Theories",
        type: "flashcard",
        category: topic.category,
        content: `What are the major theories in ${topic.title}?\n---\nThe major theories include different frameworks that explain human behavior and mental processes in this domain. These theoretical perspectives have evolved through decades of research and continue to influence contemporary psychological understanding.`
      },
      {
        title: "Research Methods",
        type: "flashcard",
        category: topic.category,
        content: `What research methods are used in ${topic.title}?\n---\nResearchers in this field use various scientific methods to study psychological phenomena, including experiments, surveys, case studies, and observational research. Each method has strengths and limitations for investigating different aspects of human experience.`
      },
      {
        title: "Key Figures",
        type: "flashcard",
        category: topic.category,
        content: `Who are the key figures in the development of ${topic.title}?\n---\nSeveral influential psychologists have made groundbreaking contributions to this field through their research, theories, and clinical innovations. Their work has shaped our understanding and continues to influence contemporary approaches.`
      },
      {
        title: "Contemporary Applications",
        type: "flashcard",
        category: topic.category,
        content: `How is ${topic.title} applied in contemporary settings?\n---\nThe principles and findings from this area are applied in diverse real-world contexts including clinical practice, education, organizational settings, public policy, and technology design to improve human wellbeing and effectiveness.`
      },
      {
        title: "Controversies and Debates",
        type: "flashcard",
        category: topic.category,
        content: `What are the major controversies in ${topic.title}?\n---\nThis field contains ongoing debates about theoretical perspectives, methodological approaches, and the interpretation of research findings. These scientific controversies drive progress by encouraging rigorous investigation and theoretical refinement.`
      }
    ],
    "Chemistry": [
      {
        title: "Key Reactions",
        type: "flashcard",
        category: topic.category,
        content: `What are the key reactions in ${topic.title}?\n---\nThe key reactions include important chemical processes that define this branch of chemistry. These transformations form the foundation for understanding how compounds interact and change under different conditions.`
      },
      {
        title: "Important Compounds",
        type: "flashcard",
        category: topic.category,
        content: `What are some important compounds studied in ${topic.title}?\n---\nSeveral compounds play crucial roles in this field due to their structures, properties, or reactions. Understanding these key molecules provides insight into the fundamental principles and applications of this chemical domain.`
      },
      {
        title: "Analytical Techniques",
        type: "flashcard",
        category: topic.category,
        content: `What analytical techniques are used in ${topic.title}?\n---\nResearchers employ specialized instruments and methods to analyze chemical composition, structure, and purity. These techniques range from classical wet chemistry approaches to sophisticated spectroscopic and chromatographic methods.`
      },
      {
        title: "Industrial Applications",
        type: "flashcard",
        category: topic.category,
        content: `How is ${topic.title} applied in industry?\n---\nThe principles and processes from this field are implemented at commercial scale to produce pharmaceuticals, materials, consumer products, and other valuable substances that benefit society and drive economic development.`
      },
      {
        title: "Environmental Impact",
        type: "flashcard",
        category: topic.category,
        content: `What are the environmental considerations in ${topic.title}?\n---\nChemical processes can have significant environmental implications. Understanding these impacts has led to the development of green chemistry principles and sustainable approaches that minimize waste and reduce ecological footprints.`
      }
    ],
    "History": [
      {
        title: "Key Events",
        type: "flashcard",
        category: topic.category,
        content: `What are the key events in ${topic.title}?\n---\nThe key events include pivotal moments that shaped the course of history during this period. These turning points often represented significant political, social, technological, or cultural shifts that had lasting impacts on human civilization.`
      },
      {
        title: "Important Figures",
        type: "flashcard",
        category: topic.category,
        content: `Who are the important figures in ${topic.title}?\n---\nSeveral influential individuals played significant roles in shaping the events and developments of this historical period. Their leadership, innovations, or ideas had profound effects on societies and helped define the era's character.`
      },
      {
        title: "Social Structures",
        type: "flashcard",
        category: topic.category,
        content: `What were the social structures during ${topic.title}?\n---\nThe organization of society during this period reflected specific hierarchies, class divisions, gender roles, and cultural norms. These social arrangements influenced everyday life, economic activities, and political power distributions.`
      },
      {
        title: "Economic Systems",
        type: "flashcard",
        category: topic.category,
        content: `What economic systems characterized ${topic.title}?\n---\nThe methods of production, distribution, and consumption of goods and services during this period shaped wealth distribution, trade patterns, technological innovation, and social mobility. These economic frameworks both reflected and influenced broader historical developments.`
      },
      {
        title: "Cultural Developments",
        type: "flashcard",
        category: topic.category,
        content: `What were the major cultural developments during ${topic.title}?\n---\nThis period witnessed significant evolutions in art, literature, philosophy, religion, and scientific thought. These cultural expressions both reflected the conditions of their time and helped shape subsequent intellectual and artistic movements.`
      }
    ],
    "Astronomy": [
      {
        title: "Main Features",
        type: "flashcard",
        category: topic.category,
        content: `What are the main features of ${topic.title}?\n---\nThe main features include the characteristic properties and structures that define this astronomical concept. These elements are essential for understanding its formation, evolution, and significance in the broader cosmic context.`
      },
      {
        title: "Scientific Discoveries",
        type: "flashcard",
        category: topic.category,
        content: `What are the major scientific discoveries related to ${topic.title}?\n---\nSeveral breakthroughs in understanding have advanced our knowledge of this astronomical phenomenon. These discoveries often resulted from new observational technologies, theoretical insights, or space missions that provided unprecedented data.`
      },
      {
        title: "Observational Methods",
        type: "flashcard",
        category: topic.category,
        content: `How do astronomers observe and study ${topic.title}?\n---\nAstronomers use a variety of instruments and techniques to gather data about this cosmic phenomenon, including ground-based telescopes, space observatories, spectrographs, and other specialized equipment that detect different forms of electromagnetic radiation and particles.`
      },
      {
        title: "Current Research",
        type: "flashcard",
        category: topic.category,
        content: `What are current research directions regarding ${topic.title}?\n---\nOngoing investigations in this area focus on answering unsolved questions and testing theoretical models using advanced observational techniques and computational methods. These research efforts continue to deepen our understanding of the universe.`
      },
      {
        title: "Connection to Fundamental Physics",
        type: "flashcard",
        category: topic.category,
        content: `How does ${topic.title} relate to fundamental physics?\n---\nThis astronomical phenomenon connects to basic physical principles including gravity, electromagnetism, thermodynamics, and quantum mechanics. Studying these cosmic objects or processes provides natural laboratories for testing physics under extreme conditions.`
      }
    ],
    "Finance": [
      {
        title: "Basic Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the basic concepts of ${topic.title}?\n---\nThe basic concepts include fundamental principles that govern how this financial system works. Understanding these foundational ideas is essential for navigating the complexities of modern financial instruments, markets, and institutions.`
      },
      {
        title: "Market Dynamics",
        type: "flashcard",
        category: topic.category,
        content: `What are the market dynamics of ${topic.title}?\n---\nMarket dynamics include supply, demand, price determination, and the factors that influence them in this context. These mechanisms drive financial asset valuation, liquidity conditions, and investor behavior in traditional and emerging markets.`
      },
      {
        title: "Regulatory Framework",
        type: "flashcard",
        category: topic.category,
        content: `What regulations govern ${topic.title}?\n---\nVarious laws, rules, and oversight bodies exist to ensure fair operation, reduce systemic risk, and protect participants. This regulatory landscape continues to evolve in response to financial innovations, crises, and changing public policy objectives.`
      },
      {
        title: "Risk Management",
        type: "flashcard",
        category: topic.category,
        content: `How is risk managed in ${topic.title}?\n---\nRisk identification, measurement, monitoring, and mitigation strategies are essential components of this financial domain. Various techniques and instruments have been developed to handle different types of financial uncertainty and volatility.`
      },
      {
        title: "Future Trends",
        type: "flashcard",
        category: topic.category,
        content: `What future trends are emerging in ${topic.title}?\n---\nNew technologies, changing market structures, evolving regulatory approaches, and shifting economic conditions are reshaping this financial area. These developments present both opportunities and challenges for participants and stakeholders.`
      }
    ],
    "General": [
      {
        title: "Key Concepts",
        type: "flashcard",
        category: topic.category,
        content: `What are the key concepts of ${topic.title}?\n---\nThe key concepts include the fundamental ideas and principles that define this subject area. These core understandings provide a framework for exploring more specialized topics and applications within the field.`
      },
      {
        title: "Practical Applications",
        type: "flashcard",
        category: topic.category,
        content: `What are the practical applications of ${topic.title}?\n---\nThis knowledge has several real-world applications that demonstrate its importance and utility. These practical implementations span various sectors and continue to develop as research advances and technology evolves.`
      },
      {
        title: "Historical Development",
        type: "flashcard",
        category: topic.category,
        content: `How has ${topic.title} developed over time?\n---\nThe evolution of this field reflects changing understandings, methodologies, and priorities throughout its history. Tracing this development provides context for current approaches and insights into how knowledge accumulates and transforms.`
      },
      {
        title: "Key Debates",
        type: "flashcard",
        category: topic.category,
        content: `What are the main debates or controversies in ${topic.title}?\n---\nScholars and practitioners continue to discuss and disagree about certain aspects of this subject. These ongoing debates reflect different perspectives, methodological approaches, or interpretations of evidence within the field.`
      },
      {
        title: "Interdisciplinary Connections",
        type: "flashcard",
        category: topic.category,
        content: `How does ${topic.title} connect to other disciplines?\n---\nThis field intersects with and draws from multiple other areas of study. These interdisciplinary connections enrich the subject by providing diverse perspectives and methodologies that contribute to a more comprehensive understanding.`
      }
    ]
  };
  
  // Return the appropriate flashcards based on the topic's category
  const flashcards = defaultFlashcards[topic.category] || defaultFlashcards["General"];
  console.log(`Selected flashcards for category '${topic.category}':`, flashcards);
  return flashcards;
};

/**
 * Generate sub-topics for a specific topic.
 * This function creates template sub-topics based on the topic's title and category.
 * 
 * @param {Object} topic - The topic object with title and category
 * @returns {Promise<Array>} - Array of sub-topic objects
 */
export const generateSubTopics = async (topic) => {
  console.log("Generating sub-topics for topic:", topic);
  
  // Define sub-topics mapping for different categories and topics
  const subTopicsMapping = {
    "Physics": {
      "Quantum Mechanics": [
        {
          title: "Wave Functions",
          type: "sub-topic",
          category: topic.category,
          description: "Mathematical descriptions of quantum states that contain all measurable information about a particle or system."
        },
        {
          title: "Schrödinger Equation",
          type: "sub-topic",
          category: topic.category,
          description: "The fundamental equation governing the time evolution of quantum mechanical systems."
        },
        {
          title: "Quantum Measurement",
          type: "sub-topic",
          category: topic.category,
          description: "The process by which quantum systems interact with measuring devices, leading to wavefunction collapse."
        }
      ],
      "Wave-Particle Duality": [
        {
          title: "Double Slit Experiment",
          type: "sub-topic",
          category: topic.category,
          description: "The classic experiment demonstrating the wave-like interference patterns of particles."
        },
        {
          title: "de Broglie Hypothesis",
          type: "sub-topic",
          category: topic.category,
          description: "The theoretical foundation describing the wave nature of matter and assigning wavelengths to moving particles."
        },
        {
          title: "Quantum Superposition",
          type: "sub-topic",
          category: topic.category,
          description: "The principle that quantum systems can exist in multiple states simultaneously until measured."
        }
      ],
      "Quantum Entanglement": [
        {
          title: "Bell's Inequality",
          type: "sub-topic",
          category: topic.category,
          description: "The mathematical framework that demonstrates quantum mechanics cannot be explained by local hidden variable theories."
        },
        {
          title: "EPR Paradox",
          type: "sub-topic",
          category: topic.category,
          description: "The thought experiment by Einstein, Podolsky, and Rosen challenging the completeness of quantum mechanics."
        },
        {
          title: "Quantum Teleportation",
          type: "sub-topic",
          category: topic.category,
          description: "The technique of transferring quantum states between separate quantum systems using entanglement."
        }
      ],
      // Default sub-topics for other Physics topics
      "_default": [
        {
          title: "Fundamental Principles",
          type: "sub-topic",
          category: topic.category,
          description: `The core theoretical foundations of ${topic.title}.`
        },
        {
          title: "Mathematical Framework",
          type: "sub-topic",
          category: topic.category,
          description: `The mathematical formulations that describe ${topic.title}.`
        },
        {
          title: "Experimental Verification",
          type: "sub-topic",
          category: topic.category,
          description: `Key experiments that validate the theories of ${topic.title}.`
        }
      ]
    },
    "Computer Science": {
      "Supervised Learning": [
        {
          title: "Classification Algorithms",
          type: "sub-topic",
          category: topic.category,
          description: "Methods that categorize input data into discrete classes or labels."
        },
        {
          title: "Regression Techniques",
          type: "sub-topic",
          category: topic.category,
          description: "Approaches for predicting continuous values from input features."
        },
        {
          title: "Model Evaluation",
          type: "sub-topic",
          category: topic.category,
          description: "Methods to assess the performance and generalization ability of supervised learning models."
        }
      ],
      "Neural Networks": [
        {
          title: "Network Architectures",
          type: "sub-topic",
          category: topic.category,
          description: "Different structural arrangements of neurons, layers, and connections in neural networks."
        },
        {
          title: "Activation Functions",
          type: "sub-topic",
          category: topic.category,
          description: "Mathematical functions that determine the output of a neural network node."
        },
        {
          title: "Backpropagation",
          type: "sub-topic",
          category: topic.category,
          description: "The algorithm for calculating gradients and updating weights during neural network training."
        }
      ],
      "Deep Learning": [
        {
          title: "Convolutional Neural Networks",
          type: "sub-topic",
          category: topic.category,
          description: "Neural networks specialized for processing grid-like data such as images."
        },
        {
          title: "Recurrent Neural Networks",
          type: "sub-topic",
          category: topic.category,
          description: "Neural networks designed to recognize patterns in sequential data like text and time series."
        },
        {
          title: "Transformers",
          type: "sub-topic",
          category: topic.category,
          description: "Advanced architectures using self-attention mechanisms for processing sequential data."
        }
      ],
      // Default sub-topics for other Computer Science topics
      "_default": [
        {
          title: "Core Algorithms",
          type: "sub-topic",
          category: topic.category,
          description: `The primary computational methods used in ${topic.title}.`
        },
        {
          title: "Implementation Approaches",
          type: "sub-topic",
          category: topic.category,
          description: `Different ways to implement ${topic.title} in practical systems.`
        },
        {
          title: "Performance Considerations",
          type: "sub-topic",
          category: topic.category,
          description: `Efficiency, scalability, and optimization aspects of ${topic.title}.`
        }
      ]
    },
    "Psychology": {
      "Cognitive Psychology": [
        {
          title: "Memory Processes",
          type: "sub-topic",
          category: topic.category,
          description: "The encoding, storage, and retrieval of information in the human mind."
        },
        {
          title: "Attention Mechanisms",
          type: "sub-topic",
          category: topic.category,
          description: "Processes that allow humans to selectively concentrate on certain stimuli while ignoring others."
        },
        {
          title: "Problem-Solving Strategies",
          type: "sub-topic",
          category: topic.category,
          description: "Methods humans use to discover solutions to difficult or complex issues."
        }
      ],
      "Behavioral Psychology": [
        {
          title: "Classical Conditioning",
          type: "sub-topic",
          category: topic.category,
          description: "Learning process that occurs through associations between an environmental stimulus and a naturally occurring stimulus."
        },
        {
          title: "Operant Conditioning",
          type: "sub-topic",
          category: topic.category,
          description: "Learning method that employs rewards and punishments for behavior modification."
        },
        {
          title: "Behavior Modification Techniques",
          type: "sub-topic",
          category: topic.category,
          description: "Strategies for changing undesirable behaviors through systematic application of learning principles."
        }
      ],
      "Clinical Psychology": [
        {
          title: "Diagnostic Methods",
          type: "sub-topic",
          category: topic.category,
          description: "Procedures and tools used to identify and classify mental health disorders."
        },
        {
          title: "Therapeutic Approaches",
          type: "sub-topic",
          category: topic.category,
          description: "Different treatment methodologies used in psychotherapy, including cognitive-behavioral, psychodynamic, and humanistic approaches."
        },
        {
          title: "Assessment Techniques",
          type: "sub-topic",
          category: topic.category,
          description: "Methods for evaluating psychological functioning, personality, and mental health status."
        }
      ],
      "_default": [
        {
          title: "Theoretical Frameworks",
          type: "sub-topic",
          category: topic.category,
          description: `The major conceptual models that explain and predict phenomena in ${topic.title}.`
        },
        {
          title: "Research Methodologies",
          type: "sub-topic",
          category: topic.category,
          description: `Scientific approaches used to investigate questions in ${topic.title}.`
        },
        {
          title: "Clinical Applications",
          type: "sub-topic",
          category: topic.category,
          description: `How findings from ${topic.title} are applied in therapeutic and healthcare settings.`
        }
      ]
    },
    "Chemistry": {
      "Organic Chemistry": [
        {
          title: "Functional Groups",
          type: "sub-topic",
          category: topic.category,
          description: "Specific groups of atoms within molecules that are responsible for the characteristic chemical reactions of those molecules."
        },
        {
          title: "Reaction Mechanisms",
          type: "sub-topic",
          category: topic.category,
          description: "Step-by-step sequences showing how organic reactions occur at the molecular level."
        },
        {
          title: "Stereochemistry",
          type: "sub-topic",
          category: topic.category,
          description: "The study of the spatial arrangement of atoms in molecules and how this affects their properties and reactions."
        }
      ],
      "Biochemistry": [
        {
          title: "Protein Structure and Function",
          type: "sub-topic",
          category: topic.category,
          description: "The relationship between the three-dimensional configuration of proteins and their biological roles."
        },
        {
          title: "Metabolic Pathways",
          type: "sub-topic",
          category: topic.category,
          description: "Series of chemical reactions occurring within cells that are responsible for converting nutrients into energy and building blocks."
        },
        {
          title: "Nucleic Acid Biochemistry",
          type: "sub-topic",
          category: topic.category,
          description: "The structure, properties, and functions of DNA and RNA in storing and transmitting genetic information."
        }
      ],
      "_default": [
        {
          title: "Molecular Structure",
          type: "sub-topic",
          category: topic.category,
          description: `The arrangement of atoms in molecules studied in ${topic.title} and how this influences their properties.`
        },
        {
          title: "Chemical Reactions",
          type: "sub-topic",
          category: topic.category,
          description: `The transformations of substances into different chemical compounds through the breaking and forming of bonds in ${topic.title}.`
        },
        {
          title: "Analytical Methods",
          type: "sub-topic",
          category: topic.category,
          description: `Techniques used to determine the structure, composition, and purity of chemical substances in ${topic.title}.`
        }
      ]
    },
    "History": {
      "Ancient Civilizations": [
        {
          title: "Mesopotamian Societies",
          type: "sub-topic",
          category: topic.category,
          description: "The development of the world's first urban societies in the fertile crescent between the Tigris and Euphrates rivers."
        },
        {
          title: "Ancient Egypt",
          type: "sub-topic",
          category: topic.category,
          description: "The civilization that flourished along the Nile River from about 3100 BCE to 30 BCE, known for its monumental architecture and complex religious beliefs."
        },
        {
          title: "Early Asian Empires",
          type: "sub-topic",
          category: topic.category,
          description: "The formation and expansion of ancient civilizations in China, India, and surrounding regions."
        }
      ],
      "World Wars": [
        {
          title: "Causes and Origins",
          type: "sub-topic",
          category: topic.category,
          description: "The political, economic, and social factors that led to the outbreak of global conflicts."
        },
        {
          title: "Military Campaigns",
          type: "sub-topic",
          category: topic.category,
          description: "The major battles, strategies, and military innovations that shaped the course of the wars."
        },
        {
          title: "Home Fronts and Civil Society",
          type: "sub-topic",
          category: topic.category,
          description: "How civilian populations experienced and contributed to the war effort, including social changes and propaganda."
        }
      ],
      "_default": [
        {
          title: "Political Developments",
          type: "sub-topic",
          category: topic.category,
          description: `The evolution of governance systems, power structures, and political movements during ${topic.title}.`
        },
        {
          title: "Social and Cultural Transformations",
          type: "sub-topic",
          category: topic.category,
          description: `Changes in society, daily life, arts, and belief systems throughout ${topic.title}.`
        },
        {
          title: "Economic Factors",
          type: "sub-topic",
          category: topic.category,
          description: `The role of trade, production, technology, and resource distribution in shaping ${topic.title}.`
        }
      ]
    },
    "Astronomy": {
      "Solar System": [
        {
          title: "Terrestrial Planets",
          type: "sub-topic",
          category: topic.category,
          description: "The rocky planets closest to the Sun: Mercury, Venus, Earth, and Mars."
        },
        {
          title: "Gas Giants",
          type: "sub-topic",
          category: topic.category,
          description: "The large, primarily hydrogen and helium planets: Jupiter, Saturn, Uranus, and Neptune."
        },
        {
          title: "Minor Bodies",
          type: "sub-topic",
          category: topic.category,
          description: "Asteroids, comets, dwarf planets, and other small objects orbiting the Sun."
        }
      ],
      "Black Holes": [
        {
          title: "Formation Processes",
          type: "sub-topic",
          category: topic.category,
          description: "The astronomical events and conditions that lead to the creation of black holes."
        },
        {
          title: "Event Horizons",
          type: "sub-topic",
          category: topic.category,
          description: "The boundary around a black hole beyond which nothing can escape, not even light."
        },
        {
          title: "Observational Evidence",
          type: "sub-topic",
          category: topic.category,
          description: "Methods and findings that have confirmed the existence and properties of black holes."
        }
      ],
      "_default": [
        {
          title: "Observational Techniques",
          type: "sub-topic",
          category: topic.category,
          description: `Methods and technologies used to study ${topic.title} across the electromagnetic spectrum.`
        },
        {
          title: "Theoretical Models",
          type: "sub-topic",
          category: topic.category,
          description: `The mathematical and physical frameworks used to explain the behavior and evolution of ${topic.title}.`
        },
        {
          title: "Recent Discoveries",
          type: "sub-topic",
          category: topic.category,
          description: `New findings and breakthroughs that have expanded our understanding of ${topic.title} in recent years.`
        }
      ]
    },
    "Finance": {
      "Cryptocurrency": [
        {
          title: "Blockchain Technology",
          type: "sub-topic",
          category: topic.category,
          description: "The distributed ledger systems that underpin cryptocurrencies and enable secure, decentralized transactions."
        },
        {
          title: "Market Dynamics",
          type: "sub-topic",
          category: topic.category,
          description: "The factors influencing cryptocurrency valuations, including supply, demand, sentiment, and regulation."
        },
        {
          title: "Investment Strategies",
          type: "sub-topic",
          category: topic.category,
          description: "Approaches to investing in cryptocurrencies, from long-term holding to trading and yield farming."
        }
      ],
      "_default": [
        {
          title: "Market Mechanisms",
          type: "sub-topic",
          category: topic.category,
          description: `How financial markets function in the context of ${topic.title}, including pricing and liquidity.`
        },
        {
          title: "Risk Assessment",
          type: "sub-topic",
          category: topic.category,
          description: `Methods for evaluating and managing financial uncertainties associated with ${topic.title}.`
        },
        {
          title: "Regulatory Environment",
          type: "sub-topic",
          category: topic.category,
          description: `The legal frameworks and compliance requirements governing ${topic.title} in various jurisdictions.`
        }
      ]
    },
    // Default mapping for any category not specifically defined
    "_default": [
      {
        title: "Key Concepts",
        type: "sub-topic",
        category: topic.category,
        description: `The fundamental ideas that form the foundation of ${topic.title}.`
      },
      {
        title: "Historical Development",
        type: "sub-topic",
        category: topic.category,
        description: `How ${topic.title} has evolved over time through research and discovery.`
      },
      {
        title: "Practical Applications",
        type: "sub-topic",
        category: topic.category,
        description: `Real-world uses and implementations of ${topic.title}.`
      }
    ]
  };

  // Get category-specific mappings or default to general mapping
  const categoryMappings = subTopicsMapping[topic.category] || subTopicsMapping["_default"];
  
  // Get topic-specific sub-topics or use default for the category
  const subTopics = 
    (categoryMappings[topic.title]) || 
    (categoryMappings["_default"]) || 
    subTopicsMapping["_default"];
  
  // Add unique IDs to each sub-topic
  return subTopics.map((subTopic, index) => ({
    ...subTopic,
    id: `${topic.id}-sub-${index + 1}`
  }));
};

/**
 * Generate flashcards specifically for a sub-topic.
 * This customizes flashcards to the sub-topic's focus area.
 * 
 * @param {Object} subTopic - The sub-topic object
 * @param {Object} parentTopic - The parent topic object
 * @returns {Promise<Array>} - Array of flashcard objects for this sub-topic
 */
export const generateSubTopicFlashcards = async (subTopic, parentTopic) => {
  console.log("Generating flashcards for sub-topic:", subTopic.title);
  
  // Generate 2-3 flashcards specifically for this sub-topic
  const flashcards = [
    {
      title: `Understanding ${subTopic.title}`,
      type: "flashcard",
      category: subTopic.category,
      content: `What are the main aspects of ${subTopic.title} in the context of ${parentTopic.title}?\n---\nThis sub-topic encompasses specific concepts, techniques, and principles that form a critical component of the broader subject. Understanding these elements provides deeper insight into more specialized aspects of the field.`
    },
    {
      title: `Applications of ${subTopic.title}`,
      type: "flashcard",
      category: subTopic.category,
      content: `How is ${subTopic.title} applied in real-world scenarios?\n---\nThis specialized area has particular applications in various domains, from theoretical research to practical implementations. These applications demonstrate the value and utility of mastering this specific knowledge area.`
    }
  ];
  
  // Add a third, more specific flashcard for certain sub-topics
  if (subTopic.title.includes("Algorithm") || 
      subTopic.title.includes("Equation") || 
      subTopic.title.includes("Techniques") ||
      subTopic.title.includes("Framework")) {
    flashcards.push({
      title: `Formulations and Methods`,
      type: "flashcard",
      category: subTopic.category,
      content: `What are the key formulations or methods in ${subTopic.title}?\n---\nThis area involves specific mathematical formulations, systematic approaches, or methodologies that provide a structured way to understand and work with the concepts. Mastering these technical elements is essential for advanced work in this field.`
    });
  }
  
  // Add unique IDs to each flashcard
  return flashcards.map(card => ({
    ...card,
    id: Math.random().toString(36).substr(2, 9)
  }));
};

/**
 * Create a hierarchical topic tree structure from selected topics and their flashcards.
 * This function builds a tree where topics are parent nodes, sub-topics are intermediate nodes,
 * and flashcards are leaf nodes.
 * 
 * @param {Array} selectedTopics - Array of topic objects selected by the user
 * @returns {Promise<Array>} - Array of topic tree nodes with sub-topics and flashcards
 */
export const createTopicTreeNodes = async (selectedTopics) => {
  console.log("Creating topic tree nodes from:", selectedTopics);
  console.log("Number of selected topics received:", selectedTopics.length);
  console.log("Selected topic IDs:", selectedTopics.map(t => t.id));
  
  const topicNodes = [];
  
  for (const topic of selectedTopics) {
    try {
      console.log("Processing topic:", topic.title, "with ID:", topic.id);
      
      // Generate sub-topics for this topic
      const subTopics = await generateSubTopics(topic);
      console.log("Generated sub-topics for topic:", topic.title, subTopics);
      
      // Create array to hold sub-topic nodes with their flashcards
      const subTopicNodes = [];
      
      // For each sub-topic, generate flashcards
      for (const subTopic of subTopics) {
        const flashcards = await generateSubTopicFlashcards(subTopic, topic);
        console.log("Generated flashcards for sub-topic:", subTopic.title, flashcards);
        
        // Create sub-topic node with flashcards as children
        const subTopicNode = {
          title: subTopic.title,
          type: "sub-topic",
          category: subTopic.category,
          content: subTopic.description || "",
          expanded: true,
          children: flashcards
        };
        
        subTopicNodes.push(subTopicNode);
      }
      
      // Also add a few general flashcards for the main topic
      const generalFlashcards = await generateFlashcards(topic);
      const generalFlashcardsNode = {
        title: "Overview",
        type: "sub-topic",
        category: topic.category,
        content: "General concepts and principles of the topic.",
        expanded: true,
        children: generalFlashcards.slice(0, 2).map(card => ({
          ...card,
          id: Math.random().toString(36).substr(2, 9)
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
      
      console.log("Created topic node:", topicNode.title);
      topicNodes.push(topicNode);
    } catch (error) {
      console.error("Error creating topic node for:", topic.title, error);
    }
  }
  
  console.log("Final topic nodes count:", topicNodes.length);
  console.log("Final topic node titles:", topicNodes.map(node => node.title));
  return topicNodes;
}; 