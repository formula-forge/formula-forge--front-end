import React, { useEffect, useState } from "react";
import friendService from "../../services/friend-service";
import { nanoid } from "@reduxjs/toolkit";
import UserAvatar from "../Users/UserAvatar";
import "./AddList.css";

function AddList(props) {
  const [postedList, setPostedList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);

  const handleSetTarget = (addInfo) => {
    props.setTarget(addInfo);
    props.setTargetType("add");
    props.setTargetName(null);
  };

  useEffect(() => {
    friendService
      .getAllNewFriend()
      .then((res) => {
        console.log(res.data);
        if (res.data.posted) setPostedList([...res.data.posted]);
        if (res.data.received) setReceivedList([...res.data.received]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const allPostedList = postedList.map((addInfo) => {
    return (
      <div
        className="one-add"
        key={`${nanoid()}`}
        onClick={() => handleSetTarget(addInfo)}
      >
        <UserAvatar type="list-avatar" userId={addInfo.receiver} />
        <div className="info">
          <p>{addInfo.receiver}</p>
          <p>{addInfo.message}</p>
        </div>
        {addInfo.approved ? (
          <div className="acceptance">已通过</div>
        ) : (
          <div className="unacceptance">未通过</div>
        )}
      </div>
    );
  });
  const allReceivedList = receivedList.map((addInfo) => {
    return (
      <div
        className="one-add"
        key={`${nanoid()}`}
        onClick={() => handleSetTarget(addInfo)}
      >
        <UserAvatar type="list-avatar" userId={addInfo.sender} />
        <div className="info">
          <p>{addInfo.sender}</p>
          <p>{addInfo.message}</p>
        </div>
        {addInfo.approved ? (
          <div className="acceptance">已通过</div>
        ) : (
          <div className="unacceptance">未通过</div>
        )}
      </div>
    );
  });
  return (
    <div>
      <h2>已发送</h2>
      {allPostedList}
      <h2>已接收</h2>
      {allReceivedList}
    </div>
  );
}

export default AddList;