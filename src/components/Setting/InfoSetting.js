import React, { useEffect, useState } from "react";
import userService from "../../services/user-service";
import "./InfoSetting.css";
import DragDropFile from "./Uploader/DragDropFile";

function InfoSetting(props) {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState({});
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [motto, setMotto] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    setLoading(true);
    userService
      .getYourself()
      .then((res) => {
        setName(res.data.data.name);
        setDetail(res.data.data.detail);
        setPhone(res.data.data.phone);
        setAvatar(res.data.data.avatar);
        setMotto(res.data.data.motto);
        setIsProtected(res.data.data.isProtected);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDetailChange = (e) => {
    setDetail(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleAvatarChange = (e) => {
    setAvatar(e.detail);
  };
  const handleMottoChange = (e) => {
    setMotto(e.target.value);
  };
  const handleIsProtectedChange = (e) => {
    setIsProtected(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    userService
      .changeInfo(name, detail, phone, avatar, motto, isProtected)
      .then((res) => {
        console.log(res.data);
        alert("信息修改成功");
      })
      .catch((err) => {
        console.log(err);
        alert("信息修改失败");
      });
    if (newPassword !== "") {
      userService
        .changePassword(props.user, phone, newPassword)
        .then((res) => {
          console.log(res.data);
          alert("密码修改成功");
        })
        .catch((err) => {
          console.log(err);
          console.log(props.user, phone, newPassword);
          alert("密码修改失败");
        });
    }
  };
  return (
    <div className="info-setting">
      <h1>个人信息设置</h1>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <form onSubmit={handleSubmit} className="default-form">
          <label htmlFor="name">用户名</label>
          <input className="name" value={name} onChange={handleNameChange} />
          <label htmlFor="detail">手机号</label>
          <input className="phone" value={phone} onChange={handlePhoneChange} />
          <label htmlFor="avatar">头像</label>
          <DragDropFile value={avatar} onChange={handleAvatarChange} />
          <label htmlFor="motto">个性签名</label>
          <input className="motto" value={motto} onChange={handleMottoChange} />
          {/*isProtected是布尔值*/}
          <label htmlFor="isProtected">是否需要验证</label>
          <select value={isProtected} onChange={handleIsProtectedChange}>
            <option value={true}>需要验证</option>
            <option value={false}>不需要验证</option>
          </select>
          <label htmlFor="newPassword">新密码</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <br />
          <button type="submit">提交</button>
        </form>
      )}
    </div>
  );
}

export default InfoSetting;
