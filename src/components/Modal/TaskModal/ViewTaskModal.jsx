import React, { useRef, useState } from "react";
import "./taskModal.scss";
import { ReactComponent as Elipsis } from "../../../assets/Icons/icon-vertical-ellipsis.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  closeViewTaskModal,
  openEditTaskModal,
  closeAllModals,
  openDeleteTaskModal,
} from "../../../features/global/modalSlice";
import Backdrop from "../Backdrop/Backdrop";
import Subtask from "../../Task/Subtask";

import "../../Extra/DropdownSettings.scss";

import { useOutsideClick } from "../../../hooks/useOutsideClick";

import { motion } from "framer-motion";
import DropdownStatus from "../../Extra/DropdownStatus";

const ViewTaskModal = ({ handleClose }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const dispatch = useDispatch();
  const task = useSelector((state) => state.modal.viewTaskModal.task);
  const handleCloseSettings = () => {
    console.log("hi");
    setOpenSettings(false);
  };

  const elipsisRef = useRef(null);
  const wrapperRef = useOutsideClick(handleCloseSettings, elipsisRef);

  const getFinishedSubTasks = () => {
    let finishedSubTasks = 0;
    task.subTasks.forEach((subtask) => {
      if (subtask.isDone) {
        finishedSubTasks++;
      }
    });
    return finishedSubTasks;
  };

  const closeModal = () => {
    dispatch(closeViewTaskModal());
  };
  return (
    <Backdrop onClick={closeModal} mobile={false}>
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="view-task"
      >
        <div className="view-task__header | flex">
          <h2 className="view-task__header__title">{task.name}</h2>
          <div className="view-tastk__settings">
            <div
              className="view-task__header__icon"
              style={{ cursor: "pointer" }}
              ref={elipsisRef}
              onClick={() => {
                setOpenSettings(!openSettings);
              }}
            >
              <Elipsis />
            </div>
            {openSettings && (
              <div className="dropdown-settings__task" ref={wrapperRef}>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openEditTaskModal(task));
                  }}
                >
                  Edit Task
                </div>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openDeleteTaskModal(task));
                  }}
                >
                  Delete Task
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="view-task__description">{task.description}</p>

        <div className="view-task__subtasks">
          <p>
            Subtasks ({getFinishedSubTasks()} of {task.subTasks.length})
          </p>
          <div className="view-task__subtasks__list">
            {task.subTasks.map((subtask, index) => (
              <Subtask
                subtaskID={subtask.id}
                boardID={task.boardID}
                taskID={task.id}
                columnID={task.columnID}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="view-task__status">
          <p>Current Status</p>
          <DropdownStatus click={handleCloseSettings} task={task} />
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default ViewTaskModal;
