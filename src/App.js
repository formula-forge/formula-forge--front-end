import "./App.css";
import React, { useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/Chat";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [target, setTarget] = useState("789");
  const [targetType, setTargetType] = useState("friend");
  return (
    <div style={{ display: "flex", flex: "auto" }}>
      <BrowserRouter basename="/">
        <nav style={{ padding: "10px 30px 0 30px", border: "2px solid black" }}>
          <p>
            <Link to="/">friendlist</Link>
          </p>
          <Routes>
            <Route
              path="/"
              element={
                <FriendList setTarget={setTarget} setTargetType={setTargetType} />
              }
            />
          </Routes>
        </nav>
      </BrowserRouter>
      {targetType === "friend" ? <Chat friend={target} /> : null}
      {console.log("changed")}
    </div>
  );
}

export default App;
