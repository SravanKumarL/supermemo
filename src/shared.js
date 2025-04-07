/**
 * Shared utilities and constants for the Serendipity application.
 * This file contains sample data, helper functions, and constants used throughout the application.
 */

/**
 * Initial tree data structure with sample content.
 * This provides a starting point for the application with example topics and flashcards.
 */
export const initialData = [
  {
    title: "Physics",
    type: "topic",
    category: "Physics",
    expanded: true,
    content: "",
    author: "John Doe",
    timestamp: "2025-03-19",
    source: "https://example.com/astronomy/order-of-planets-from-sun",
    children: [
      {
        title: "Astronomy",
        type: "topic",
        content: "",
        category: "Physics",
        expanded: true,
        author: "John Doe",
        timestamp: "2025-03-19",
        source: "https://example.com/astronomy/order-of-planets-from-sun",
        children: [
          {
            title: "Telescopes",
            type: "topic",
            category: "Astronomy",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "Telescopes are optical instruments that make distant objects appear magnified by using an arrangement of lenses or curved mirrors.",
          },
          {
            title: "Planets",
            type: "topic",
            category: "Astronomy",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
          },
          {
            title: "Hubble Telescope",
            type: "flashcard",
            category: "Astronomy",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "What is the Hubble Space Telescope?\n---\nThe Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation.",
          },
        ],
      },
      {
        title: "Mechanics",
        type: "topic",
        category: "Physics",
        content: "",
        expanded: true,
        author: "John Doe",
        timestamp: "2025-03-19",
        source: "https://example.com/astronomy/order-of-planets-from-sun",
        children: [
          {
            title: "Newton's Laws",
            type: "topic",
            category: "Mechanics",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "The three laws of motion describe the relationship between a body and the forces acting upon it.",
          },
          {
            title: "Gravity",
            type: "topic",
            category: "Mechanics",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "Gravity is a force of attraction that exists between any two masses, any two bodies, any two particles.",
          },
          {
            title: "Newton's First Law",
            type: "flashcard",
            category: "Mechanics",
            author: "John Doe",
            timestamp: "2025-03-19",
            source: "https://example.com/astronomy/order-of-planets-from-sun",
            content:
              "What is Newton's First Law?\n---\nAn object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
          },
        ],
      },
    ],
  },
  {
    title: "Biology",
    type: "topic",
    category: "Biology",
    expanded: true,
    content: "",
    author: "Jane Smith",
    timestamp: "2025-03-21",
    source: "https://example.com/biology/introduction",
    children: [
      {
        title: "Cell Biology",
        type: "topic",
        content: "The study of cells, the fundamental units of life.",
        category: "Biology",
        expanded: true,
        author: "Jane Smith",
        timestamp: "2025-03-21",
        source: "https://example.com/biology/cell-biology",
        children: [
          {
            title: "Cell Structure",
            type: "topic",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-structure",
            content: "Eukaryotic cells contain membrane-bound organelles including a nucleus, while prokaryotic cells do not."
          },
          {
            title: "Cell Division",
            type: "topic",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-division",
            content: "Cell division includes mitosis (division of the nucleus) and cytokinesis (division of the cytoplasm)."
          },
          {
            title: "Mitochondria Function",
            type: "flashcard",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/mitochondria",
            content: "What is the primary function of mitochondria in cells?\n---\nMitochondria are the powerhouse of the cell, responsible for producing ATP through cellular respiration."
          },
          {
            title: "Cell Types",
            type: "flashcard",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-types",
            content: "What are the two main types of cells?\n---\nProkaryotic cells (bacteria and archaea) and eukaryotic cells (plants, animals, fungi, and protists)."
          }
        ]
      },
      {
        title: "Genetics",
        type: "topic",
        category: "Biology",
        content: "The study of genes, heredity, and genetic variation in living organisms.",
        expanded: true,
        author: "Jane Smith",
        timestamp: "2025-03-22",
        source: "https://example.com/biology/genetics",
        children: [
          {
            title: "DNA Structure",
            type: "topic",
            category: "Genetics",
            author: "Jane Smith",
            timestamp: "2025-03-22",
            source: "https://example.com/biology/dna-structure",
            content: "DNA is a double helix consisting of two strands of nucleotides with complementary base pairs."
          },
          {
            title: "Genetic Inheritance",
            type: "topic",
            category: "Genetics",
            author: "Jane Smith",
            timestamp: "2025-03-22",
            source: "https://example.com/biology/genetic-inheritance",
            content: "Mendel's laws describe how traits are passed from parents to offspring through genes."
          },
          {
            title: "DNA Replication",
            type: "flashcard",
            category: "Genetics",
            author: "Jane Smith",
            timestamp: "2025-03-22",
            source: "https://example.com/biology/dna-replication",
            content: "What is the process of DNA replication?\n---\nDNA replication is a semiconservative process where each strand of the original DNA molecule serves as a template for the production of a new complementary strand."
          },
          {
            title: "Mendel's First Law",
            type: "flashcard",
            category: "Genetics",
            author: "Jane Smith",
            timestamp: "2025-03-22",
            source: "https://example.com/biology/mendel-laws",
            content: "What is Mendel's First Law (Law of Segregation)?\n---\nAllele pairs separate during gamete formation, and then randomly unite during fertilization."
          }
        ]
      },
      {
        title: "Ecology",
        type: "topic",
        category: "Biology",
        content: "The study of how organisms interact with their environment and each other.",
        expanded: true,
        author: "Jane Smith",
        timestamp: "2025-03-23",
        source: "https://example.com/biology/ecology",
        children: [
          {
            title: "Ecosystems",
            type: "topic",
            category: "Ecology",
            author: "Jane Smith",
            timestamp: "2025-03-23",
            source: "https://example.com/biology/ecosystems",
            content: "An ecosystem includes all living organisms and the physical environment with which they interact."
          },
          {
            title: "Food Chains",
            type: "topic",
            category: "Ecology",
            author: "Jane Smith",
            timestamp: "2025-03-23",
            source: "https://example.com/biology/food-chains",
            content: "A food chain is a linear sequence of organisms through which energy and nutrients pass as one organism eats another."
          },
          {
            title: "Trophic Levels",
            type: "flashcard",
            category: "Ecology",
            author: "Jane Smith",
            timestamp: "2025-03-23",
            source: "https://example.com/biology/trophic-levels",
            content: "What is the 10% rule in energy transfer between trophic levels?\n---\nOnly about 10% of the energy at one trophic level is transferred to the next level. The rest is lost as heat through metabolic processes."
          },
          {
            title: "Biomes",
            type: "flashcard",
            category: "Ecology",
            author: "Jane Smith",
            timestamp: "2025-03-23",
            source: "https://example.com/biology/biomes",
            content: "What defines a biome?\n---\nA biome is a large naturally occurring community of flora and fauna occupying a major habitat, defined by its dominant vegetation and climate conditions."
          }
        ]
      }
    ]
  }
];

/**
 * Helper function to flatten the tree data structure into a normalized array.
 * @param {Array} treeData - The hierarchical tree data to normalize
 * @param {Array} normalizedTreeData - Accumulator for the normalized data
 * @returns {Array} The flattened array of all nodes
 * @private
 */
const _normalizeTreeData = (treeData, normalizedTreeData = []) => {
  (treeData || []).forEach((item) => {
    normalizedTreeData.push(item);
    if (item.children?.length > 0) {
      _normalizeTreeData(item.children, normalizedTreeData);
    }
  });
  return normalizedTreeData;
};

/**
 * Normalizes tree data into a flat array for easier processing.
 * @param {Array} treeData - The hierarchical tree data to normalize
 * @returns {Array} The flattened array of all nodes
 */
export const normalizeTreeData = _normalizeTreeData;

/**
 * Returns the root node of the tree and its path for initial selection.
 * @param {Array} treeData - The hierarchical tree data
 * @returns {Array} An array containing the root node and its path
 */
export const rootNodeSelectionPayload = (treeData) => [treeData[0], [0]];

/**
 * Generates a random integer between min and max, different from the current value.
 * Used for the "Discover" feature to randomly select a different node.
 * 
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @param {number} current - The current value to exclude
 * @returns {number} A random integer different from the current value
 */
export function getRandomIntExcept(min, max, current) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  if (random !== current) {
    return random;
  }
  return Math.random() < 0.5
    ? Math.max(0, random - 1)
    : Math.min(random + 1, max - 1);
}
