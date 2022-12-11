import React from "react";
import "./boardModal.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBoard,
  clearBoard,
  deleteTask,
} from "../../../features/boards/boardSlice";
import modalSlice, {
  closeAllModals,
  closeClearBoardModal,
  closeDeleteBoardModal,
} from "../../../features/global/modalSlice";
import { motion } from "framer-motion";
import { newspaper } from "../../../utils/framer-animations";
import Backdrop from "../Backdrop/Backdrop";
import "./boardModal.scss";
import { useNavigate } from "react-router-dom";
const ActionBoardModal = ({ action }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteBoardModal = useSelector((state) => state.modal.deleteBoardModal);
  const activeBoard = useSelector((state) =>
    state.boards.boards.find((board) => board.active === true)
  );

  const deleteTaskModal = useSelector((state) => state.modal.deleteTaskModal);
  const handleDelete = () => {
    dispatch(deleteBoard(activeBoard.id));
    dispatch(closeAllModals());
  };

  const handleDeleteTask = () => {
    console.log();
    dispatch(deleteTask({ task: deleteTaskModal.task }));

    dispatch(closeAllModals());
  };

  const handleClear = () => {
    dispatch(clearBoard(activeBoard.id));
    dispatch(closeAllModals());
  };

  const handleReset = () => {
    // Remove all persisted boards
    localStorage.removeItem("persist:root");

    dispatch(closeAllModals());

    // Refresh

    navigate("#");
  };
  return (
    <Backdrop
      mobile={false}
      onClick={() => {
        dispatch(closeAllModals());
      }}
    >
      <motion.div
        className="action-board"
        variants={newspaper}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1>
          {action === "delete"
            ? "Delete this Task?"
            : action === "clear"
            ? "Clear this Board?"
            : action === "reset"
            ? "Reset all Boards?"
            : action === "deleteTask" && "Delete this Task?"}
        </h1>
        <p>
          {action === "reset"
            ? "Are you sure you want to reset all boards? This action will remove all boards, columns, tasks etc which where created by you. This action can't be reversed!"
            : action === "deleteTask"
            ? "Are you sure you want to delete the " +
              "‘" +
              deleteTaskModal.task.name +
              "‘" +
              " task and its subtasks? This action cannot be reversed."
            : `Are you sure you want to
          ${action === "delete" ? "delete" : action === "clear" ? "clear" : ""}
          the "${activeBoard.name}" board? This action will remove all columns
          and tasks and cannot be reversed.`}
        </p>
        <div className="action-board__buttons flex">
          <div
            className="action-board__confirm"
            onClick={() => {
              if (action === "delete") {
                handleDelete();
              } else if (action === "clear") {
                handleClear();
              } else if (action === "reset") {
                handleReset();
              } else if (action === "deleteTask") {
                handleDeleteTask();
              }
            }}
          >
            {action === "delete"
              ? "Delete"
              : action === "clear"
              ? "Clear"
              : action === "reset"
              ? "Reset"
              : action === "deleteTask" && "Delete"}
          </div>
          <div
            className="action-board__cancel "
            onClick={() => dispatch(closeAllModals())}
          >
            Cancel
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default ActionBoardModal;
