import React, { useEffect } from "react";
import formulaService from "../../services/formula-service";
import { nanoid } from "@reduxjs/toolkit";
import "./Formula.css";

function Formula(props) {
  const [formula, setFormula] = React.useState({});
  const [formulaClass, setFormulaClass] = React.useState("");
  useEffect(() => {
    formulaService
      .getAll()
      .then((response) => {
        setFormula({
          默认: [
            {
              face: "\\sqrt[\\square]{\\square}",
              name: "方根",
              formula: "\\sqrt[]{}",
            },
          ],
          算术: [
            {
              face: "\\sqrt[\\square]{\\square}",
              name: "方根",
              formula: "\\sqrt[]{}",
            },
            {
              face: "\\log_{\\square}{\\square}",
              name: "对数",
              formula: "\\log_{]{}",
            },
            {
              face: "\\frac{\\square}{\\square}",
              name: "分数",
              formula: "\\frac{}{}",
            },
          ],
          微积分: [
            {
              face: "\\int_{\\square}^{\\square}{\\square}",
              name: "定积分",
              formula: "\\int_{}^{}{}",
            },
          ],
          ...response.data.formula,
        });
        setFormulaClass("默认");
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const allFormula = (formula[formulaClass] ? formula[formulaClass] : []).map(
    (formula) => {
      return (
        <div className="formula-item" key={nanoid()}>
          <p>{formula.name}</p>
          <p>{formula.face}</p>
        </div>
      );
    }
  );
  const allClass = Object.keys(formula).map((formulaClass) => {
    return (
      <div key={formulaClass} className="formula-class">
        <button
          onClick={() => {
            setFormulaClass(formulaClass);
          }}
        >
          {formulaClass}
        </button>
      </div>
    );
  });
  return (
    <div className="formula-container">
      <div className="formula-item-container">{allFormula}</div>
      <div className="formula-class-container">{allClass}</div>
    </div>
  );
}

export default Formula;
