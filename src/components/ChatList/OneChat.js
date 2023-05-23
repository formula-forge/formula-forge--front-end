import React, { useEffect } from "react";
import "./OneChat.css";
import userService from "../../services/user-service";

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
  const [name, setName] = React.useState("");
  const [unRead, setUnRead] = React.useState(props.session.unRead);
  useEffect(() => {
    if (props.session.nickname === "" || !props.session.nickname) {
      if (props.session.type === "user") {
        userService.getInfo(props.session.id).then((res) => {
          setName(res.data.data.name);
        });
      }
    }
    setName(props.session.nickname);
  }, [props.session.id, props.session.type]);
  const handleClick = () => {
    setUnRead(0);
    props.setTarget(props.session.id);
    if (props.session.type === "user") {
      props.setTargetType("friend");
      props.setTargetName(name);
    } else {
      props.setTargetType("group");
      props.setTargetName(name);
    }
    props.setRefreshTrigger((refresh) => refresh + 1);
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
  const handleContextMenu = (e) => {
    e.preventDefault(); // 阻止默认右键行为
    props.setShowContextMenu(true);
    props.setContextMenuX(e.clientX);
    props.setContextMenuY(e.clientY);
    props.setChoosing(props.session);
  };
  return (
    <div
      className="one-chat"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className="title-and-time">
        <div className="chat-title">{name}</div>
        <div className="chat-time">{enhancedTime(makeTime(props.session.time))}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="chat-latest">{props.session.latest.replace(/\$/g, "")}</div>
        {unRead ? <div className="chat-unread">{props.session.unread}</div> : null}
      </div>
    </div>
  );
}

export default OneChat;
