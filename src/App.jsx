// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import ContentTree from "./content-tree";
import Search from "./search";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col">
      <Search />
      <div className="flex flex-row">
        <ContentTree />
        <div className="">Content Container</div>
      </div>
    </div>
  );
}

export default App;
