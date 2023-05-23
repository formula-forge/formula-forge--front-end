import React, { useEffect, useState } from "react";
import groupService from "../../services/group-service";
import { nanoid } from "nanoid";
import UserAvatar from "../Users/UserAvatar";
import "./GroupMember.css";

function GroupMember(props) {
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setLoading(true);
    groupService
      .getMembers(props.groupId)
      .then((res) => {
        console.log(res.data);
        setAllMembers(res.data.members);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    groupService
      .getById(props.groupId)
      .then((res) => {
        setIsOwner(res.data.role === "owner");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.groupId]);
  const handleDeleteMember = (userId) => {
    groupService
      .deleteMember(props.groupId, userId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const members = allMembers.map((member) => (
    <div key={nanoid()} className="member">
      <UserAvatar userId={member.userId} avatar={member.avatar} type="list-avatar" />
      <span>{member.name}</span>
      {isOwner && (
        <button className="delete" onClick={() => handleDeleteMember(member.userId)}>
          删除
        </button>
      )}
    </div>
  ));
  return (
    <div className="group-members">
      <button className="back" onClick={() => props.setTargetType("group")}>
        返回
      </button>
      {isOwner && (
        <button
          className="setting"
          onClick={() => props.setTargetType("group-setting")}
        >
          设置
        </button>
      )}
      <h1>群组成员</h1>
      <div className="members">{loading ? <h1>加载中...</h1> : members}</div>
    </div>
  );
}

export default GroupMember;
