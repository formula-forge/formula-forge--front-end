import React, { useState } from "react";

const Typebox = (props) => {
  const [inputValue, setInputValue] = useState("");
  // 用于监听输入框的变化
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmitForm = (event) => {
    if (inputValue === "") return; // 如果输入框为空则不发送消息
    event.preventDefault(); // 阻止表单默认提交行为
    if (props.handleSubmit(inputValue)) setInputValue("");
  };
  return (
    <form onSubmit={handleSubmitForm}>
      {/* form能够监听回车事件与点击事件 */}
      <input type="text" value={inputValue} onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
};

export default Typebox;
