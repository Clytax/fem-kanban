import React, { useState } from "react";
import "./task.scss";
import { useSelector, useDispatch } from "react-redux";

import { finishedSubTasksOfTask } from "../../features/boards/boardSlice";
import modalSlice, {
  openModal,
  closeAllModals,
  toggleViewTaskModal,
  openViewTaskModal,
  openEditTaskModal,
  openDeleteTaskModal,
} from "../../features/global/modalSlice";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ViewTaskModal from "../Modal/TaskModal/ViewTaskModal";

import { Draggable } from "react-beautiful-dnd";

const Task = ({ boardID, columnID, task, index }) => {
  const [contextMenu, setContextMenu] = useState(null);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const modal = useSelector((state) => state.modal);
  const viewTaskModal = useSelector((state) => state.modal.viewTaskModal);

  const getFinishedSubTasks = (task) => {
    let finishedSubTasks = 0;
    task.subTasks.forEach((subtask) => {
      if (subtask.isDone) {
        finishedSubTasks++;
      }
    });
    return finishedSubTasks;
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  return (
    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task bg-task"
          onClick={() => dispatch(openViewTaskModal(task))}
          onContextMenu={handleContextMenu}
        >
          <h4 className="task__name f-task-title">{task.name}</h4>
          <div className="task__sub f-task-subtitle">
            {getFinishedSubTasks(task)} of {task.subTasks.length} subtasks
          </div>
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(openEditTaskModal(task));
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(openDeleteTaskModal(task));
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
