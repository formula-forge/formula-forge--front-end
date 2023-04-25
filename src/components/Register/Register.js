import React, { useState } from "react";

function Log(props) {
  const [verifycode, setVerifycode] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    props.handleRegister(verifycode, phone, username, password);
  };

  return (
    <div>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>username:</label>
          <br />
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>phone:</label>
          <br />
          <input
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>verifycode:</label>
          <br />
          <input
            type="verifycode"
            value={verifycode}
            onChange={(e) => setVerifycode(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Log;
