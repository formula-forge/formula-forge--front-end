import React, { useEffect, useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./Log.css";
import logo from "../../assets/logo.svg";

function Log(props) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
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

  const handleLogin = (e) => {
    e.preventDefault();
    props.handleLogin(username, phone, password);
  };

  const userNameInput = (
    <div className="field">
      <label>昵称</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
  );

  const phoneInput = (
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
  );

  const phoneInputButtoned = (
    <div className="field">
      <label>手机号</label>
      <input
        type="text"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
  );

  const passwordInput = (
    <div className="field">
      <label>密码</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );

  const codeInput = (
    <div className="field">
      <label>验证码</label>
      <div className="row">
        <input
          type="code"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          disabled={tryAfter > 0}
          type="button"
          className="sms"
          onClick={handleGetSms}
        >
          {tryAfter > 0 ? tryAfter + "s" : "验证码"}
        </button>
      </div>
    </div>
  );

  const switchToRegisterButton = (
    <div className="center">
      <button
        onClick={() => {
          props.setRegistering(true);
          props.setLogging(false);
        }}
        type="button"
        className="switch"
      >
        注册
      </button>
    </div>
  );

  const loginButton = (
    <div className="center">
      <button type="submit" className="field">
        登录
      </button>
    </div>
  );

  const usernameLogin = (
    <form onSubmit={handleLogin} className="default-form">
      {userNameInput}
      {passwordInput}
      {loginButton}
      {switchToRegisterButton}
    </form>
  );

  const phoneLogin = (
    <form onSubmit={handleLogin} className="default-form">
      {phoneInput}
      {passwordInput}
      {loginButton}
      {switchToRegisterButton}
    </form>
  );

  const codeLogin = (
    <form onSubmit={handleLogin} className="default-form">
      {phoneInputButtoned}
      {codeInput}
      {loginButton}
      {switchToRegisterButton}
    </form>
  );

  return (
    <div id="loginParent">
      <div className="login">
        <img src={logo} className="logo" alt="logo" />
        <h2 className="loginTitle">登录</h2>
        <Tabs className="loginTabs">
          <TabList>
            <Tab>用户名登录</Tab>
            <Tab>手机号登录</Tab>
            <Tab>验证码登录</Tab>
          </TabList>

          <TabPanel>{usernameLogin}</TabPanel>
          <TabPanel>{phoneLogin}</TabPanel>
          <TabPanel>{codeLogin}</TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Log;
