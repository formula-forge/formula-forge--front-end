import React, { useState } from "react";
import "./Typebox.css";

const Typebox = (props) => {
  const [inputValue, setInputValue] = useState("");
  // 用于监听输入框的变化
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey) {
      // 按下回车键时提交表单
      handleSubmitForm(event);
    }
  };

  const handleSubmitForm = (event) => {
    if (inputValue === "") return; // 如果输入框为空则不发送消息
    event.preventDefault(); // 阻止表单默认提交行为
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
        onKeyDown={handleKeyDown}
      />
      <button className="submit" type="submit">
        发送
      </button>
    </form>
  );
};

export default Typebox;
