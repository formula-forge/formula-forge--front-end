import React from "react";
import "./SessionMenu.css";

function SessionMenu(props) {
  return (
    <div className="chat-menu" style={{ top: props.y, left: props.x }}>
      <button onClick={props.onDelete}>删除该会话</button>
    </div>
  );
}

export default SessionMenu;
