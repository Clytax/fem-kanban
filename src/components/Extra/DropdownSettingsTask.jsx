import React from "react";
import "./DropdownSettings.scss";
const DropdownSettingsTask = ({ isOpen, setClose, screen, elipsisRef }) => {
  return (
    isOpen && (
      <div className="dropdown-settings__task">
        <div className="dropdown-settings__item">Edit Task</div>
        <div className="dropdown-settings__item">Delete Task</div>
      </div>
    )
  );
};

export default DropdownSettingsTask;
