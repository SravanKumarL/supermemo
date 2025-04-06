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
              "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation.",
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
              "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
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
