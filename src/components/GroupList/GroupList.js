import React, { useEffect, useState } from "react";
import groupService from "../../services/group-service";
import { nanoid } from "@reduxjs/toolkit";
import "./GroupList.css";
import OneGroup from "./OneGroup";

function GroupList(props) {
  const [loading, setLoading] = useState(true); // 加载状态
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    setLoading(true);
    groupService
      .getAll()
      .then((res) => {
        setGroups(res.data.entries);
        setLoading(false);
      })
      .catch((err) => {
        console.log("获取群组列表错误: " + err);
      });
  }, [props.groupListRefreshTrigger]);
  useEffect(() => {
    if (props.targetType === "") {
      setLoading(true);
      groupService
        .getAll()
        .then((res) => {
          setGroups(res.data.entries);
          setLoading(false);
        })
        .catch((err) => {
          console.log("获取群组列表错误: " + err);
        });
    }
  }, [props.targetType]);
  const handleChangeTarget = (id, name) => {
    props.setTarget(id);
    props.setTargetType("group");
    props.setTargetName(name);
  };
  const allGroups = groups.map((group) => {
    return (
      <div
        key={nanoid()}
        onClick={() => handleChangeTarget(group.groupId, group.name)}
      >
        <OneGroup avatar={group.avatar} groupName={group.name} />
      </div>
    );
  });

  return (
    <div>
      <button
        className="group-create-button"
        onClick={() => props.setTargetType("group-create")}
      >
        创建群组
      </button>
      {loading ? <h1>加载中...</h1> : allGroups}
    </div>
  );
}

export default GroupList;
