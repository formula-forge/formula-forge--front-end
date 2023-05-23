import React from "react";
import groupService from "../../services/group-service";
import DragDropFile from "./Uploader/DragDropFile";
import { useState, useEffect } from "react";
import "./GroupSetting.css";

function GroupSetting(props) {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    groupService
      .getById(props.groupId)
      .then((res) => {
        setGroupId(res.data.groupId);
        setGroupName(res.data.name);
        setGroupAvatar(res.data.avatar);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.groupId]);
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleAvatarChange = (e) => {
    setGroupAvatar(e.detail);
  };
  const handleSave = (e) => {
    e.preventDefault();
    groupService
      .updateGroupInfo(groupId, groupName, groupAvatar)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="group-setting">
      <button className="back" onClick={() => props.setTargetType("group-member")}>
        返回
      </button>
      <h1>群组设置</h1>
      {loading ? (
        <h4>加载中...</h4>
      ) : (
        <form onSubmit={handleSave} className="group-setting-form">
          <label htmlFor="name">群组名</label>
          <input type="text" value={groupName} onChange={handleGroupNameChange} />
          <label htmlFor="avatar">头像</label>
          <DragDropFile value={groupAvatar} onChange={handleAvatarChange} />
          <br />
          <button className="submit-button" type="submit">
            提交
          </button>
        </form>
      )}
    </div>
  );
}

export default GroupSetting;
