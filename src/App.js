import React from "react";
import "./App.css";

//Components
import Navbar from "./components/Navbar";
import StreamView from "./components/StreamView";

function App() {
  return (
    <div className="App">
      <Navbar />
      <StreamView />
    </div>
  );
}

export default App;
