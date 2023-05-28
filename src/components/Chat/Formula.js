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
  const [deletingFormula, setDeletingFormula] = useState(false);
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
    const newFormula = { name: newName, formula: newContent, face: String(newContent).replaceAll("{}","{\\square}") };
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
  const handleDeleteFormula = (event, deletedFormula) => {
    event.stopPropagation();
    const newAllFormula = formula[formulaClass].filter(
      (oneFormula) => oneFormula !== deletedFormula
    );
    const newFormulaObj = { ...formula, [formulaClass]: newAllFormula };
    formulaService
      .putAll(newFormulaObj)
      .then((response) => {
        console.log(response);
        setFormula(newFormulaObj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addFormula = () => {
    return (
      <div className="add-container">
        <form
          className="add-formula-form default-form"
          onSubmit={handleSubmitFormula}
        >
          <input placeholder="名称" id="add-formula-name" />
          <input placeholder="公式" id="add-formula-formula" />
          <button type="submit" className="confirm">
            添加
          </button>
          <button
            onClick={() => {
              setAddingFormula(false);
            }}
            className="cancel"
            type="button"
          >
            取消
          </button>
        </form>
      </div>
    );
  };
  const addClass = () => {
    return (
      <div className="add-container">
        <form className="add-formula-form default-form" onSubmit={handleSubmitClass}>
          <input placeholder="名称" id="add-class-name" />
          <button type="submit" className="confirm">
            添加
          </button>
          <button
            onClick={() => {
              setAddingFormulaClass(false);
            }}
            className="cancel"
            type="button"
          >
            取消
          </button>
        </form>
      </div>
    );
  };
  const allFormula = (formula[formulaClass] ? formula[formulaClass] : []).map(
    (formula) => {
      if (!formula) return null;
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
          {
            (formula.format==="svg") ? 
            (
              <div className="formula-content" dangerouslySetInnerHTML={{ __html: formula.face }}></div>
            ):
            (
              <p className="formula-content">{formula.face}</p>
            )
          }
          {deletingFormula && (
            <button
              className="delete-formula"
              type="button"
              onClick={(event) => {
                handleDeleteFormula(event, formula);
              }}
            >
              x
            </button>
          )}
        </div>
      );
    }
  );
  const allClass = Object.keys(formula).map((oneFormulaClass) => {
    return (
      <div
        key={nanoid()}
        className={
          oneFormulaClass === formulaClass
            ? "choosing-formula-class formula-class"
            : "formula-class"
        }
      >
        <button
          onClick={() => {
            setFormulaClass(oneFormulaClass);
            setDeletingFormula(false);
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
      <div className="delete-class-container">
        <div className="default-container">
          <h1>确认删除该分组?</h1>
          <div className="two-buttons">
            <button onClick={handleDeleteClass} type="button" className="confirm">
              删除
            </button>
            <button
              onClick={() => {
                setDeletingFormulaClass(false);
              }}
              className="cancel"
              type="button"
            >
              取消
            </button>
          </div>
        </div>
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
              <button
                onClick={() => {
                  setAddingFormula(true);
                }}
                className="formula-add-button"
                type="button"
              >
                添加公式
              </button>
              <br />
              <button
                onClick={() => setDeletingFormula((p) => !p)}
                className="formula-delete-button"
                type="button"
              >
                {deletingFormula ? "取消" : "删除公式"}
              </button>
              <br />
              <button
                onClick={() => {
                  setDeletingFormulaClass(true);
                }}
                className="formula-delete-button"
                type="button"
              >
                删除该分组
              </button>
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
                +
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
