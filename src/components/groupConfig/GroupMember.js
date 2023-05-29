import React, { useEffect, useState } from "react";
import groupService from "../../services/group-service";
import { nanoid } from "nanoid";
import UserAvatar from "../Users/UserAvatar";
import friendService from "../../services/friend-service";
import "./GroupMember.css";

function GroupMember(props) {
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [listRefreshTrigger, setListRefreshTrigger] = useState(false); // 用于刷新列表
  const [addMember, setAddMember] = useState(false);
  const [addMemberList, setAddMemberList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // 用于添加成员时的列表
  useEffect(() => {
    setLoading(true);
    groupService
      .getMembers(props.groupId)
      .then((res) => {
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
  }, [props.groupId, listRefreshTrigger]);
  const handleDeleteMember = (userId) => {
    groupService
      .deleteMember(props.groupId, userId)
      .then((res) => {
        setListRefreshTrigger(!listRefreshTrigger);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const members = allMembers.map((member, index) => (
    <div key={nanoid()} className={`member${index != 0 ? " not-first" : ""}`}>
      <UserAvatar userId={member.userId} avatar={member.avatar} type="list-avatar" />
      <span>{member.name}</span>
      {isOwner && member.userId !== props.user ? (
        <button className="delete" onClick={() => handleDeleteMember(member.userId)}>
          删除
        </button>
      ) : (
        <button className="not-delete">群主</button>
      )}
    </div>
  ));
  const handleAddMember = () => {
    console.log(selectedMembers);
    selectedMembers.forEach((member) => {
      groupService
        .addMember(props.groupId, member)
        .then((res) => {
          console.log(res);
          setListRefreshTrigger(!listRefreshTrigger);
          setSelectedMembers([]);
          setAddMember(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const handleSelectMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers((p) => p.filter((id) => id !== userId));
    } else {
      setSelectedMembers((p) => [...p, userId]);
    }
  };
  const addMemberRenew = () => {
    const list = [];
    friendService
      .getAll()
      .then((res) => {
        res.data.entries.forEach((friend) => {
          if (!allMembers.some((member) => member.userId === friend.userId)) {
            list.push(
              <div
                key={nanoid()}
                className={"member" + (list.some(() => 1) ? " not-first" : "")}
              >
                <UserAvatar
                  userId={friend.userId}
                  avatar={friend.avatar}
                  type="list-avatar"
                />
                <span>{friend.name}</span>
                <input
                  type="checkbox"
                  id={`checkbox-${friend.userId}`}
                  className="checkbox"
                  onChange={() => handleSelectMember(friend.userId)}
                />
              </div>
            );
          }
        });
        setAddMemberList(list);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
      <div className="members">{loading ? <h3>加载中...</h3> : members}</div>
      <br />
      {isOwner && (
        <button
          className="add"
          onClick={() => {
            setAddMember(!addMember);
            addMemberRenew();
          }}
        >
          添加成员
        </button>
      )}
      {isOwner && addMember && (
        <div className="default-background">
          <div className="default-container">
            <h2>添加成员</h2>
            {addMemberList}
            <div className="two-buttons">
              <button className="confirm" onClick={handleAddMember}>
                添加
              </button>
              <button className="cancel" onClick={() => setAddMember(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupMember;
