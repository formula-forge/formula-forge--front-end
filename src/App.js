import "./App.css";
import React, { useEffect, useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/Chat";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import cookie from "react-cookies";
import logDataService from "./services/log-service";
import Log from "./components/Log/Log";
import Register from "./components/Register/Register";
import userDataService from "./services/user-service";
import UserInfo from "./components/Users/UserInfo";
import UserContext from "./Context";

function App() {
  const [target, setTarget] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetType, setTargetType] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectTrigger, setConnectTrigger] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [logged, setLogged] = useState(false);
  const [logging, setLogging] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [myname, setMyname] = useState(null);
  const [getUserInfoId, setGetUserInfoId] = useState(null);
  const [userInfoDisplay, setUserInfoDisplay] = useState(false);
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
          socket.send(
            JSON.stringify({
              code: 200,
              msg: "Acknowledged",
            })
          );
        } else if (code === 200) {
          console.log("ws连接成功");
          setLogged(true);

          //获取自己的用户名
          userDataService
            .getYourself()
            .then((response) => {
              setUser(response.data.data.userId);
              console.log("获取自己的ID成功, ID: " + response.data.data.userId);
              setMyname(response.data.data.name);
              console.log(
                "获取自己的用户名成功, 用户名: " + response.data.data.name
              );
            })
            .catch((e) => {
              console.log("获取自己的用户名失败, 错误信息: " + e);
            });
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
        cookie.save("userId", response.data.userId);
        console.log("http登录成功, 用户名: " + response.data.userId);
        setConnectTrigger(true);
        setLogged(true);
        setUser(response.data.userId);
        setMyname(response.data.name);
        setLogging(false);
      })
      .catch((e) => {
        console.log("http登录失败, 错误信息: " + JSON.stringify(e.response.data));
        if (e.response.data.code === 14) alert("用户名或密码错误");
        if (e.response.data.code === 10) alert("缺少内容");
        if (e.response.data.status === 429) alert("登录过于频繁, 请稍后再试");
        if (e.response.data.status === 500) alert("服务器错误, 请稍后再试");
      });
  };
  const handleLogout = () => {
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
  };
  const handleRegister = (verifycode, phone, username, password) => {
    userDataService
      .register(Number(verifycode), phone, username, password)
      .then((response) => {
        console.log("http注册成功, 用户ID: " + response.data.userId);
        setRegistering(false);
        alert("注册成功, 请登录");
      })
      .catch((e) => {
        console.log("http注册失败, 错误信息: " + JSON.stringify(e.response.data));
        if (e.response.data.code === 10) alert("参数不完整");
        if (e.response.data.code === 12) alert("验证码错误");
        if (e.response.data.code === 1) alert("参数不合法");
        if (e.response.data.code === 13) alert("用户名已存在");
      });
  };
  function chooseCondition() {
    if (targetType === "friend" && logged)
      return (
        <Chat
          user={user}
          myname={myname}
          friend={target}
          nickname={targetName}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
        />
      );
    if (logging) return <Log handleLogin={handleLogin} />;
    if (registering) return <Register handleRegister={handleRegister} />;
  }

  return (
    <div style={{ display: "flex", flex: "auto" }}>
      {userInfoDisplay ? (
        <UserInfo userId={getUserInfoId} setDisplay={setUserInfoDisplay} />
      ) : null}
      <div>
        {logged ? <button onClick={handleLogout}>登出</button> : null}
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
          <>
            <button
              onClick={() => {
                setLogging(true);
                setRegistering(false);
                console.log("点击登录");
              }}
            >
              登录
            </button>
            <button
              onClick={() => {
                setRegistering(true);
                setLogging(false);
                console.log("点击注册");
              }}
            >
              注册
            </button>
          </>
        ) : null}
      </div>
      <UserContext.Provider value={{ setGetUserInfoId, setUserInfoDisplay }}>
        <BrowserRouter basename="/">
          <nav
            style={{
              padding: "10px 30px 0 30px",
              border: "2px solid black",
              height: "95vh",
            }}
          >
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
      </UserContext.Provider>
    </div>
  );
}

export default App;
