import React, { useState, useRef } from "react";
import "./Typebox.css";
import Formula from "./Formula";

const Typebox = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [history, setHistory] = useState([""]);
  const textareaRef = useRef(null);
  // 用于监听输入框的变化
  const handleChange = (event) => {
    setInputValue(event.target.value);
    setHistory((history) => [...history, event.target.value]);
  };
  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey) {
      // 按下回车键时提交表单
      handleSubmitForm(event);
    } else if (event.ctrlKey && event.key === "z") {
      event.preventDefault();
      if (history.length > 1) {
        const previousState = history[history.length - 2];
        setHistory((prev) => prev.slice(0, -1));
        setInputValue(previousState);
      }
    }
  };
  const handleFormulaClick = (formula) => {
    const { current: textarea } = textareaRef;
    const { selectionStart, selectionEnd, value } = textarea;

    const newValue =
      value.substring(0, selectionStart) + formula + value.substring(selectionEnd);
    textarea.value = newValue;

    // 恢复光标位置
    const newCursorPosition = selectionStart + formula.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();

    setInputValue(newValue);
    setHistory((history) => [...history, inputValue]);
  };
  const handleSubmitForm = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    if (inputValue === "") return; // 如果输入框为空则不发送消息
    props.handleSubmit(inputValue);
    setInputValue("");
    setHistory([""]);
  };
  return (
    <>
      <form className="form" onSubmit={handleSubmitForm}>
        {formulaOpen && (
          <Formula setFormulaOpen={setFormulaOpen} onFormula={handleFormulaClick} />
        )}
        {/* form能够监听回车事件与点击事件 */}
        <textarea
          className="chat-typebox-area"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
        />
        <div className="chat-typebox-button-container">
          <button
            className="formula"
            type="button"
            onClick={() => setFormulaOpen(!formulaOpen)}
          >
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
