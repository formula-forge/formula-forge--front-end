import "./App.css";
import React, { useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/Chat";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [target, setTarget] = useState("789");
  const [targetType, setTargetType] = useState("friend");
  const [testingUser, setTestingUser] = useState("123");
  return (
    <div style={{ display: "flex", flex: "auto" }}>
      <BrowserRouter basename="/">
        <nav style={{ padding: "10px 30px 0 30px", border: "2px solid black" }}>
          <p>
            <Link to="/">好友列表</Link>
          </p>
          <button onClick={() => setTestingUser("123")}>切换用户123</button>
          <button onClick={() => setTestingUser("456")}>切换用户456</button>
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
      {targetType === "friend" ? <Chat user={testingUser} friend={target} /> : null}
    </div>
  );
}

export default App;
