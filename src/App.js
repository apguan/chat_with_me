import React from "react";
import "./App.css";

//Components
import Navbar from "./components/Navbar";
import WebCam from "./components/WebCam";

function App() {
  return (
    <div className="App">
      <Navbar />
      <WebCam />
    </div>
  );
}

export default App;
