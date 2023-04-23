import "./App.css";
import React, { useEffect, useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/Chat";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  RedirectFunction,
} from "react-router-dom";
import cookie from "react-cookies";
import logDataService from "./services/log-service";
import Log from "./components/Log/Log";

function App() {
  const [target, setTarget] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetType, setTargetType] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectTrigger, setConnectTrigger] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [logged, setLogged] = useState(false);
  const [logging, setLogging] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!logged) return;
    // 创建 WebSocket 连接
    const newSocket = new WebSocket("ws://home.xn--qby.cf:8080/api");
    setSocket(newSocket);

    newSocket.onopen = () => {
      // 连接成功后发送消息
      const message = {
        code: 0,
        token: cookie.load("token"),
      };

      newSocket.send(JSON.stringify(message));
    };
    // 组件停止渲染时关闭 WebSocket 连接
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        console.log("ws断开连接");
        newSocket.close();
      }
    };
  }, [connectTrigger]);
  useEffect(() => {
    if (!socket) {
      //防止socket未创建时报错
      return;
    }
    // 监听 WebSocket 连接的消息事件
    const handleMessage = (event) => {
      console.log("ws接受到信息: " + event.data);
      try {
        const code = JSON.parse(event.data).code;
        if (code === 1) {
          const message = JSON.parse(event.data).message; //将接收到的字符串转换为json对象
          setNewMessage(message);
        } else if (code === 200) {
          console.log("ws连接成功");
          setLogged(true);
        }
      } catch (e) {
        console.log("接受WebSocket信息出错, 错误信息: " + e);
      }
    };

    socket.addEventListener("message", handleMessage);

    // 结束时移除消息事件监听
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);
  useEffect(() => {
    if (cookie.load("token") !== undefined) {
      setConnectTrigger(true);
      setLogged(true);
    }
  }, []);
  const handleSubmit = (message) => {
    // 检查 WebSocket 连接状态是否为已连接
    if (socket.readyState === WebSocket.OPEN) {
      const Msg = {
        code: 1,
        message: message,
      };
      socket.send(JSON.stringify(Msg));
      return true;
    } else {
      alert("WebSocket 连接状态未完成，无法发送消息");
      setConnectTrigger(true);
      return false;
    }
  };
  const handleLogin = (username, phone, password) => {
    logDataService
      .login(username, phone, password)
      .then((response) => {
        cookie.save("token", response.data.token);
        console.log("http登录成功, 用户名: " + response.data.userId);
        setConnectTrigger(true);
        setLogged(true);
        setUser(response.data.userId);
      })
      .catch((e) => {
        console.log("http登录失败, 错误信息: " + e);
        if (e.response.status === 400) alert("用户名或密码错误");
        if (e.response.status === 429) alert("登录过于频繁, 请稍后再试");
        if (e.response.status === 500) alert("服务器错误, 请稍后再试");
      });
  };
  function chooseCondition() {
    if (targetType === "friend" && logged)
      return (
        <Chat
          user={user}
          friend={target}
          nickname={targetName}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
        />
      );
    if (logging) return <Log handleLogin={handleLogin} />;
  }
  return (
    <div style={{ display: "flex", flex: "auto" }}>
      <div>
        {logged ? (
          <button
            onClick={() => {
              cookie.remove("token");
              setLogged(false);
              socket.close();
              console.log("http尝试登出");
              logDataService
                .logout()
                .then((response) => {
                  console.log("http登出成功");
                })
                .catch((e) => {
                  console.log("http登出失败, 错误信息: " + e);
                });
            }}
          >
            登出
          </button>
        ) : null}
        <button
          onClick={() => {
            handleLogin("testA", null, "P@ssW0rd");
          }}
        >
          登录65
        </button>
        <button
          onClick={() => {
            handleLogin("testB", null, "P@ssW0rd");
          }}
        >
          登录77
        </button>
        {!logged ? (
          <button
            onClick={() => {
              setLogging(true);
              console.log("点击登录");
            }}
          >
            登录
          </button>
        ) : null}
      </div>
      <BrowserRouter basename="/">
        <nav style={{ padding: "10px 30px 0 30px", border: "2px solid black" }}>
          <p>
            <Link to="/">首页</Link>
          </p>
          <p>
            <Link to="/friends">好友列表</Link>
          </p>
          <Routes>
            <Route path="/" element={null} />
            <Route
              path="/friends"
              element={
                !logged ? null : (
                  <FriendList
                    setTarget={setTarget}
                    setTargetType={setTargetType}
                    setTargetName={setTargetName}
                  />
                )
              }
            />
          </Routes>
        </nav>
      </BrowserRouter>
      {chooseCondition()}
    </div>
  );
}

export default App;
