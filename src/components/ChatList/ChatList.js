import React, { useEffect, useState } from "react";
import sessionService from "../../services/session-service";
import OneChat from "./OneChat";
import { nanoid } from "@reduxjs/toolkit";
import "./ChatList.css";

function ChatList(props) {
  const [sessions, setSessions] = useState([]);
  // sessions: ["type": "user","id": 65,"latest": "1","time": 1682239164843,"unread": 1], ...
  useEffect(() => {
    sessionService
      .getAll()
      .then((res) => {
        let newSessions = res.data.sessions;
        //按照时间排序
        newSessions.sort((a, b) => b.time - a.time);
        setSessions(newSessions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const allSessions = sessions.map((session) => {
    return (
      <OneChat
        key={`chatlist-${nanoid()}`}
        session={session}
        setTarget={props.setTarget}
        setTargetType={props.setTargetType}
        setTargetName={props.setTargetName}
      />
    );
  });
  return <div className="chat-list">{allSessions}</div>;
}

export default ChatList;
