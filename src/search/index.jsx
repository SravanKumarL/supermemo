import "./index.css";

function Search() {
  return (
    <div className="search-container">
      <input
        type="text"
        id="searchInput"
        placeholder="Search topics, extracts, and flashcards..."
      />
      <button id="searchButton">
        <i className="fas fa-search"></i>
      </button>
      <div id="searchResults" className="search-results"></div>
    </div>
  );
}

export default Search;
