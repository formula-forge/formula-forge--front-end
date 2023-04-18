import React from "react";
import "./UserAvatar.css";

function UseAvatar(props) {
  return (
    <div
      onClick={() => {
        alert(props.userID);
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
