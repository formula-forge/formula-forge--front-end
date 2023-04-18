import React from "react";
import "./oneFriend.css";
import UserAvatar from "../Users/UserAvatar.js";

function OneFriend(props) {
  const handleClick = () => {
    props.setTarget(props.userID);
    props.setTargetType("friend");
    console.log(props.userID);
  };
  return (
    <div className="one-friend" onClick={handleClick}>
      <UserAvatar type="list-avatar" userID={props.userID} />
      <p style={{ display: "inline-block", marginLeft: "10px" }}>{props.name}</p>
    </div>
  );
}

export default OneFriend;
