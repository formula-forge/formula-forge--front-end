import React, { useState } from "react";
import "./Typebox.css";

const Typebox = (props) => {
  const [inputValue, setInputValue] = useState("");
  // 用于监听输入框的变化
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmitForm = (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    if (inputValue === "") return; // 如果输入框为空则不发送消息
    if (props.handleSubmit(inputValue)) setInputValue("");
  };
  return (
    <form className="form" onSubmit={handleSubmitForm}>
      {/* form能够监听回车事件与点击事件 */}
      <textarea
        className="chat-typebox-area"
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Typebox;
