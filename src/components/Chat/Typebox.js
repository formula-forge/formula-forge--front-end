import React, { useState } from "react";
import "./Typebox.css";
import Formula from "./Formula";

const Typebox = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [formulaOpen, setFormulaOpen] = useState(false);
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
    event.preventDefault(); // 阻止表单默认提交行为
    if (inputValue === "") return; // 如果输入框为空则不发送消息
    if (props.handleSubmit(inputValue)) setInputValue("");
  };
  return (
    <>
      <form className="form" onSubmit={handleSubmitForm}>
        {formulaOpen && <Formula setFormulaOpen={setFormulaOpen} />}
        {/* form能够监听回车事件与点击事件 */}
        <textarea
          className="chat-typebox-area"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="chat-typebox-button-container">
          <button className="formula" onClick={() => setFormulaOpen(!formulaOpen)}>
            公式
          </button>
          <button className="submit" type="submit">
            发送
          </button>
        </div>
      </form>
    </>
  );
};

export default Typebox;
