import React, { useEffect, useState } from "react";
import friendService from "../../services/friend-service";
import { nanoid } from "@reduxjs/toolkit";

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
      <div key={`${nanoid()}`} onClick={() => handleSetTarget(addInfo)}>
        <p>{addInfo.receiver}</p>
        <p>{addInfo.message}</p>
      </div>
    );
  });
  const allReceivedList = receivedList.map((addInfo) => {
    return (
      <div key={`${nanoid()}`} onClick={() => handleSetTarget(addInfo)}>
        <p>{addInfo.sender}</p>
        <p>{addInfo.message}</p>
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
