import React from "react";
import "./column.scss";

import Task from "../Task/Task";

import { Droppable } from "react-beautiful-dnd";

const Column = ({ column, boardID, colIndex }) => {
  return (
    <div className="column">
      <div className="column-name f-column-title flex">
        <div
          className="column-color"
          style={{ backgroundColor: column.color }}
        ></div>
        {column.name} ({column.tasks.length})
      </div>
      <Droppable droppableId={colIndex.toString()} key={colIndex} type="task">
        {(provided) => (
          <div
            className="column__tasks"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {column.tasks.length === 0 ? (
              <div className="column__empty f-column-empty"></div>
            ) : (
              column.tasks.map((task, index) => (
                <Task
                  key={task.id}
                  task={task}
                  boardID={boardID}
                  columnID={column.id}
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
