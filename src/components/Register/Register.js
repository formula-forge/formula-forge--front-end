import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.svg";
import "./Register.css";

function Log(props) {
  const [verifycode, setVerifycode] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tryAfter, setTryAfter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (tryAfter > 0) {
        setTryAfter(tryAfter - 1);
      }
    }
    , 1000);
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
    props.handleRegister(verifycode, phone, username, password);
  };

  return (
    <div id="registerParent">
      <div className="register">
        <img src={logo} className="logo" alt="logo"/>
        <h2 className="registerTitle">注册</h2>
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
              <button
                className="sms"
                onClick={handleGetSms}
                disabled={tryAfter > 0}
              >
                {tryAfter > 0 ? `${tryAfter}秒` : "验证码"}
              </button>
            </div>
          </div>
          <div className="field">
            <label>昵称</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
              注册 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Log;
