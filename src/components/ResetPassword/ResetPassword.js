import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.svg";
import "./ResetPassword.css";
import "../loglike.css";

function ResetPassword(props) {
  const [verifycode, setVerifycode] = useState("");
  const [phone, setPhone] = useState(props.phone);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tryAfter, setTryAfter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (tryAfter > 0) {
        setTryAfter(tryAfter - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleGetSms = async (e) => {
    e.preventDefault();
    try {
      await props.handleGetSms(phone);
      setTryAfter(60);
    } catch (err) {
      console.log(err);

      return;
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    props.handleResetPassword(verifycode, phone, password, confirmPassword);
  };

  return (
    <div className="parent">
      <div className="panel">
        <img src={logo} className="logo" alt="logo" />
        <h2 className="registerTitle loginTitle">重置密码</h2>
        <form onSubmit={handleRegister} id="registerForm" className="default-form">
          <div className="field">
            <label>手机号</label>
            <div className="row">
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label>手机验证码</label>
            <div className="row">
              <input
                type="verifycode"
                id="code"
                value={verifycode}
                onChange={(e) => setVerifycode(e.target.value)}
              />
              <button className="sms" onClick={handleGetSms} disabled={tryAfter > 0}>
                {tryAfter > 0 ? `${tryAfter}秒` : "验证码"}
              </button>
            </div>
          </div>
          <div className="field">
            <label>密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label>确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="canter">
            <button type="submit" className="field">
              重置密码
            </button>
          </div>
          <div className="center">
            <button
              onClick={props.handleLogout}
              type="button"
              className="switch"
            >
              返回
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
