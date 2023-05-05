import React from "react";
import userService from "../../services/user-service";
import "./UserInfo.css";

function UserInfo(props) {
  const [userInfo, setUserInfo] = React.useState({});
  const userId = props.userId;
  const setDisplay = props.setDisplay;
  React.useEffect(() => {
    userService
      .getInfo(userId)
      .then((response) => {
        setUserInfo(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userId]);
  return (
    <div className="user-info-background">
      <div className="user-info-container">
        <button className="close-button" onClick={() => setDisplay(false)}>
          关闭
        </button>
        <div className="user-info-name">
          <h3>{userInfo.name + "(" + userInfo.userId + ")"}</h3>
        </div>
        <div className="user-info-detail">
          <p>{`${JSON.stringify(userInfo.detail)}`}</p>
        </div>
        <div className="user-info-phone">
          <p>{userInfo.phone}</p>
        </div>
        <div className="user-info-motto">
          <p>{userInfo.motto}</p>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
