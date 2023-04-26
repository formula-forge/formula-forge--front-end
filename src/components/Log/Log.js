import React, { useState } from "react";

function Log(props) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    props.handleLogin(username, phone, password);
  };

  return (
    <div>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
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
          <label>手机号</label>
          <br />
          <input
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default Log;
