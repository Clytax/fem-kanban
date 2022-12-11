import React from "react";
import "./boardModal.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEditBoardModal,
  closeAllModals,
} from "../../../features/global/modalSlice";
import { randomHexColor } from "../../../features/boards/boardHelper";
import { nanoid } from "@reduxjs/toolkit";
import boardSlice, { editBoard } from "../../../features/boards/boardSlice";
import { motion } from "framer-motion";
import { badSuspension, dropIn } from "../../../utils/framer-animations";
import Backdrop from "../Backdrop/Backdrop";
import "./boardModal.scss";
import { useState } from "react";
import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";

const EditBoardModal = () => {
  const dispatch = useDispatch();
  const activeBoard = useSelector((state) =>
    state.boards.boards.find((board) => board.active === true)
  );
  const [boardName, setBoardName] = useState(activeBoard.name);
  const [columns, setColumns] = useState(activeBoard.columns);

  const [columnErrorIndex, setColumnErrorIndex] = useState([]);
  const [nameError, setNameError] = useState(false);
  const closeModal = () => {
    dispatch(closeAllModals());
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: nanoid(),
      name: "Todo",
      boardID: activeBoard.id,
      color: randomHexColor(),
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const handleColumnChange = (e, index) => {};
  const submitEditBoard = () => {
    let dontSubmit = false;
    setNameError(false);
    setColumnErrorIndex([]);
    if (boardName === "" || boardName.length > 30) {
      setNameError(true);
      dontSubmit = true;
    }
    if (
      columns.some((column) => column.name === "" || column.name.length > 30)
    ) {
      const errorIndex = columns.reduce((acc, column, index) => {
        if (column.name === "" || column.name.length > 30) {
          dontSubmit = true;
          acc.push(index);
        }
        return acc;
      }, []);
      console.log(errorIndex);
      setColumnErrorIndex(errorIndex);
    }

    if (dontSubmit) {
      return;
    }

    dispatch(
      editBoard({
        boardID: activeBoard.id,
        boardName: boardName,
        columns: columns,
      })
    );
    dispatch(closeAllModals());
  };
  return (
    <Backdrop mobile={false} onClick={closeModal}>
      <motion.div
        className="action-board "
        variants={dropIn}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="edit-modal__head">Edit Board</h2>
        <div className="modal__input-container">
          <h3 className="modal-label">Board Name</h3>
          <input
            className={`modal-input ${nameError ? "modal-input__error" : ""}`}
            type="text"
            placeholder="e.g. My Board"
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
              if (e.target.value === "") {
                setNameError(true);
              } else {
                setNameError(false);
              }
            }}
          />

          {nameError && (
            <p className="modal-input__error__message--name">
              Enter a Valid name
            </p>
          )}
        </div>
        <div className="edit-board__columns">
          <h3 className="modal-label">Board Columns</h3>
          <div className="edit-board__columns-container">
            {columns.map((column, index) => (
              <div className="edit-board__column" key={index}>
                <input
                  className={`modal-input ${
                    columnErrorIndex.includes(index) ? "modal-input__error" : ""
                  }`}
                  type="text"
                  placeholder="e.g. Todo"
                  value={column.name}
                  onChange={(e) => {
                    let newArray = [];
                    columns.forEach((column, i) => {
                      if (i === index) {
                        newArray.push({ ...column, name: e.target.value });
                      } else {
                        newArray.push(column);
                      }
                    });
                    setColumns(newArray);
                    if (e.target.value === "") {
                      setColumnErrorIndex([...columnErrorIndex, index]);
                    } else {
                      setColumnErrorIndex(
                        columnErrorIndex.filter((i) => i !== index)
                      );
                    }
                  }}
                />

                <button
                  onClick={() => {
                    const newColumns = [...columns];
                    newColumns.splice(index, 1);
                    setColumns(newColumns);
                  }}
                >
                  <Cross
                    fill={
                      columnErrorIndex.includes(index) ? "#ea5555" : "#828FA3"
                    }
                  />
                </button>
                {columnErrorIndex.includes(index) && (
                  <p className="editboard-error-message">Enter a Valid name</p>
                )}
              </div>
            ))}
            <button className="btn-modal-add" onClick={handleAddColumn}>
              + Add New Column
            </button>
          </div>
        </div>
        <button className="btn-modal-submit" onClick={() => submitEditBoard()}>
          Save Changes
        </button>
      </motion.div>
    </Backdrop>
  );
};

export default EditBoardModal;
