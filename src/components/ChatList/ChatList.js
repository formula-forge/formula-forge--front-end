import React, { useEffect, useMemo, useState } from "react";
import sessionService from "../../services/session-service";
import OneChat from "./OneChat";
import SessionMenu from "../ContextMenu/SessionMenu";
import { nanoid } from "@reduxjs/toolkit";
import "./ChatList.css";

function ChatList(props) {
  const [loading, setLoading] = useState(true); //是否正在加载中
  const [sessions, setSessions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [choosing, setChoosing] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuX, setContextMenuX] = useState(0);
  const [contextMenuY, setContextMenuY] = useState(0);
  const menuRef = React.useRef(null);
  // sessions: ["type": "user","id": 65,"latest": "1","time": 1682239164843,"unread": 1], ...
  useEffect(() => {
    console.log("Refresh ChatList");
    sessionService
      .getAll()
      .then((res) => {
        let newSessions = res.data.sessions;
        //按照时间排序
        newSessions.sort((a, b) => b.time - a.time);
        setSessions(newSessions);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshTrigger, props.newMessage]);
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuRef]);
  const handleDeleteSession = (type, sessionId) => {
    if (type === "user") {
      localStorage.removeItem(`messages:${props.user}-${sessionId}`);
      console.log(`messages:${props.user}-${sessionId}`);
    }
    sessionService
      .deleteSession(type === "group", sessionId)
      .then((res) => {
        setRefreshTrigger(refreshTrigger + 1);
        console.log(res);
        setShowContextMenu(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const allSessions = useMemo(() => {
    return sessions.map((session) => {
      return (
        <OneChat
          key={session.id}
          session={session}
          setTarget={props.setTarget}
          setTargetType={props.setTargetType}
          setTargetName={props.setTargetName}
          setRefreshTrigger={setRefreshTrigger}
          setChoosing={setChoosing}
          setShowContextMenu={setShowContextMenu}
          setContextMenuX={setContextMenuX}
          setContextMenuY={setContextMenuY}
        />
      );
    });
  }, [sessions]);
  return (
    <div className="chat-list">
      {!loading ? allSessions : <div className="loading">加载中...</div>}
      {showContextMenu && (
        <div ref={menuRef}>
          <SessionMenu
            onDelete={() => handleDeleteSession(choosing.type, choosing.id)}
            x={contextMenuX}
            y={contextMenuY}
          />
        </div>
      )}
    </div>
  );
}

export default ChatList;
