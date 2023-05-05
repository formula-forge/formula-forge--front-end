import React, { useState, useEffect, useRef, useContext } from "react";
import { nanoid } from "nanoid";
import UserAvatar from "../Users/UserAvatar";
import "./FriendChat.css";
import Typebox from "./Typebox";
import UserContext from "../../Context";
import sessionService from "../../services/session-service";

function makeTime(timestampStr) {
  //生成时间字符串
  const timestamp = Number(timestampStr); // 将时间戳字符串转换为数字类型的时间戳
  const now = new Date(timestamp); // 使用Date对象将时间戳转换为日期对象
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedDateTime;
}

// 这是与单个好友聊天的页面
const Chat = (props) => {
  const { setGetUserInfoId, setUserInfoDisplay } = useContext(UserContext);
  const user = Number(props.user);
  const myname = props.myname;
  const friend = Number(props.friend);
  const nickname = props.nickname;
  const newMessage = props.newMessage;
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const mathJaxRef = useRef(null);
  const handleSubmit = (inputValue) => {
    const message = {
      target: Number(user),
      group: null,
      type: "text",
      content: inputValue,
      timestamp: Date.now(),
    };
    console.log("user: " + user + " friend: " + friend);
    setMessages((m) => [...m, message]);
    if (props.handleSubmit({ ...message, target: Number(friend) })) return true;
  };

  useEffect(() => {
    let gottenMessages = [];
    // 从本地存储中读取聊天记录
    const storedMessages = localStorage.getItem(`messages:${user}-${friend}`);
    if (storedMessages) {
      gottenMessages = JSON.parse(storedMessages);
    }
    // 从网络中获取聊天记录
    sessionService
      .getFriendSession(friend)
      .then((res) => {
        const newMessages = res.data.messages;
        gottenMessages = [...gottenMessages, ...newMessages];
        gottenMessages.sort((a, b) => a.timestamp - b.timestamp);
        //去重
        let i = 0;
        while (i < gottenMessages.length - 1) {
          if (
            gottenMessages[i].timestamp === gottenMessages[i + 1].timestamp &&
            gottenMessages[i].content === gottenMessages[i + 1].content
          ) {
            gottenMessages.splice(i, 1);
          } else i++;
        }
        setMessages(gottenMessages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, friend]); //当friend改变时重新录入聊天记录

  useEffect(() => {
    if (!newMessage) return;
    setMessages((m) => [
      ...m,
      { ...newMessage, sender: newMessage.target, target: null },
    ]);
  }, [newMessage]);
  useEffect(() => {
    //标记已读
    sessionService.haveReadFriend(friend).catch((err) => {
      console.log(err);
    });
  }, [friend]);

  useEffect(() => {
    if (!messages.length) return; // 如果没有聊天记录则不渲染
    // 将聊天记录保存到本地存储
    localStorage.setItem(`messages:${user}-${friend}`, JSON.stringify(messages));
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
        // 支持行内公式使用$...$包裹, 默认为\\(...\\)包裹
        // 行级公式默认为$$...$$包裹
        tex2jax: {
          inlineMath: [["$", "$"]],
        },
      });
      // 渲染数学公式
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      // 滚动到聊天记录的底部
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };
  }, [messages, props.messageChangeTrigger]);

  // 用于渲染一条消息
  function oneMessage(time, sender, content) {
    return (
      <div key={nanoid()}>
        {time ? <p className="time">{time}</p> : null}
        {sender == friend ? (
          <div className="friend-saying">
            <UserAvatar userId={sender} type={"chat-avatar"} />
            <div className="saying">{content}</div>
          </div>
        ) : (
          <div className="my-saying">
            <div className="saying">{content}</div>
            <UserAvatar userId={sender} type={"chat-avatar"} />
          </div>
        )}
      </div>
    );
  }
  const allChatMessages = messages.map((message, index) => {
    // 检测日期是否相同
    if (
      makeTime(message.timestamp).substring(0, 10) !==
      makeTime(Date.now()).substring(0, 10)
    ) {
      return oneMessage(
        makeTime(message.timestamp), //不是今天则全部显示
        message.sender,
        message.content
      );
    } else {
      if (
        index === 0 || //防止数组越界
        makeTime(message.timestamp).substring(0, 15) !== //检测分钟的十位是否相同
          makeTime(messages[index - 1].timestamp).substring(0, 15)
      )
        return oneMessage(
          // 时间不同则显示时间的时分秒
          makeTime(message.timestamp).substring(11, 19),
          message.sender,
          message.content
        );
      // 时间相同则不显示时间
      else return oneMessage("", message.sender, message.content);
    }
  });
  return (
    <div className="chat-box" ref={mathJaxRef}>
      <p
        onClick={() => {
          setGetUserInfoId(friend);
          setUserInfoDisplay(true);
        }}
        className="friend-title"
      >
        {nickname + "(" + props.friend + ")"}
      </p>
      <div className="message-box">
        <div className="chat-history" ref={chatRef}>
          {allChatMessages}
        </div>
        <Typebox handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Chat;
