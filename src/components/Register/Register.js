import React, { useState } from "react";

function Log(props) {
  const [verifycode, setVerifycode] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    props.handleRegister(verifycode, phone, username, password);
  };

  return (
    <div>
      <h2>注册</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>手机号</label>
          <br />
          <input
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>昵称</label>
          <br />
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>密码</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>确认密码</label>
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label>手机验证码</label>
          <br />
          <input
            type="verifycode"
            value={verifycode}
            onChange={(e) => setVerifycode(e.target.value)}
          />
        </div>

        <button type="submit">注册</button>
      </form>
    </div>
  );
}

export default Log;
