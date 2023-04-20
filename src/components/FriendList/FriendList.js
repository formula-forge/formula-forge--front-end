import FriendDataService from "../../services/friend-service";
import React, { useState, useEffect } from "react";
import test from "./test.json";
import OneFriend from "./oneFriend";
import { nanoid } from "nanoid";

import testID from "../../assets/userID/test.json";
const idData = testID.userID;

const friendsData = test.friends;

function FriendList(props) {
  const [friends, setFriends] = useState([]);
  const [friendsClass, setFriendsClass] = useState({});

  // 首次渲染时，读取好友列表
  useEffect(() => {
    let tmpFriendsClass = {};
    friendsData.forEach((friend) => {
      tmpFriendsClass = {
        ...tmpFriendsClass,
        [friend.class ? friend.class : "我的好友"]: false, //默认不展开
      };
    });
    setFriendsClass(tmpFriendsClass);
    // 默认组为"我的好友"
    setFriends(
      friendsData.map((friend) =>
        friend.class ? friend : { ...friend, class: "我的好友" }
      )
    );
  }, []);
  // 渲染好友列表
  const allFriends = Object.keys(friendsClass).map((friendClass) => {
    return (
      <div key={nanoid()}>
        {/* 按钮用于展开 */}
        <button
          onClick={() => {
            setFriendsClass({
              ...friendsClass,
              [friendClass]: !friendsClass[friendClass],
            });
          }}
        >
          {friendClass}
        </button>
        {/* 根据按钮的状态决定是否展开好友列表 */}
        <div>
          {friendsClass[friendClass]
            ? friends
                .filter((friend) => friend.class === friendClass)
                .map((friend) => {
                  return (
                    <OneFriend
                      key={nanoid()}
                      name={
                        friend.nickname ? friend.nickname : idData[friend.userID]
                      }
                      avatar={friend.avatar}
                      userID={friend.userID}
                      setTarget={props.setTarget}
                      setTargetType={props.setTargetType}
                    />
                  );
                })
            : null}
        </div>
      </div>
    );
  });

  return <div className="friend-list">{allFriends}</div>;
}

export default FriendList;
