import React from "react";
import getUserName from "../../special/getUserName";
import getGroupName from "../../special/getGroupName";
import "./OneChat.css";

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

function OneChat(props) {
  const handleClick = () => {
    props.setTarget(props.session.id);
    if (props.session.type === "user") {
      props.setTargetType("friend");
      props.setTargetName(getUserName(props.session.id));
    } else {
      props.setTargetType("group");
      props.setTargetName(getGroupName(props.session.id));
    }
  };
  function enhancedTime(formattedDateTime) {
    const now = makeTime(new Date());
    if (formattedDateTime.slice(0, 10) === now.slice(0, 10)) {
      return formattedDateTime.slice(11, 16);
    } else if (formattedDateTime.slice(0, 4) === now.slice(0, 4)) {
      return formattedDateTime.slice(5, 10);
    } else {
      return formattedDateTime.slice(0, 10);
    }
  }
  return (
    <div className="one-chat" onClick={handleClick}>
      <div className="title-and-time">
        <div className="chat-title">
          {props.session.type === "user"
            ? getUserName(props.session.id)
            : getGroupName(props.session.id)}
        </div>
        <div className="chat-time">{enhancedTime(makeTime(props.session.time))}</div>
      </div>
      <div className="chat-unread">{props.session.unread}</div>
    </div>
  );
}

export default OneChat;
