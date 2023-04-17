import React from "react";
import "./oneFriend.css";

function OneFriend(props) {
  return (
    <div className="one-friend">
      <img
        src={`https://pic1.zhimg.com/v2-1d2a27a4f0ad11146f6503a2dae7c41b.jpg?source=6a64a727`}
        className="friend-avatar"
      ></img>
      <p style={{ display: "inline-block", "margin-left": "10px" }}>{props.name}</p>
    </div>
  );
}

export default OneFriend;
