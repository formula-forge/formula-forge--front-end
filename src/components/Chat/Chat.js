import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import UseAvatar from "../Users/UserAvatar";
import "./Chat.css";
import Typebox from "./Typebox";

import testID from "../../assets/userID/test.json";
import testMessage from "./test.json";
import testFriend from "../FriendList/test.json";
const messagesData = testMessage.messages;
const idData = testID.userID;

// 这是与单个好友聊天的页面
const Chat = (props) => {
  const user = props.user ? props.user : "123";
  const friend = props.friend;
  const [messages, setMessages] = useState(messagesData);
  const [socket, setSocket] = useState(null);
  const [nickname, setNickname] = useState(null);
  const chatRef = useRef(null);
  useEffect(() => {
    setNickname(testFriend.friends.find((item) => item.userID === friend).nickname);
    // 从本地存储中读取聊天记录
    const storedMessages = localStorage.getItem(`messages:${user}-${friend}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else setMessages(messagesData);

    // 创建 WebSocket 连接
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);
    // 结束时关闭 WebSocket 连接
    return () => {
      newSocket.close();
    };
  }, [friend]); //当friend改变时重新录入聊天记录

  useEffect(() => {
    if (!socket) {
      //防止socket未创建时报错
      return;
    }

    // 监听 WebSocket 连接的消息事件
    const handleMessage = (event) => {
      const message = JSON.parse(event.data); //将接收到的字符串转换为json对象
      setMessages([...messages, message]);
    };

    socket.addEventListener("message", handleMessage);

    // 将聊天记录保存到本地存储
    localStorage.setItem(`messages:${user}-${friend}`, JSON.stringify(messages));

    // 结束时移除消息事件监听
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, messages]);
  useEffect(() => {
    // 渲染数学公式
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
    document.head.appendChild(script);
    script.onload = () => {
      // 加载完成后设置MathJax配置
      window.MathJax.Hub.Config({
        // 支持行内公式
        tex2jax: {
          inlineMath: [["$", "$"]],
        },
      });
      // 渲染数学公式
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      // 滚动到聊天记录的底部
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };
  }, [messages]);
  function makeTime() {
    //生成时间字符串
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formattedDateTime;
  }
  const handleSubmit = (inputValue) => {
    const formattedDateTime = makeTime();
    console.log(formattedDateTime); // 输出类似于 "2023-04-16 17:12:25" 的字符串

    // 检查 WebSocket 连接状态是否为已连接
    if (socket.readyState === WebSocket.OPEN) {
      const message = {
        content: inputValue,
        timestamp: formattedDateTime,
        sender: user,
      };
      socket.send(JSON.stringify(message));
    } else {
      console.log("WebSocket 连接状态未完成，无法发送消息");
      // 模拟发送消息
      const message = {
        content: inputValue,
        timestamp: formattedDateTime,
        sender: user,
      };
      setMessages([...messages, message]);
    }
  };
  // 用于渲染一条消息
  function oneMessage(time, sender, content) {
    return (
      <div key={nanoid()}>
        <p>{time}</p>
        <UseAvatar userID={sender} type={"chat-avatar"} />
        <p
          style={{
            display: "inline-block",
          }}
        >
          {sender !== user && nickname ? nickname : idData[sender]}: {content}
        </p>
      </div>
    );
  }
  return (
    <div
      style={{
        marginLeft: "10px",
        padding: "10px 30px 10px 30px",
        border: "2px solid black",
      }}
    >
      <h3>
        {(nickname ? nickname : idData[props.friend]) + "(" + props.friend + ")"}
      </h3>
      <div className="message-box" ref={chatRef}>
        {messages.map((message, index) => {
          // 检测日期是否相同
          if (message.timestamp.substring(0, 10) !== makeTime().substring(0, 10)) {
            return oneMessage(message.timestamp, message.sender, message.content);
          } else {
            if (
              index === 0 || //防止数组越界
              message.timestamp.substring(0, 15) !== //检测分钟的十位是否相同
                messages[index - 1].timestamp.substring(0, 15)
            )
              return oneMessage(
                // 时间不同则显示时间的时分秒
                message.timestamp.substring(11, 19),
                message.sender,
                message.content
              );
            // 时间相同则不显示时间
            else return oneMessage("", message.sender, message.content);
          }
        })}
      </div>
      <Typebox handleSubmit={handleSubmit} />
    </div>
  );
};

export default Chat;
