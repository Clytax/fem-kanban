import React from "react";
import "./sidebar.scss";
// Redux
import { setTheme, toggleTheme } from "../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import boardSlice, {
  dragAndDropBoard,
  findActiveBoard,
  setActiveBoard,
} from "../../features/boards/boardSlice";
import { openModal } from "../../features/global/modalSlice";

// Packages
import { AnimatePresence, motion } from "framer-motion";
import Switch from "../Switch/Switch";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";

// Icons
import { ReactComponent as BoardIcon } from "../../assets/Icons/icon-board.svg";
import { ReactComponent as HideSidebar } from "../../assets/Icons/icon-hide-sidebar.svg";
import { ReactComponent as ShowSidebar } from "../../assets/Icons/icon-show-sidebar.svg";
import { ReactComponent as Sun } from "../../assets/Icons/icon-light-theme.svg";

import { ReactComponent as Moon } from "../../assets/Icons/icon-dark-theme.svg";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import sidebarSlice, {
  openSidebar,
  closeSidebar,
  isSidebarOpen,
} from "../../features/global/sidebarSlice";
const Sidebar = () => {
  const isMobileMax = useMediaQuery({ maxWidth: 650 });
  const isMobileMin = useMediaQuery({ minWidth: 651 });

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const boards = useSelector((state) => state.boards.boards);
  const sidebar = useSelector((state) => state.sidebar);
  const handleBoardChange = (board) => {
    dispatch(setActiveBoard(board));
  };

  const handleDragend = (result) => {
    if (!result.destination) return;
    dispatch(dragAndDropBoard(result));
  };
  return (
    isMobileMin &&
    (sidebar ? (
      <AnimatePresence>
        <motion.div
          animate={{ x: 0 }}
          initial={{ x: -300 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="sidebar"
        >
          <div className="sidebar__top">
            <DragDropContext onDragEnd={handleDragend}>
              <h2 className="uppercase">all boards ({boards.length})</h2>

              <Droppable droppableId="boards">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="sidebar__board-list"
                  >
                    {boards.map((board, index) => (
                      <Draggable
                        key={board.id}
                        draggableId={board.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={
                              board.active
                                ? "sidebar__board-item active-board-sidebar flex"
                                : "sidebar__board-item sidebar-no-select flex"
                            }
                            key={board.id}
                            onClick={() => handleBoardChange(board.id)}
                          >
                            <BoardIcon
                              style={{ marginLeft: "1.9em" }}
                              fill={board.active ? "white" : "#828FA3"}
                            />{" "}
                            <h3
                              className={
                                board.active
                                  ? "f-sidebar__board f-sidebar-active-board"
                                  : "f-sidebar__board "
                              }
                            >
                              {board.name}
                            </h3>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div
              className="sidebar__new-board"
              onClick={() => dispatch(openModal("addBoardModal"))}
            >
              <BoardIcon fill="#635FC7" style={{ marginLeft: "1.9em" }} />{" "}
              <h3 className="f-sidebar__new-board">+ Create New Board</h3>
            </div>
          </div>
          <div className="sidebar__bottom">
            <div className="sidebar__themes">
              <div className="sidebar__theme">
                <Sun />
              </div>
              <Switch
                color="#635FC7"
                isOn={theme === "dark"}
                handleToggle={() => dispatch(toggleTheme())}
              />
              <div className="sidebar__theme">
                <Moon />
              </div>
            </div>
            <div
              className="sidebar-hide flex"
              onClick={() => dispatch(closeSidebar())}
            >
              <HideSidebar fill="#828FA3" style={{ marginLeft: "1.9em" }} />
              <span>Hide Sidebar</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    ) : (
      <div className="sidebar__show" onClick={() => dispatch(openSidebar())}>
        <ShowSidebar fill="white" />
      </div>
    ))
  );
};

export default Sidebar;
