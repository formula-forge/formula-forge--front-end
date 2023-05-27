import React from "react";
import "./Menu.css";

function FormulaMenu(props) {
  return (
    <div className="chat-menu" style={{ top: props.y, left: props.x }}>
      <button onClick={props.onDelete}>删除公式</button>
    </div>
  );
}

export default FormulaMenu;