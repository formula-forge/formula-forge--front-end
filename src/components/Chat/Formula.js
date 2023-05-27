import React, { useEffect, useState } from "react";
import formulaService from "../../services/formula-service";
import { nanoid } from "@reduxjs/toolkit";
import "./Formula.css";
import FormulaMenu from "../ContextMenu/FormulaMenu";

function Formula(props) {
  const [formula, setFormula] = useState({});
  const [formulaClass, setFormulaClass] = useState("");
  const [loading, setLoading] = useState(false);

  const [addingFormula, setAddingFormula] = useState(false);
  const [addingFormulaClass, setAddingFormulaClass] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuX, setContextMenuX] = useState(0);
  const [contextMenuY, setContextMenuY] = useState(0);
  const [deleteFormulaIndex, setDeleteFormulaIndex] = useState(0);
  const menuRef = React.useRef(null);

  const [newFormulaName, setNewFormulaName] = useState("");
  const [newFormulaContent, setNewFormulaContent] = useState("");
  const [newFormulaFace, setNewFormulaFace] = useState("");

  const [previewing, setPreviewing] = useState("");

  function reloadMathJax() {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
    document.head.appendChild(script);
    script.onload = () => {
      // 加载完成后设置MathJax配置
      window.MathJax.Hub.Config({
        // 支持行内公式使用$...$包裹, 默认为\\(...\\)包裹
        // 行级公式默认为$$...$$包裹
        tex2jax: {
          inlineMath: [["$", "$"]],
        },
        MathMenu: {
          showContextMenu: false,
        }
      });
      // 渲染数学公式
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
  }

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
  useEffect(() => {
    console.log(newFormulaContent)
    if (loading) return;
    // 加载MathJax
    reloadMathJax();
  });


  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuRef]);
  const handleSubmitFormula = (event) => {
    event.preventDefault();
    if (!formula) return;
    const newFormula = { name: newFormulaName, formula: newFormulaContent, face: newFormulaFace };
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
  const handleDeleteClass = (formulaClass) => {
    if (window.confirm("确定删除公式分类吗？")) {
      const newFormulaObj = formula;
      delete newFormulaObj[formulaClass];
      formulaService
        .putAll(newFormulaObj)
        .then((response) => {
          console.log(response);
          setFormula(newFormulaObj);
          setDeleteTrigger((p) => !p);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleDeleteFormula = (id) => {
    if (window.confirm("确定删除公式吗？")) {
      const newFormulaObj = formula;
      delete newFormulaObj[formulaClass][id];
      formulaService
        .putAll(newFormulaObj)
        .then((response) => {
          console.log(response);
          setFormula(newFormulaObj);
        })
        .catch((e) => {
          console.log(e);
        })
    }
  }
  const addFormula = (
    <div className="add-formula-container">
      <button
        onClick={() => {
          setAddingFormula(false);
        }}
        type="button"
        id="add-formula-cancel"
      >
        <span className="material-icons">cancel</span>
      </button>
      <form className="default-form add-formula-form" onSubmit={handleSubmitFormula}>
        <input
          placeholder="名称"
          id="add-formula-name"
          onChange={(e) => {
            setNewFormulaName(e.target.value);
          }}
        />

        <textarea
          placeholder="公式"
          id="add-formula-formula"
          onChange={(e) => {
            setNewFormulaContent(e.target.value);
            setNewFormulaFace(e.target.value.replaceAll("{}", "{\\square}"));
          }}
        />

        <button type="button"
          onClick={() => {
            setPreviewing(true);
          }
          }
        >预览</button>
        <button type="submit">添加</button>
      </form>
    </div>
  );

  const previewFormula = (
    <div className="preview-formula-container">
      <button
        onClick={() => {
          setPreviewing(false);
        }}
        type="button"
        id="preview-cancel"
      >
        <span className="material-icons">cancel</span>
      </button>
      $${newFormulaFace}$$
    </div>
  );

  const addClass = (
    <div className="add-class-container">
      <button
        onClick={() => {
          setAddingFormulaClass(false);
        }}
        type="button"
        id="add-class-cancel"
      >
        <span className="material-icons">cancel</span>
      </button>
      <form className="add-class-form default-form" onSubmit={handleSubmitClass}>
        <input placeholder="名称" id="add-class-name" />
        <button type="submit">添加</button>
      </form>
    </div>
  );
  const allFormula = (formula[formulaClass] ? formula[formulaClass] : []).map(
    (formula, index) => {
      console.log(formula);
      return formula && (
        <div
          className="formula-item"
          key={nanoid()}
          onClick={() => {
            handleFormulaClick(formula.formula);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowContextMenu(true);
            setContextMenuX(e.clientX);
            setContextMenuY(e.clientY);
            setDeleteFormulaIndex(index);
          }
          }
          type="button"
        >
          <span className="formula-face">${formula.face}$</span>
          <p>{formula.name}</p>
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
        <button
          onClick={() => {
            handleDeleteClass(oneFormulaClass);
          }}
          type="button"
          className="formula-class-icon-button"
        >
          <span className="material-icons">delete</span>
        </button>
      </div>
    );
  });
  return (
    <>
      <div className="formula-container">
        {addingFormula && addFormula}
        {previewing && previewFormula}
        {addingFormulaClass && addClass}
        {/* {deletingFormulaClass ? deleteFormulaClassConfirm() : ""} */}
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
                  type="button">
                  <span className="material-icons formula_add_box">add</span>
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
                  className="formula-class-icon-button"
                >
                  <span className="material-icons-outlined formula_add_box">create_new_folder</span>
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {
        showContextMenu && (
          <div ref={menuRef}>
            <FormulaMenu
              ref={menuRef}
              x={contextMenuX}
              y={contextMenuY}
              onDelete={() => {
                setShowContextMenu(false);
                handleDeleteFormula(deleteFormulaIndex);
              }}
            />
          </div>
        )
      }
    </>
  );
}

export default Formula;
