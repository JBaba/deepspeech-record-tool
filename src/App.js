import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
import MyAppMenu from "./components/MyAppMenu";
import MyAppContent from "./components/MyAppContent";

function App() {
  return (
    <div>
      <MyAppMenu />
      <MyAppContent
        ref={myAppContentComponent => {
          window.myAppContentComponent = myAppContentComponent;
        }}
      />
    </div>
  );
}

export default App;
