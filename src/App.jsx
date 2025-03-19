import ContentContainer from "./content-container";
import ContentTree from "./content-tree";
import Search from "./search";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Search />
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <ContentTree />
          </div>
          <div className="col-span-8">
            <ContentContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 