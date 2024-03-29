import FriendService from "../../services/friend-service";
import React, { useState, useEffect } from "react";
import OneFriend from "./OneFriend";
import { nanoid } from "nanoid";
import "./FriendList.css";
import V_arrow from "../../assets/icon/V_arrow.png";

function FriendList(props) {
  const [loading, setLoading] = useState(true); // 加载状态
  const [friends, setFriends] = useState([]);
  const [friendsClass, setFriendsClass] = useState({});

  // 首次渲染时，读取好友列表
  useEffect(() => {
    setLoading(true);
    FriendService.getAll()
      .then((res) => {
        let tmpFriendsClass = {};
        setFriends(
          res.data.entries.map((friend) => {
            tmpFriendsClass = {
              ...tmpFriendsClass,
              [friend.classification ? friend.classification : "我的好友"]: false, //默认不展开
            };
            return friend.classification
              ? friend
              : { ...friend, classification: "我的好友" }; // 默认组为"我的好友"
          })
        );
        setFriendsClass(tmpFriendsClass);
        setLoading(false);
        console.log("获取好友列表成功");
      })
      .catch((err) => {
        console.log("获取好友列表错误: " + err);
      });
  }, []);
  // 渲染好友列表
  const allFriends = Object.keys(friendsClass).map((friendClass) => {
    return (
      <div key={nanoid()}>
        {/* 按钮用于展开 */}
        <div
          className="class-title"
          onClick={() => {
            setFriendsClass({
              ...friendsClass,
              [friendClass]: !friendsClass[friendClass],
            });
          }}
        >
          <img
            className={
              friendsClass[friendClass] ? "V-arrow-icon open" : "V-arrow-icon"
            }
            src={V_arrow}
          />
          <span className="class-name">{friendClass}</span>
        </div>
        {/* 根据按钮的状态决定是否展开好友列表 */}
        <div className="class-content">
          {friendsClass[friendClass]
            ? friends
                .filter((friend) => friend.classification === friendClass)
                .map((friend) => {
                  return (
                    <OneFriend
                      key={nanoid()}
                      nickname={friend.nickname}
                      name={friend.name}
                      avatar={friend.avatar}
                      userId={friend.userId}
                      setTarget={props.setTarget}
                      setTargetName={props.setTargetName}
                      setTargetType={props.setTargetType}
                    />
                  );
                })
            : null}
        </div>
      </div>
    );
  });

  return (
    <div className="friend-list">
      {loading ? <div className="loading">加载中...</div> : allFriends}
    </div>
  );
}

export default FriendList;
