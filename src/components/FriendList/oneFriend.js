import React from "react";
import "./oneFriend.css";
import UserAvatar from "../Users/UserAvatar.js";

function OneFriend(props) {
  const handleClick = () => {
    props.setTarget(props.userId);
    props.setTargetType("friend");
    props.setTargetName(props.name);
  };
  return (
    <div className="one-friend" onClick={handleClick}>
      <UserAvatar type="list-avatar" userId={props.userId} />
      <p style={{ display: "inline-block", marginLeft: "10px" }}>{props.name}</p>
    </div>
  );
}

export default OneFriend;
