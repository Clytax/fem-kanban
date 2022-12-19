import React, { useState, useRef, useEffect } from "react";
import "./dropdown.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeTaskColumn } from "../../features/boards/boardSlice";
import { closeViewTaskModal } from "../../features/global/modalSlice";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const DropdownStatus = ({ task }) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.id === task.boardID);
  const column = board.columns.find((column) => column.id === task.columnID);

  // Refs
  const wrapperRef = useRef(null);
  const barRef = useRef(null);
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

  const handleCloseDropDown = () => {
    console.log("Clicked outside");
    setOpenDropDown(!openDropDown);
  };
  useOutsideClick(handleCloseDropDown, wrapperRef, barRef);
  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>
      <div
        className="dropdown__selected dropdown__selected-right"
        onClick={() => {
          setOpenDropDown(!openDropDown);
        }}
        ref={barRef}
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
