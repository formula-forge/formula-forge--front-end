import React from "react";
import "./oneFriend.css";
import UserAvatar from "../Users/UserAvatar.js";
import { useContext } from "react";
import UserContext from "../../Context";

function OneFriend(props) {
  const { setGetUserInfoId, setUserInfoDisplay } = useContext(UserContext);
  const handleClick = () => {
    setGetUserInfoId(props.userId);
    setUserInfoDisplay(true);
  };
  return (
    <div className="one-friend" onClick={handleClick}>
      <UserAvatar type="list-avatar" userId={props.userId} />
      {props.nickname ? (
        <p style={{ display: "inline-block", marginLeft: "10px" }}>
          {props.nickname + "(" + props.name + ")"}
        </p>
      ) : (
        <p style={{ display: "inline-block", marginLeft: "10px" }}>{props.name}</p>
      )}
    </div>
  );
}

export default OneFriend;
