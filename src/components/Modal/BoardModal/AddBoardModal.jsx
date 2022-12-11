import React, { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import { dropIn } from "../../../utils/framer-animations";
import { addBoard } from "../../../features/boards/boardSlice";
import modalSlice, {
  openModal,
  closeAllModals,
} from "../../../features/global/modalSlice";
import "./addboardmodal.scss";

import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";

const AddBoardModal = () => {
  const dispatch = useDispatch();

  // Erros
  const [errorName, setErrorName] = useState(false);
  const [errorColumns, setErrorColumns] = useState({
    index: [],
    error: false,
  });

  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["Todo", "Doing"]);

  const addBoardSubmit = () => {
    setErrorName(false);
    setErrorColumns({ index: [], error: false });
    if (boardName === "" || boardName.length > 30) {
      setErrorName(true);
      return;
    }
    // If any column is empty or more than 30 characters
    if (columns.some((column) => column === "" || column.length > 30)) {
      // Find the index of the empty columns
      const errorIndex = columns.reduce((acc, column, index) => {
        if (column === "" || column.length > 30) {
          acc.push(index);
        }
        return acc;
      }, []);

      setErrorColumns({ index: errorIndex, error: true });
      return;
    }

    dispatch(addBoard({ boardName, columnNames: columns }));
    dispatch(closeAllModals());
  };

  return (
    <Backdrop onClick={() => dispatch(closeAllModals())} mobile={false}>
      <form onSubmit={addBoardSubmit}>
        <motion.div
          className="add-board-modal"
          variants={dropIn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2>Add New Board</h2>
          <div className="modal__input-container">
            <h3 className="modal-label">Board Name</h3>
            <input
              type="text"
              className={`modal-input ${errorName ? "modal-input__error" : ""}`}
              value={boardName}
              placeholder="e.g Web Development"
              onChange={(e) => {
                setBoardName(e.target.value);
                if (e.target.value.length > 30 || e.target.value === "") {
                  setErrorName(true);
                } else {
                  setErrorName(false);
                }
              }}
            />
            {errorName && (
              <p className="modal-input__error__message">
                Enter Valid Board Name
              </p>
            )}
          </div>
          <div className="add-board__columns">
            <h3 className="modal-label">Board Columns</h3>
            <div className="add-board__columns__list">
              {columns.map((column, index) => (
                <div
                  className={`add-board__columns__list__item   ${
                    errorColumns.index.includes(index) && "modal-input__error"
                  }`}
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="e.g Todo"
                    value={column}
                    className={`modal-input   ${
                      errorColumns.index.includes(index) && "modal-input__error"
                    }`}
                    onChange={(e) => {
                      const newColumns = [...columns];
                      newColumns[index] = e.target.value;
                      setColumns(newColumns);
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
                        errorColumns.index.includes(index)
                          ? "#ea5555"
                          : "#828FA3"
                      }
                    />
                  </button>
                  {errorColumns.index.includes(index) && (
                    <p className="modal-input__error__message-col">
                      Can't be empty
                    </p>
                  )}
                </div>
              ))}
              <button
                className="btn-modal-add"
                onClick={(e) => {
                  e.preventDefault();
                  if (columns[0] !== "") {
                    // Remove 0 from index
                    setErrorColumns({ index: [], error: false });
                  }
                  setColumns([...columns, "Doing"]);
                }}
              >
                + Add New Column
              </button>
            </div>
          </div>
          <button
            className="btn-modal-submit"
            onClick={(event) => {
              event.preventDefault();
              addBoardSubmit();
            }}
          >
            Create New Bord
          </button>
        </motion.div>
      </form>
    </Backdrop>
  );
};

export default AddBoardModal;
