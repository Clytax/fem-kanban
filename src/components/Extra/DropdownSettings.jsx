import React from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDispatch } from "react-redux";
import { openModal } from "../../features/global/modalSlice";
import "./DropdownSettings.scss";
const DropdownSettings = ({ isOpen, setClose, elipsisRef }) => {
  const dispatch = useDispatch();
  const handleMobileSettings = () => {
    // Make sure clicked isnt the elipsis
    setClose(false);
  };
  const ref1 = useOutsideClick(handleMobileSettings, elipsisRef);

  return (
    isOpen && (
      <div className="dropdown-settings" ref={ref1}>
        <div
          className="dropdown-settings__item"
          onClick={() => {
            setClose(false);
            dispatch(openModal("editBoardModal"));
          }}
        >
          Edit Board
        </div>
        <div
          className="dropdown-settings__item"
          onClick={() => {
            setClose(false);
            dispatch(openModal("clearBoardModal"));
          }}
        >
          Clear Board
        </div>
        <div
          className="dropdown-settings__item"
          onClick={() => {
            setClose(false);
            dispatch(openModal("deleteBoardModal"));
          }}
        >
          Delete Board
        </div>
        <div
          className="dropdown-settings__item"
          onClick={() => {
            setClose(false);
            dispatch(openModal("resetBoardsModal"));
          }}
        >
          Reset Boards
        </div>
      </div>
    )
  );
};

export default DropdownSettings;
