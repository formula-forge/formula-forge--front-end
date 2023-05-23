import React, { useEffect, useState } from "react";
import userService from "../../services/user-service";
import FriendService from "../../services/friend-service";
import UserAvatar from "../Users/UserAvatar";

function Add(props) {
  const [moreInfo, setMoreInfo] = useState({});
  const [classification, setClassification] = useState("");
  const [nickname, setNickname] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  useEffect(() => {
    if (props.addInfo.receiver) {
      userService
        .getInfo(props.addInfo.receiver)
        .then((res) => {
          setMoreInfo(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (props.addInfo.sender) {
      userService
        .getInfo(props.addInfo.sender)
        .then((res) => {
          setMoreInfo(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setClassification("");
    setNickname("");
  }, [props, refreshTrigger]);
  const postedAdd = () => {
    return (
      <div>
        <h2>已发送好友申请</h2>
        <UserAvatar type="big-avatar" userId={props.addInfo.receiver} />
        <div>
          <p>{moreInfo.userId}</p>
          <p>{moreInfo.name}</p>
        </div>
        <p>{JSON.stringify(moreInfo.detail)}</p>
        <p>{props.addInfo.message}</p>
      </div>
    );
  };
  const handleClassification = (event) => {
    setClassification(event.target.value);
  };
  const handleNickname = (event) => {
    setNickname(event.target.value);
  };
  const handleAgree = (event) => {
    event.preventDefault();
    FriendService.agreeNewFriend(
      props.addInfo.sender,
      props.addInfo.appId,
      classification,
      nickname
    )
      .then((res) => {
        console.log(res);
        setRefreshTrigger(!refreshTrigger);
      })
      .catch((err) => {
        console.log(err);
        alert("操作失败");
      });
  };
  const receivedAdd = () => {
    return (
      <div>
        <h2>已接收好友申请</h2>
        <UserAvatar type="big-avatar" userId={props.addInfo.sender} />
        <div>
          <p>{moreInfo.userId}</p>
          <p>{moreInfo.name}</p>
        </div>
        <p>{JSON.stringify(moreInfo.detail)}</p>
        <p>{props.addInfo.message}</p>
        {moreInfo.type === "friend" ? (
          <p>已为好友</p>
        ) : props.addInfo.approved ? null : (
          <form onSubmit={handleAgree}>
            <label>分组</label>
            <textarea
              type="text"
              onChange={handleClassification}
              value={classification}
            />
            <label>备注</label>
            <textarea type="text" onChange={handleNickname} value={nickname} />
            <button type="submit">同意</button>
          </form>
        )}
      </div>
    );
  };
  return (
    <div>
      {props.addInfo.receiver ? postedAdd() : receivedAdd()}
      {console.log(props.addInfo)}
    </div>
  );
}

export default Add;
