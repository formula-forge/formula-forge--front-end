import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import UseAvatar from "../Users/UserAvatar";
import "./Chat.css";

import testID from "../../assets/userID/test.json";
import testMessage from "./test.json";
const messagesData = testMessage.messages;
const idData = testID.userID;

// 这是与单个好友聊天的页面
const Chat = (props) => {
  const user = props.user ? props.user : "123";
  const friend = props.friend;
  const [messages, setMessages] = useState(messagesData);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 从本地存储中读取聊天记录
    const storedMessages = localStorage.getItem(`messages:${user}-${friend}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [friend]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages([...messages, message]);
    };

    socket.addEventListener("message", handleMessage);

    // 将聊天记录保存到本地存储
    localStorage.setItem(`messages:${user}-${friend}`, JSON.stringify(messages));

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, messages]);
  function makeTime() {
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
  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue === "") {
      return;
    }
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
      setInputValue("");
    } else {
      console.log("WebSocket 连接状态未完成，无法发送消息");
      // 模拟发送消息
      const message = {
        content: inputValue,
        timestamp: formattedDateTime,
        sender: user,
      };
      setMessages([...messages, message]);
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
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
          {idData[sender]}: {content}
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
      <h3>{idData[props.friend]}</h3>
      <div className="message-box">
        {messages.map((message, index) => {
          if (message.timestamp.substring(0, 10) !== makeTime().substring(0, 10)) {
            return oneMessage(message.timestamp, message.sender, message.content);
          } else {
            if (
              index === 0 || //防止数组越界
              message.timestamp.substring(0, 15) !== //检测时间至分钟的十位是否相同
                messages[index - 1].timestamp.substring(0, 15)
            )
              return oneMessage(
                message.timestamp.substring(11, 19),
                message.sender,
                message.content
              );
            //时间相同则不显示时间
            else return oneMessage("", message.sender, message.content);
          }
        })}
      </div>
      {/* form能够监听回车事件与点击事件 */}
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
