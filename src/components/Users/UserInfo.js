import React from "react";
import userService from "../../services/user-service";
import "./UserInfo.css";
import UserAvatar from "./UserAvatar";
import friendService from "../../services/friend-service";
import { useState } from "react";

function UserInfo(props) {
  const [noSuchUser, setNoSuchUser] = React.useState(false); // 用于判断是否有这个用户
  const [loading, setLoading] = React.useState(true); // 用于判断是否正在加载
  const [userInfo, setUserInfo] = React.useState({});
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const [addClassification, setAddClassification] = useState("");
  const [addNickname, setAddNickname] = useState("");
  const userId = props.userId;
  const setDisplay = props.setDisplay;
  const avatar = props.avatar;
  React.useEffect(() => {
    setLoading(true);
    userService
      .getInfo(userId)
      .then((response) => {
        setUserInfo(response.data.data);
        console.log(response.data.data);
        setNoSuchUser(false);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setNoSuchUser(true);
        setLoading(false);
      });
  }, [userId]);
  function detail() {
    const detail = [];
    if (userInfo.detail)
      for (let i = 0; i < userInfo.detail.length; i++) {
        detail.push(
          <p>{userInfo.detail[i].name + ": " + userInfo.detail[i].value}</p>
        );
      }
    return <div>{detail}</div>;
  }
  function addFriend(receiver, message, classification, nickname) {
    console.log(userInfo);
    try {
      if (userInfo.type === "stranger") {
        if (userInfo.protected) {
          friendService
            .postNewFriend(receiver, message, classification, nickname)
            .then((response) => {
              console.log(response.data);
              alert("好友申请已发送");
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          friendService.directAddFriend(receiver, classification, nickname);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  function handleChat() {
    props.setTarget(userInfo.userId);
    if (userInfo.nickname)
      props.setTargetName(userInfo.nickname + "(" + userInfo.name + ")");
    props.setTargetName(userInfo.name);
    props.setTargetType("friend");
    props.setDisplay(false);
  }
  function handleDelete() {
    friendService.deleteFriend(userInfo.userId);
    props.setDisplay(false);
  }
  function userOperation() {
    if (userInfo.type === "stranger") {
      return (
        <div className="user-info-add">
          <button className="user-info-add-button" onClick={() => setAdding(true)}>
            添加好友
          </button>
        </div>
      );
    } else if (userInfo.type === "friend") {
      return (
        <div className="two-buttons">
          <button className="user-info-chat-button confirm" onClick={handleChat}>
            发送消息
          </button>
          <button
            className="user-info-delete-button confirm"
            onClick={() => setDeleting(true)}
          >
            删除好友
          </button>
        </div>
      );
    }
  }
  function chooseCondition() {
    if (deleting) {
      return (
        <div>
          <h2>确定删除好友吗？</h2>
          <button className="user-info-delete-button" onClick={handleDelete}>
            确定删除
          </button>
          <button
            className="user-info-delete-button"
            onClick={() => setDeleting(false)}
          >
            取消
          </button>
        </div>
      );
    } else if (adding) {
      return (
        <div>
          <h2>添加好友</h2>
          <form className="default-form" id="userAdd">
            <input
              type="text"
              className="user-info-add-textarea"
              placeholder="分组"
              onChange={(e) => setAddClassification(e.target.value)}
            />
            <input
              type="text"
              className="user-info-add-textarea"
              placeholder="备注"
              onChange={(e) => setAddNickname(e.target.value)}
            />
            <textarea
              className="user-info-add-textarea"
              placeholder="验证信息"
              onChange={(e) => setAddMessage(e.target.value)}
            />
            <button
              className="user-info-add-button"
              onClick={() => {
                setAdding(false);
                addFriend(
                  userInfo.userId,
                  addMessage,
                  addClassification,
                  addNickname
                );
              }}
            >
              发送好友申请
            </button>
          </form>
        </div>
      );
    } else if (loading) {
      return <div>加载中...</div>;
    } else if (!noSuchUser) {
      return (
        <div>
          <div className="user-info-avatar">
            <UserAvatar type="big-avatar" userId={userId} blockOpenInfo={true} />
          </div>
          <div className="user-info-name">
            <h3>{userInfo.name + "(" + userInfo.userId + ")"}</h3>
          </div>
          <div className="user-info-detail">{detail()}</div>
          {userInfo.phone ? (
            <div className="user-info-phone">
              <p>{"电话: " + userInfo.phone}</p>
            </div>
          ) : null}
          {userInfo.motto ? (
            <div className="user-info-motto">
              <p>{"个性签名: " + userInfo.motto}</p>
            </div>
          ) : null}

          {userOperation()}
        </div>
      );
    } else {
      return <div>没有这个用户</div>;
    }
  }
  return (
    <div className="default-background">
      <div className="default-container">
        <button className="close-button" onClick={() => setDisplay(false)}>
          关闭
        </button>
        {chooseCondition()}
      </div>
    </div>
  );
}

export default UserInfo;
