import React, { useEffect, useState } from "react";
import userService from "../../services/user-service";
import FriendService from "../../services/friend-service";

function Add(props) {
  const [moreInfo, setMoreInfo] = useState({});
  useEffect(() => {
    if (props.addInfo.receiver) {
      userService
        .getInfo(props.receiver)
        .then((res) => {
          setMoreInfo(res.data.data);
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (props.addInfo.sender) {
      userService
        .getInfo(props.addInfo.sender)
        .then((res) => {
          setMoreInfo(res.data.data);
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const postedAdd = () => {
    return (
      <div>
        <h2>已发送好友申请</h2>
        <p>{moreInfo.name}</p>
      </div>
    );
  };
  const handleAgree = () => {
    FriendService.agreeNewFriend(props.addInfo.sender, props.addInfo.appId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const receivedAdd = () => {
    return (
      <div>
        <h2>已接收好友申请</h2>
        <p>{moreInfo.name}</p>
        <button onClick={handleAgree}>同意</button>
      </div>
    );
  };
  return <div>{props.receiver ? postedAdd() : receivedAdd()}</div>;
}

export default Add;
