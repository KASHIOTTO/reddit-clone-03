// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import "./stylesheets/App.css";
import Phreddit from "./components/phreddit.js";
import Banner from "./components/Banner.js";
import React from "react";

function App() {
  return (
    <section className="phreddit">
      <Phreddit />
    </section>
  );
}

export default App;
