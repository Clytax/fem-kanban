import React from "react";
import "./taskModal.scss";
import "../BoardModal/boardModal.scss";
import { nanoid } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { editTask } from "../../../features/boards/boardSlice";
import { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";
import { dropIn } from "../../../utils/framer-animations";
import { closeAllModals } from "../../../features/global/modalSlice";

const EditTaskModal = () => {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const editTaskModal = useSelector((state) => state.modal.editTaskModal);
  const task = editTaskModal.task;
  const activeBoard = useSelector((state) =>
    state.boards.boards.find((board) => board.active === true)
  );
  // Task has columnID
  const column = activeBoard.columns.find(
    (column) => column.id === task.columnID
  );
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [subtasks, setSubtasks] = useState(task.subTasks);
  const [columnID, setColumnID] = useState(task.columnID);
  const [columnName, setColumnName] = useState(column.name);

  // Error
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorSubtaskIndex, setErrorSubtaskIndex] = useState([]);

  const handleAddSubTask = (e) => {
    e.preventDefault();
    let newSubtask = {
      id: nanoid(),
      boardID: task.boardID,
      columnID: task.columnID,
      taskID: task.id,
      name: "",
      isDone: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const handleChangeSubtask = (e, index) => {
    e.preventDefault();
    let newSubtasks = [];
    subtasks.forEach((sub, i) => {
      if (i === index) {
        newSubtasks.push({ ...sub, name: e.target.value });
      } else {
        newSubtasks.push(sub);
      }
    });
    setSubtasks(newSubtasks);
    if (e.target.value === "") {
      setErrorSubtaskIndex([...errorSubtaskIndex, index]);
    } else {
      setErrorSubtaskIndex(errorSubtaskIndex.filter((i) => i !== index));
    }
  };

  console.log(task);
  const handleDeleteSubtask = (e, index) => {
    e.preventDefault();

    const newSubtasks = subtasks.filter((subtask, i) => i !== index);
    setSubtasks(newSubtasks);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let error = false;
    setErrorName(false);
    setErrorDescription(false);
    setErrorSubtaskIndex([]);

    if (taskName === "") {
      setErrorName(true);
      error = true;
    } else {
      setErrorName(false);
    }

    if (taskDescription === "") {
      setErrorDescription(true);
      error = true;
    } else {
      setErrorDescription(false);
    }

    // Check if subtasks name is empty
    let newErrorSubtaskIndex = [];
    subtasks.forEach((subtask, i) => {
      if (subtask.name === "") {
        newErrorSubtaskIndex.push(i);
        error = true;
      }
    });
    setErrorSubtaskIndex(newErrorSubtaskIndex);

    if (!error) {
      dispatch(
        editTask({
          boardID: activeBoard.id,
          columnID: columnID,
          oldColumnID: task.columnID,
          task: task,
          taskName: taskName,
          taskDescription: taskDescription,
          subTasks: subtasks,
        })
      );
      dispatch(closeAllModals());
    }
  };

  return (
    <Backdrop onClick={() => dispatch(closeAllModals())} mobile={false}>
      <form onClick={handleSubmit}>
        <motion.div
          className="edit-task-modal"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2>Edit Task</h2>
          <div className="modal__input-container">
            <h3 className="modal-label">Title</h3>
            <input
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                // Name can't be empty
                if (e.target.value === "") {
                  setErrorName(true);
                } else {
                  setErrorName(false);
                }
              }}
              className={`modal-input ${errorName && "modal-input__error"}`}
            />
            {errorName && (
              <p className="modal-input__error__message">Can't be empty</p>
            )}
          </div>
          <div className="modal__input-container">
            <h3 className="modal-label">Description</h3>
            <textarea
              type="text"
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
              }}
              className={`modal-input input-area ${
                errorDescription && "modal-input__error"
              }`}
            />
          </div>
          <div className="modal__subtasks-container">
            <h3>Subtasks</h3>
            <div className="modal__subtasks">
              {subtasks.map((subtask, index) => (
                <div className="modal__subtask" key={index}>
                  <input
                    type="text"
                    value={subtask.name}
                    onChange={(e) => handleChangeSubtask(e, index)}
                    className={`modal-input ${
                      errorSubtaskIndex.includes(index) && "modal-input__error"
                    }`}
                  />
                  <button
                    className="modal__subtask-delete"
                    onClick={(e) => handleDeleteSubtask(e, index)}
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
                    <p className="modal__subtask-error-message">
                      Can't be empty
                    </p>
                  )}
                </div>
              ))}
              <button
                className="btn-modal-add"
                onClick={(e) => handleAddSubTask(e)}
              >
                + Add New Subtask
              </button>
            </div>
          </div>
          <div className="task__status">
            <p className="status">Status</p>
            <div className="dropdown-wrapper">
              <div
                className={`dropdown__selected dropdown__selected-right`}
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
                  {activeBoard.columns.map((col, index) => (
                    <div
                      key={index}
                      className={`dropdown__option ${
                        columnID === col.id && "dropdown__option--selected"
                      }`}
                      onClick={() => {
                        setColumnID(col.id);
                        setColumnName(col.name);
                        setOpenDropdown(false);
                      }}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="btn-modal-submit" onClick={(e) => handleSubmit(e)}>
            Save Changes
          </button>
        </motion.div>
      </form>
    </Backdrop>
  );
};

export default EditTaskModal;
