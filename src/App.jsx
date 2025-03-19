import { useState } from "react";
import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";

function App() {
  const [selectedContent, setSelectedContent] = useState({
    type: "topic",
    topic: "Physics",
    title: "Introduction to Physics",
    content: "Physics is the study of matter, energy, and their interactions.",
    source: "https://example.com/physics",
    timestamp: "2024-03-19",
    author: "John Doe"
  });

  const handleSearchSelect = (result) => {
    // Update the content based on search selection
    setSelectedContent({
      type: result.type.toLowerCase(),
      topic: result.category,
      title: result.title,
      content: `Content for ${result.title}`, // This would come from your actual data
      source: `https://example.com/${result.category.toLowerCase()}/${result.title.toLowerCase().replace(/\s+/g, '-')}`,
      timestamp: new Date().toISOString().split('T')[0],
      author: "John Doe" // This would come from your actual data
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Search onSelect={handleSearchSelect} />
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <ContentTree selectedContent={selectedContent} />
          </div>
          <div className="col-span-8">
            <ContentContainer content={selectedContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 