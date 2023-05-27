import "./App.css";
import React, { useEffect, useState } from "react";
import FriendList from "./components/FriendList/FriendList";
import FriendChat from "./components/Chat/FriendChat";
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
import GroupList from "./components/GroupList/GroupList";
import GroupChat from "./components/Chat/GroupChat";
import InfoSetting from "./components/Setting/InfoSetting";
import GroupSetting from "./components/groupConfig/GroupSetting";
import GroupMember from "./components/groupConfig/GroupMember";
import GroupCreate from "./components/groupConfig/GroupCreate";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import "./components/default.css";
import 'material-icons/iconfont/material-icons.css';

function App() {
  const [navLink, setnavLink] = useState("chat");
  const [target, setTarget] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetType, setTargetType] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectTrigger, setConnectTrigger] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [logged, setLogged] = useState(false);
  const [logging, setLogging] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resettingPhone, setResettingPhone] = useState("");
  const [registering, setRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [myname, setMyname] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [getUserInfoId, setGetUserInfoId] = useState(null);
  const [userInfoDisplay, setUserInfoDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupListRefreshTrigger, setGroupListRefreshTrigger] = useState(false);
  useEffect(() => {
    if (!logged) return;
    // 创建 WebSocket 连接
    const newSocket = new WebSocket("wss://home.xn--qby.cf/api/connect");
    setSocket(newSocket);

    newSocket.onopen = () => {
      // 连接成功后发送消息
      console.log(cookie.load("token"));

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
        const msg = JSON.parse(event.data).msg;
        if (code === 1) {
          const message = JSON.parse(event.data).message; //将接收到的字符串转换为json对象
          setNewMessage(message);
          socket.send(
            JSON.stringify({
              code: 200,
              msg: "Acknowledged",
            })
          );
        } else if (code === 200 && msg === "登录成功") {
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
              setAvatar(response.data.data.avatar);
              console.log("获取自己的头像成功, 头像: " + response.data.data.avatar);
              setLoading(false);
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
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      socket.send(message);
      socket.onmessage = (event) => {
        const { code } = JSON.parse(event.data);
        if (code === 200) {
          resolve("消息发送成功");
        } else if (code === 400) {
          reject("服务器连接错误");
        } else if (code === 403) {
          reject("对方不是你的好友");
        }
      };
    });
  }
  useEffect(() => {
    if (cookie.load("token") !== undefined) {
      setLogged(true);
      setLoading(true);
    }
  }, []);
  function handleSubmit(message) {
    // 检查 WebSocket 连接状态是否为已连接
    if (socket.readyState === WebSocket.OPEN) {
      const Msg = {
        code: 1,
        message: message,
      };
      sendMessage(JSON.stringify(Msg))
        .then((response) => {
          console.log(response);
          return true;
        })
        .catch((e) => {
          alert(e);
        });
    } else {
      alert("连接失败，无法发送消息");
      setConnectTrigger(true);
      return false;
    }
  }
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
        setLoading(true);
      })
      .catch((e) => {
        console.log("http登录失败, 错误信息: " + JSON.stringify(e.response.data));
        if (e.response.data.code === 14) alert("用户名或密码错误");
        if (e.response.data.code === 10) alert("缺少内容");
        if (e.response.data.code === 20) alert("用户不存在");
        if (e.response.data.status === 429) alert("登录过于频繁, 请稍后再试");
        if (e.response.data.status === 500) alert("服务器错误, 请稍后再试");
      });
  };
  const handleLogout = () => {
    cookie.remove("token");
    setLogged(false);
    if(socket && socket.readyState === WebSocket.OPEN)
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
  const handleGetSms = async (phone) => {
    try {
      const response = await userService.getSms(phone);
      console.log("http获取验证码成功");
      alert("验证码已发送");
    } catch (e) {
      console.log("http获取验证码失败, 错误信息: " + JSON.stringify(e.response));
      if (e.response.data.code === 10) alert("请求过于频繁");
      if (e.response.data.code === 11) alert("手机号不合法");
      if (e.response.data.code === 30) alert("服务器错误");
      throw e;
    }
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
  const handleResetPassword = (verifycode, phone, password, verifyPassword) => {
    if (password !== verifyPassword) {
      alert("两次密码输入不一致");
      return;
    }
    userService
      .changePassword(Number(verifycode), phone, password)
      .then((response) => {
        console.log("http修改密码成功");
        setResetting(false);
        alert("修改密码成功, 请重新登录");
        setLogging(true);
        handleLogout();
      })
      .catch((e) => {
        console.log("http修改密码失败, 错误信息: " + JSON.stringify(e));
        alert(e.response.data.message);
      });
  };
  const handleJumptoReset = (phone) => {
    setLogging(false);
    logService.logout();
    setResetting(true);
    setLogged(false);
    setResettingPhone(phone);
  };
  function chooseNav() {
    if (navLink === "friend") {
      return (
        <FriendList
          targetType={targetType}
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
        />
      );
    } else if (navLink === "group") {
      return (
        <GroupList
          targetType={targetType}
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
          groupListRefreshTrigger={groupListRefreshTrigger}
        />
      );
    } else if (navLink === "chat") {
      return (
        <ChatList
          targetType={targetType}
          setTarget={setTarget}
          setTargetType={setTargetType}
          setTargetName={setTargetName}
          user={user}
          newMessage={newMessage}
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
        <FriendChat
          user={user}
          myname={myname}
          friend={target}
          nickname={targetName}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
        />
      );
    } else if (targetType === "group") {
      return (
        <GroupChat
          user={user}
          myname={myname}
          groupId={target}
          groupName={targetName}
          handleSubmit={handleSubmit}
          newMessage={newMessage}
          setTargetType={setTargetType}
        />
      );
    } else if (targetType === "add") return <Add user={user} addInfo={target} />;
    else if (targetType === "info-setting")
      return <InfoSetting user={user} myname={myname} handleJumptoReset={handleJumptoReset} />;
    else if (targetType === "group-setting") {
      return <GroupSetting groupId={target} setTargetType={setTargetType} />;
    } else if (targetType === "group-member") {
      return (
        <GroupMember groupId={target} setTargetType={setTargetType} user={user} />
      );
    } else if (targetType === "group-create") {
      return (
        <GroupCreate
          setTargetType={setTargetType}
          setGroupListRefreshTrigger={setGroupListRefreshTrigger}
        />
      );
    }
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
        {logging ? (
          <Log
            handleLogin={handleLogin}
            handleGetSms={handleGetSms}
            setLogging={setLogging}
            setRegistering={setRegistering}
            setResetting={setResetting}
          />
        ) : null}
        {registering ? (
          <Register
            handleRegister={handleRegister}
            handleGetSms={handleGetSms}
            setLogging={setLogging}
            setRegistering={setRegistering}
          />
        ) : null}
        {resetting ? (
          <ResetPassword
            handleResetPassword={handleResetPassword}
            handleGetSms={handleGetSms}
            setLogging={setLogging}
            setResetting={setResetting}
            handleLogout={handleLogout}
            phone={resettingPhone}
          />
        ) : null}
      </div>
    );
  };
  const navLinkChoose = () => {
    return (
      <div>
        <button
          className={(navLink === "chat" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("chat")}
        >
          聊天
          <br />
          列表
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
          className={(navLink === "add" ? "using " : "") + "nav-button"}
          onClick={() => setnavLink("add")}
        >
          好友
          <br />
          申请
        </button>
        <button className="nav-button log-out" onClick={handleLogout}>
          登出
        </button>
      </div>
    );
  };
  const loggedPage = () => {
    if (loading)
      return (
        <div>
          加载中...
          <button onClick={handleLogout}>登出</button>
        </div>
      );
    return (
      <div
        style={{ display: "flex", flex: "auto" }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <UserContext.Provider value={{ setGetUserInfoId, setUserInfoDisplay }}>
          {navLinkChoose()}
          <nav>
            <div className="nav-content">{chooseNav()}</div>
            <div className="me">
              <UserAvatar avatar={avatar} userId={user} type="me-avatar" />
              <div className="me-info">
                <p className="myname">{myname + "(" + user + ")"}</p>
                <button
                  className="info-setting-button"
                  onClick={() => {
                    setTargetType("info-setting");
                    setTargetName(null);
                    setTarget(null);
                  }}
                />
              </div>
            </div>
          </nav>
          <main>{chooseMain()}</main>
          {userInfoDisplay ? (
            <UserInfo
              userId={getUserInfoId}
              setDisplay={setUserInfoDisplay}
              setTarget={setTarget}
              setTargetType={setTargetType}
              setTargetName={setTargetName}
            />
          ) : null}
        </UserContext.Provider>
      </div>
    );
  };
  return <>{logged ? loggedPage() : notLoggedPage()}</>;
}

export default App;
