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
            question: "What is the Hubble Space Telescope?",
            answer: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation."
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
              "What is Newton's First Law of Motion?\n---\nAn object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
            question: "What is Newton's First Law of Motion?",
            answer: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
          },
        ],
      },
    ],
  },
];

const _normalizeTreeData = (treeData, normalizedTreeData = []) => {
  (treeData || []).forEach((item) => {
    normalizedTreeData.push(item);
    if (item.children?.length > 0) {
      _normalizeTreeData(item.children, normalizedTreeData);
    }
  });
  return normalizedTreeData;
};

export const normalizeTreeData = _normalizeTreeData;

export const rootNodeSelectionPayload = (treeData) => [treeData[0], [0]];

// const allItems = [
//   {
//     type: "Topic",
//     category: "Physics",
//     title: "What is hubble telescope",
//     content:
//       "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation.",
//   },
//   {
//     type: "Flashcard",
//     category: "Telescope",
//     title: "Who invented Hubble Telescope",
//     content:
//       "The Hubble Space Telescope is named after astronomer Edwin Hubble and was built by NASA with contributions from the European Space Agency.",
//   },
//   {
//     type: "Topic",
//     category: "Physics",
//     title: "Understanding gravity",
//     content:
//       "Gravity is one of the fundamental forces of nature, described by Newton's law of universal gravitation and Einstein's theory of general relativity.",
//   },
//   {
//     type: "Flashcard",
//     category: "Physics",
//     title: "Newton's laws of motion",
//     content:
//       "Newton's three laws of motion describe the relationship between a body and the forces acting upon it.",
//   },
//   {
//     type: "Topic",
//     category: "Astronomy",
//     title: "Solar system planets",
//     content:
//       "The solar system consists of eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
//   },
//   {
//     type: "Flashcard",
//     category: "Astronomy",
//     title: "Order of planets from sun",
//     content:
//       "The order of planets from the sun is: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
//   },
// ];
