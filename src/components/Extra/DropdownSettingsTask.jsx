import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
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
