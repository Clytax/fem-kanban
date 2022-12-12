import React, { useState } from "react";
import "./taskModal.scss";

import Backdrop from "../Backdrop/Backdrop";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { closeAllModals } from "../../../features/global/modalSlice";
import { addTask } from "../../../features/boards/boardSlice";

import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";

import { dropIn } from "../../../utils/framer-animations";

const AddTaskModal = () => {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [subtasks, setSubtasks] = useState(["Make Coffee"]);
  const [columnID, setColumnID] = useState(0);
  const [columnName, setColumnName] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [noColumnSelected, setNoColumnSelected] = useState(false);

  const [errorSubtaskIndex, setErrorSubtaskIndex] = useState([]);
  // First column on this board
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) =>
    boards.find((board) => board.active)
  );
  const activeBoardColumns = activeBoard.columns;

  const handleAddTask = () => {
    let dontSubmit = false;
    setErrorName(false);
    setErrorDescription(false);
    setNoColumnSelected(false);
    setErrorSubtaskIndex([]);
    if (taskName === "") {
      setErrorName(true);
      dontSubmit = true;
    }
    if (subtasks.length === 0) {
      dontSubmit = true;
    }
    // If any subtask is empty
    if (subtasks.some((subtask) => subtask === "")) {
      // Find the index of the empty columns
      const errorIndex = subtasks.reduce((acc, subtask, index) => {
        if (subtask === "") {
          dontSubmit = true;

          acc.push(index);
        }
        return acc;
      }, []);
      setErrorSubtaskIndex(errorIndex);
    }
    if (columnID === 0) {
      setNoColumnSelected(true);
      dontSubmit = true;
    }

    if (dontSubmit) return;

    dispatch(
      addTask({
        boardID: activeBoard.id,
        columnID,
        taskName,
        taskDescription,
        subTaskNames: subtasks,
      })
    );
    dispatch(closeAllModals());
  };
  return (
    <Backdrop onClick={() => dispatch(closeAllModals())} mobile={false}>
      <form onSubmit={handleAddTask}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="addtask-modal"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <h2>Add New Task</h2>
          <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Title</h3>
            <input
              type="text"
              className={`modal-input ${errorName && "modal-input__error"}`}
              placeholder="e.g. Start learning Things"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            {errorName && (
              <p
                className="modal-input__error__message--name"
                style={{ top: "54%" }}
              >
                Please enter a name
              </p>
            )}
          </div>
          <div className="modal__input-container">
            <h3 className="modal-label">Description (optional)</h3>
            <textarea
              className={`modal-input input-area ${
                errorDescription && "modal-input__error"
              }`}
              placeholder="e.g. Start learning Things"
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
                if (errorDescription && e.target.value !== "")
                  setErrorDescription(false);
              }}
            />
          </div>
          <div className="modal__subtasks-container">
            <h3 className="modal-label">Subtasks</h3>
            <div className="modal__subtasks">
              {subtasks.map((subtask, index) => (
                <div className="modal__subtask" key={index}>
                  <input
                    type="text"
                    className={`modal-input    ${
                      errorSubtaskIndex.includes(index) && "modal-input__error"
                    }`}
                    placeholder="e.g. Make Coffee"
                    value={subtask}
                    onChange={(e) => {
                      const newSubtasks = [...subtasks];
                      newSubtasks[index] = e.target.value;
                      setSubtasks(newSubtasks);
                      if (errorSubtaskIndex.includes(index)) {
                        setErrorSubtaskIndex(
                          errorSubtaskIndex.filter(
                            (errorIndex) => errorIndex !== index
                          )
                        );
                      }
                    }}
                  />
                  <button
                    className="addtask__subtasks__item__delete"
                    onClick={(e) => {
                      e.preventDefault();

                      const newSubtasks = [...subtasks];
                      newSubtasks.splice(index, 1);
                      setSubtasks(newSubtasks);
                    }}
                  >
                    <Cross
                      fill={
                        errorSubtaskIndex.includes(index)
                          ? "#ea5555"
                          : "#828FA3"
                      }
                    />
                  </button>
                  {errorSubtaskIndex.includes(index) && (
                    <p className="addtask-error-message">
                      Subtask cannot be empty
                    </p>
                  )}
                </div>
              ))}
              <button
                className="btn-modal-add"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSubtasks([...subtasks, ""]);
                }}
              >
                + Add New Subtask
              </button>
            </div>
          </div>
          <div className="add-task__status">
            <p>Status</p>
            <div className="dropdown-wrapper">
              <div
                className={`dropdown__selected ${
                  noColumnSelected
                    ? " dropdown__selected-wrong"
                    : "dropdown__selected-right"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenDropdown(!openDropdown);
                }}
              >
                <p>{columnName || "Select Column"}</p>
              </div>
              {openDropdown && (
                <div className="dropdown__options">
                  {activeBoardColumns.map((col, index) => (
                    <div
                      key={index}
                      className={`dropdown__option ${
                        columnName === col.name && "dropdown__option--selected"
                      }`}
                      style={{ borderColor: "#ea5555", borderWidth: "2px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setColumnID(col.id);
                        setColumnName(col.name);
                        setOpenDropdown(false);
                        if (noColumnSelected) setNoColumnSelected(false);
                      }}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            className="btn-modal-submit"
            onClick={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            Create Task
          </button>
        </motion.div>
      </form>
    </Backdrop>
  );
};

export default AddTaskModal;
