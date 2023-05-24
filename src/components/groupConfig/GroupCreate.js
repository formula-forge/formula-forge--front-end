import React, { useEffect, useState } from "react";
import groupService from "../../services/group-service";
import DragDropFile from "../Setting/Uploader/DragDropFile";
import "./GroupCreate.css";

function GroupCreate(props) {
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("default");

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleGroupAvatarChange = (e) => {
    setGroupAvatar(e.detail);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName === "") {
      alert("群组名称不能为空");
      return;
    }
    groupService
      .createGroup(groupName, groupAvatar)
      .then((res) => {
        console.log(res);
        alert("创建成功");
        props.setGroupListRefreshTrigger((prev) => !prev);
        props.setTargetType("");
      })
      .catch((err) => {
        console.log(err);
        alert("创建失败");
      });
  };
  return (
    <div className="group-create">
      <h1>创建群组</h1>
      <form onSubmit={handleSubmit} className="default-form">
        <label htmlFor="group-name">群组名称</label>
        <input type="text" value={groupName} onChange={handleGroupNameChange} />
        <label htmlFor="group-avatar">群组头像</label>
        <DragDropFile value={groupAvatar} onChange={handleGroupAvatarChange} />
        <br />
        <button type="submit">创建</button>
      </form>
    </div>
  );
}

export default GroupCreate;
