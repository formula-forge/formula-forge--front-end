import React from "react";
import groupService from "../../services/group-service";
import DragDropFile from "../Setting/Uploader/DragDropFile";
import { useState, useEffect } from "react";
import "./GroupSetting.css";

function GroupSetting(props) {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false); // 确认删除
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
  const handleDeleteGroup = () => {
    groupService
      .deleteGroup(groupId)
      .then((res) => {
        console.log(res);
        alert("删除成功");
        props.setTargetType("");
      })
      .catch((err) => {
        console.log(err);
        alert("删除失败");
      });
  };
  const deleteGroup = (
    <div className="delete-group-background">
      <div className="delete-group-container">
        <h2>确认删除群组？</h2>
        <div className="two-buttons">
          <button className="confirm-delete" onClick={() => handleDeleteGroup()}>
            确认
          </button>
          <button className="cancel-delete" onClick={() => setConfirmDelete(false)}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="group-setting">
      <button className="back" onClick={() => props.setTargetType("group-member")}>
        返回
      </button>
      <h1>群组设置</h1>
      {loading ? (
        <h4>加载中...</h4>
      ) : (
        <form onSubmit={handleSave} className="default-form">
          <label htmlFor="name">群组名</label>
          <input type="text" value={groupName} onChange={handleGroupNameChange} />
          <label htmlFor="avatar">头像</label>
          <DragDropFile value={groupAvatar} onChange={handleAvatarChange} />
          <br />
          <button className="submit-button" type="submit">
            提交
          </button>
          {loading ? null : (
            <button
              type="button"
              className="delete-button"
              onClick={() => setConfirmDelete(true)}
            >
              解散
            </button>
          )}
        </form>
      )}
      {confirmDelete ? deleteGroup : null}
    </div>
  );
}

export default GroupSetting;
