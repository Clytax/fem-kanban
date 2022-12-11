import React, { useState, useRef } from "react";
import "./dropdown.scss";
import { useDispatch, useSelector } from "react-redux";
import boardSlice, { changeTaskColumn } from "../../features/boards/boardSlice";
import {
  closeAllModals,
  closeViewTaskModal,
} from "../../features/global/modalSlice";

const DropdownStatus = ({ task }) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [columns, setColumns] = useState([]);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.id === task.boardID);
  const column = board.columns.find((column) => column.id === task.columnID);
  const moveColumnHandler = ({ newColumnID }) => {
    dispatch(
      changeTaskColumn({
        boardID: task.boardID,
        taskID: task.id,
        newColumnID,
        oldColumnID: task.columnID,
      })
    );
    dispatch(closeViewTaskModal());
  };
  return (
    <div className="dropdown-wrapper">
      <div
        className="dropdown__selected dropdown__selected-right"
        onClick={() => {
          setOpenDropDown(!openDropDown);
        }}
      >
        {column.name}
      </div>
      {openDropDown && (
        <div className="dropdown__options">
          {board.columns.map((col, index) => (
            <div
              key={index}
              className={`dropdown__option ${
                column.id === col.id && "dropdown__option--selected"
              }`}
              onClick={() => moveColumnHandler({ newColumnID: col.id })}
            >
              {col.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownStatus;
