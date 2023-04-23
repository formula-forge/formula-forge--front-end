import React from "react";
import "./UserAvatar.css";

function UseAvatar(props) {
  return (
    <div
      onClick={() => {
        if (props.type === "list-avatar") return;
        alert(props.userId);
      }}
      style={{ display: "inline-block" }}
    >
      {props.avatar ? (
        <img src={props.avatar} alt="avatar" className={props.type} />
      ) : (
        <img
          src={"https://www.bing.com/sa/simg/facebook_sharing_5.png"}
          alt="avatar"
          className={props.type}
        />
      )}
    </div>
  );
}

export default UseAvatar;
