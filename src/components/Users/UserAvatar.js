import React, { useContext } from "react";
import "./UserAvatar.css";
import UserContext from "./../../Context";

function UserAvatar(props) {
  const { setGetUserInfoId, setUserInfoDisplay } = useContext(UserContext);
  return (
    <div
      onClick={() => {
        if (props.blockOpenInfo) return;
        setGetUserInfoId(props.userId);
        setUserInfoDisplay(true);
      }}
      style={{ display: "inline-block" }}
    >
      {props.avatar ? (
        <img
          src={"https://home.xn--qby.cf/img/" + props.avatar + ".png"}
          alt="avatar"
          className={props.type}
        />
      ) : (
        <img
          src={"https://home.xn--qby.cf/img/avatar/user/" + props.userId}
          alt="avatar"
          className={props.type}
        />
      )}
    </div>
  );
}

export default UserAvatar;
