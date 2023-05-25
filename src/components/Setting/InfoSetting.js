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
  
  const [modified, setModified] = useState(false);

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
        setIsProtected(res.data.data.protected);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleNameChange = (e) => {
    setName(e.target.value);
    setModified(true);
  };
  const handleDetailChange = (e) => {
    setDetail(e.target.value);
    setModified(true);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setModified(true);
  };
  const handleAvatarChange = (e) => {
    setAvatar(e.detail);
    setModified(true);
  };
  const handleMottoChange = (e) => {
    setMotto(e.target.value);
    setModified(true);
  };
  const handleIsProtectedChange = (e) => {
    setIsProtected(Boolean(e.target.value));
    setModified(true);
  };
  const handleResetPassword = (e) => {
    if((!modified) || window.confirm("放弃未保存的修改？")) {
      props.handleJumptoReset(phone);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setModified(false);
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
          <button type="button" className="resetPassword" onClick={handleResetPassword}>
            重置密码
          </button>
          <br />
          <button type="submit" disabled={!modified}>提交</button>
        </form>
      )}
    </div>
  );
}

export default InfoSetting;
