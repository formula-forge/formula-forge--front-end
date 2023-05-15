import React, { useEffect, useState } from "react";
import formulaService from "../../services/formula-service";
import { nanoid } from "@reduxjs/toolkit";
import "./Formula.css";

function Formula(props) {
  const [formula, setFormula] = useState({});
  const [formulaClass, setFormulaClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingFormula, setAddingFormula] = useState(false);
  const [addingFormulaClass, setAddingFormulaClass] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [deletingFormulaClass, setDeletingFormulaClass] = useState(false);
  useEffect(() => {
    setLoading(true);
    formulaService
      .getAll()
      .then((response) => {
        console.log(response.data);
        let formula = response.data.formula;
        if (!formula) formula = { 默认: [] };
        setFormulaClass(Object.keys(formula)[0]);
        setFormula(formula);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [deleteTrigger]);
  const handleFormulaClick = (formula) => {
    props.onFormula(formula);
  };

  const handleSubmitFormula = (event) => {
    event.preventDefault();
    const newName = document.getElementById("add-formula-name").value;
    const newContent = document.getElementById("add-formula-formula").value;
    if (!formula) return;
    const newFormula = { name: newName, formula: newContent, face: newContent };
    const newAllFormula = formula[formulaClass].concat(newFormula);
    const newFormulaObj = { ...formula, [formulaClass]: newAllFormula };
    formulaService
      .putAll(newFormulaObj)
      .then((response) => {
        console.log(response);
        setFormula(newFormulaObj);
        setAddingFormula(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSubmitClass = (event) => {
    event.preventDefault();
    const newClass = document.getElementById("add-class-name").value;
    const newFormulaObj = { ...formula, [newClass]: [] };
    formulaService
      .putAll(newFormulaObj)
      .then((response) => {
        console.log(response);
        setFormula(newFormulaObj);
        setAddingFormulaClass(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleDeleteClass = (event) => {
    event.preventDefault();
    const newFormulaObj = formula;
    delete newFormulaObj[formulaClass];
    formulaService
      .putAll(newFormulaObj)
      .then((response) => {
        console.log(response);
        setFormula(newFormulaObj);
        setDeleteTrigger((p) => !p);
        setDeletingFormulaClass(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addFormula = () => {
    return (
      <div className="add-formula-container">
        <form className="add-formula-form" onSubmit={handleSubmitFormula}>
          <input placeholder="名称" id="add-formula-name" />
          <button
            onClick={() => {
              setAddingFormula(false);
            }}
            type="button"
          >
            x
          </button>
          <input placeholder="公式" id="add-formula-formula" />
          <button type="submit">添加</button>
        </form>
      </div>
    );
  };
  const addClass = () => {
    return (
      <div className="add-class-container">
        <form className="add-class-form" onSubmit={handleSubmitClass}>
          <input placeholder="名称" id="add-class-name" />
          <button type="submit">添加</button>
          <button
            onClick={() => {
              setAddingFormulaClass(false);
            }}
            type="button"
          >
            x
          </button>
        </form>
      </div>
    );
  };
  const allFormula = (formula[formulaClass] ? formula[formulaClass] : []).map(
    (formula) => {
      return (
        <div
          className="formula-item"
          key={nanoid()}
          onClick={() => {
            handleFormulaClick(formula.formula);
          }}
          type="button"
        >
          <p>{formula.name}</p>
          <p>{formula.face}</p>
        </div>
      );
    }
  );
  const allClass = Object.keys(formula).map((oneFormulaClass) => {
    return (
      <div
        key={oneFormulaClass}
        className={
          oneFormulaClass === formulaClass
            ? "choosing-formula-class formula-class"
            : "formula-class"
        }
      >
        <button
          onClick={() => {
            setFormulaClass(oneFormulaClass);
          }}
          type="button"
        >
          {oneFormulaClass}
        </button>
      </div>
    );
  });
  const deleteFormulaClassConfirm = () => {
    return (
      <div>
        <p>确认删除该分组？</p>
        <button onClick={handleDeleteClass} type="button">
          确认
        </button>
        <button
          onClick={() => {
            setDeletingFormulaClass(false);
          }}
          type="button"
        >
          取消
        </button>
      </div>
    );
  };
  return (
    <div className="formula-container">
      {addingFormula ? addFormula() : ""}
      {addingFormulaClass ? addClass() : ""}
      {deletingFormulaClass ? deleteFormulaClassConfirm() : ""}
      <div className="formula-item-container">
        {!loading ? (
          <>
            {allFormula}
            <div className="formula-item">
              <div
                onClick={() => {
                  setAddingFormula(true);
                }}
              >
                添加公式
              </div>
              <br />
              <br />
              <div
                onClick={() => {
                  setDeletingFormulaClass(true);
                }}
              >
                删除该分组
              </div>
            </div>
          </>
        ) : (
          "加载中..."
        )}
      </div>
      <div className="formula-class-container">
        {!loading ? (
          <>
            {allClass}
            <div className="formula-class">
              <button
                onClick={() => {
                  setAddingFormulaClass(true);
                }}
                type="button"
              >
                (+)
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Formula;
