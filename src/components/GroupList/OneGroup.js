import React from "react";
import UserAvatar from "../Users/UserAvatar.js";
import "./OneGroup.css";

function OneGroup(props) {
  return (
    <div className="one-group">
      <UserAvatar avatar={props.avatar} type="list-avatar" blockOpenInfo={true} />
      <p style={{ display: "inline-block", marginLeft: "10px" }}>
        {props.groupName}
      </p>
    </div>
  );
}

export default OneGroup;
