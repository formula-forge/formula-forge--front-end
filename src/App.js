import "./App.css";
import React, { useEffect, useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import Chat from "./components/Chat/FriendChat";
import cookie from "react-cookies";
import logService from "./services/log-service";
import Log from "./components/Log/Log";
import Register from "./components/Register/Register";
import userService from "./services/user-service";
import UserInfo from "./components/Users/UserInfo";
import UserContext from "./Context";
import UserAvatar from "./components/Users/UserAvatar";
import ChatList from "./components/ChatList/ChatList";
import AddList from "./components/Add/AddList";
import Add from "./components/Add/Add";

function App() {
  const [messageChangeTrigger, setMessageChangeTrigger] = useState(false);
  const [navLink, setnavLink] = useState("friend");
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
  }, [connectTrigger, logged]);
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
          userService
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
        } else if (code === 400) {
          if (JSON.parse(event.data).msg === "token无效") {
            alert("登录已过期，请重新登录");
            cookie.remove("token");
            setLogged(false);
          }
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
    logService
      .login(username, phone, password)
      .then((response) => {
        cookie.save("token", response.data.token);
        cookie.save("userId", response.data.userId);
        console.log("http登录成功, 用户Id: " + response.data.userId);
        setLogged(true);
        setUser(response.data.userId);
        setLogging(false);
        setConnectTrigger(!connectTrigger);
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
    logService
      .logout()
      .then((response) => {
        console.log("http登出成功");
      })
      .catch((e) => {
        console.log("http登出失败, 错误信息: " + e);
      });
    //刷新页面
    window.location.reload();
  };
  const handleGetSms = (phone) => {
    userService
      .getSms(phone)
      .then((response) => {
        console.log("http获取验证码成功");
        alert("验证码已发送");
      })
      .catch((e) => {
        console.log("http获取验证码失败, 错误信息: " + JSON.stringify(e.response));
        if (e.response.data.code === 10) alert("请求过于频繁");
        if (e.response.data.code === 11) alert("手机号不合法");
        if (e.response.data.code === 30) alert("服务器错误");
      });
  };
  const handleRegister = (verifycode, phone, username, password) => {
    userService
      .register(Number(verifycode), phone, username, password)
      .then((response) => {
        console.log("http注册成功, 用户ID: " + response.data.userId);
        setRegistering(false);
        alert("注册成功, 请登录");
      })
      .catch((e) => {
        console.log("http注册失败, 错误信息: " + JSON.stringify(e));
        if (e.response.data.code === 10) alert("参数不完整");
        if (e.response.data.code === 12) alert("验证码错误");
        if (e.response.data.code === 1) alert("参数不合法");
        if (e.response.data.code === 13) alert("用户已存在");
        if (e.response.data.code === 30) alert("服务器错误");
      });
  };
  function chooseNav() {
    if (navLink === "friend") {
      return (
        <FriendList
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
        />
      );
    } else if (navLink === "group") {
      return null;
    } else if (navLink === "chat") {
      return (
        <ChatList
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
        />
      );
    } else if (navLink === "add") {
      return (
        <AddList
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
        />
      );
    }
  }
  function chooseMain() {
    if (targetType === "friend" && target && targetName) {
      return (
        <Chat
          user={user}
          myname={myname}
          friend={target}
          nickname={targetName}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
          messageChangeTrigger={messageChangeTrigger}
        />
      );
    } else if (targetType === "group") return null;
    else if (targetType === "add") return <Add user={user} addInfo={target} />;
  }
  const notLoggedPage = () => {
    return (
      <div>
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
        {logging ? <Log handleLogin={handleLogin} /> : null}
        {registering ? (
          <Register handleRegister={handleRegister} handleGetSms={handleGetSms} />
        ) : null}
      </div>
    );
  };
  useEffect(() => {
    setMessageChangeTrigger((prev) => !prev);
  }, [navLink]);
  const navLinkChoose = () => {
    return (
      <div>
        <button className="nav-button" onClick={handleLogout}>
          登出
        </button>
        <button
          className={(navLink === "friend" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("friend")}
        >
          好友
          <br />
          列表
        </button>
        <button
          className={(navLink === "group" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("group")}
        >
          群组
          <br />
          列表
        </button>
        <button
          className={(navLink === "chat" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("chat")}
        >
          聊天
          <br />
          列表
        </button>
        <button
          className={(navLink === "add" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("add")}
        >
          好友
          <br />
          申请
        </button>
      </div>
    );
  };
  const loggedPage = () => {
    return (
      <div style={{ display: "flex", flex: "auto" }}>
        {userInfoDisplay ? (
          <UserInfo userId={getUserInfoId} setDisplay={setUserInfoDisplay} />
        ) : null}
        <UserContext.Provider value={{ setGetUserInfoId, setUserInfoDisplay }}>
          {navLinkChoose()}
          <nav>
            {chooseNav()}
            <div className="me">
              <UserAvatar userId={user} type="me-avatar" />
              <div className="me-info">
                <p className="myname">{myname + "(" + user + ")"}</p>
              </div>
            </div>
          </nav>
          <main>{chooseMain()}</main>
        </UserContext.Provider>
      </div>
    );
  };
  return <>{logged ? loggedPage() : notLoggedPage()}</>;
}

export default App;
