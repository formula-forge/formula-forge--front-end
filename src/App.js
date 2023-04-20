import "./App.css";
import React, { useEffect, useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/Chat";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { TEST } from "./test";

function App() {
  const [target, setTarget] = useState("");
  const [targetType, setTargetType] = useState("");
  const [testingUser, setTestingUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectTrigger, setConnectTrigger] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  useEffect(() => {
    // 创建 WebSocket 连接
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.onopen = () => {
      // 连接成功后发送消息
      const message = {
        clientID: testingUser,
        token: testingUser, //用于验证身份的token, 由后端生成, 此处为测试用
      };
      newSocket.send(JSON.stringify(message));
      console.log("connected");
    };
    // 组件停止渲染时关闭 WebSocket 连接
    return () => {
      console.log("disconnected");
      newSocket.close();
    };
  }, [connectTrigger]);
  useEffect(() => {
    if (!socket) {
      //防止socket未创建时报错
      return;
    }

    // 监听 WebSocket 连接的消息事件
    const handleMessage = (event) => {
      console.log(event.data);
      try {
        const code = JSON.parse(event.data).code;
        if (code === 1) {
          const message = JSON.parse(event.data.message); //将接收到的字符串转换为json对象
          setNewMessage(message);
        }
      } catch (e) {
        console.log("接受WebSocket信息出错, 错误信息: " + e);
        console.log(event.data);
      }
    };

    socket.addEventListener("message", handleMessage);

    // 结束时移除消息事件监听
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);
  const handleSubmit = (message) => {
    // 检查 WebSocket 连接状态是否为已连接
    if (socket.readyState === WebSocket.OPEN) {
      setNewMessage(message);
      socket.send(JSON.stringify(message));
      return true;
    } else {
      alert("WebSocket 连接状态未完成，无法发送消息");
      setConnectTrigger(true);
      return false;
    }
  };
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
      {targetType === "friend" ? (
        <Chat
          user={testingUser}
          friend={target}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
        />
      ) : null}
    </div>
  );
}

export default App;
