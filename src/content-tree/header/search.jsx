import { useRef } from "react";
import { useCallback } from "react";

const SearchInput = ({
  searchFoundCount,
  searchFocusIndex,
  searchString,
  setSearchString,
}) => {
  const searchInputRef = useRef(null);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchString(e.target.value);
    },
    [setSearchString]
  );
  return (
    <div className="supermemo-tree-search">
      <input
        ref={searchInputRef}
        className="supermemo-search-input"
        placeholder="Search the tree"
        value={searchString}
        onChange={handleSearchChange}
      />
      {searchFoundCount > 0 && (
        <div className="supermemo-search-count">
          {searchFocusIndex + 1} of {searchFoundCount}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
