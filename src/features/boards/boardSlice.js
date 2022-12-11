import { createSlice, nanoid, current } from "@reduxjs/toolkit";
import boards from "../../app/data.json";
import { randomHexColor } from "./boardHelper";

// The Board has the following properties:
// board: [{name: "Board Name", id: nanoid()}{
// columns: [{id: nanoid()}, boardID: 1{
// tasks: [{name: "Task Name"}, {columnID: 1}{id: nanoid()},{
// subTasks: [ id: nanoid(), title: "", completed: false]}]}]}]

const initialState = {
  boards: boards.boards,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, action) => {
      const newID = nanoid();
      const { boardName } = action.payload;
      const { columnNames } = action.payload;
      const columns = columnNames.map((name) => {
        return {
          id: nanoid(),
          boardID: newID,
          color: randomHexColor(),
          name: name,
          tasks: [],
        };
      });
      const newBoard = {
        id: newID,
        name: boardName,
        columns: columns,
      };
      state.boards.push(newBoard);
    },
    dragAndDropBoard: (state, action) => {
      const { source, destination } = action.payload;
      const board = state.boards[source.index];
      state.boards.splice(source.index, 1);
      state.boards.splice(destination.index, 0, board);
    },

    deleteBoard: (state, action) => {
      const boardID = action.payload;
      state.boards = state.boards.filter((board) => board.id !== boardID);
      // Set active board to the first board in the array
      state.boards[0].active = true;
    },
    editBoard: (state, action) => {
      const { columns, boardID, boardName } = action.payload;
      const board = state.boards.find((board) => board.id === boardID);
      if (board) {
        board.name = boardName;
        board.columns = columns;
      }
    },

    clearBoard: (state, action) => {
      const board = state.boards.find((board) => board.id === action.payload);
      if (board) {
        board.columns = [];
      }
    },
    setActiveBoard: (state, action) => {
      // First remove active from all boards
      state.boards.forEach((board) => {
        board.active = false;
      });
      const board = state.boards.find((board) => board.id === action.payload);
      if (board) {
        board.active = true;
      }
    },

    // Columns
    addColumn: {
      reducer: (state, action) => {},
      // Column has color which will be generated randomly
      prepare: (name, boardID) => {
        return {
          payload: {
            id: nanoid(),
            name,
            boardID,
            color: randomHexColor(),
            tasks: [],
          },
        };
      },
    },
    deleteColumn: (state, action) => {},
    editColumn: (state, action) => {},

    // Tasks
    addTask: (state, action) => {
      const { boardID, columnID, taskName, taskDescription, subTaskNames } =
        action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const column = board.columns.find((c) => c.id === columnID);
      const newTaskID = nanoid();
      const newSubtasks = subTaskNames.map((name) => {
        return {
          id: nanoid(),
          taskID: newTaskID,
          columnID: columnID,
          boardID: boardID,
          name: name,
          isDone: false,
        };
      });

      const newTask = {
        id: newTaskID,
        columnID: columnID,
        boardID: boardID,
        name: taskName,
        description: taskDescription,
        subTasks: newSubtasks,
      };

      column.tasks.push(newTask);
    },

    deleteTask: (state, action) => {
      const { task } = action.payload;
      const board = state.boards.find((b) => b.id === task.boardID);
      const column = board.columns.find((c) => c.id === task.columnID);

      // Remove the task from the column
      column.tasks = column.tasks.filter((t) => t.id !== task.id);
    },
    editTask: (state, action) => {
      const {
        boardID,
        oldColumnID,
        columnID,
        task,
        taskName,
        taskDescription,
        subTasks,
      } = action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const oldColumn = board.columns.find((c) => c.id === oldColumnID);
      const newColumn = board.columns.find((c) => c.id === columnID);
      const stateTask = oldColumn.tasks.find((t) => t.id === task.id);

      let newSubTasks = [];
      let newTask = [];

      // Check if its the same column
      if (oldColumnID === columnID) {
        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          subTasks: subTasks,
        };
        // Replace the task in the column
        oldColumn.tasks = oldColumn.tasks.map((t) => {
          if (t.id === task.id) {
            return newTask;
          } else {
            return t;
          }
        });
      } else {
        newSubTasks = subTasks.map((subTask) => {
          return {
            ...subTask,
            columnID: newColumn.id,
          };
        });
        console.log(newSubTasks);

        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          subTasks: newSubTasks,
          columnID: columnID,
        };

        // Remove the task from the old column
        oldColumn.tasks = oldColumn.tasks.filter((t) => t.id !== task.id);
        // Add the task to the new column
        newColumn.tasks.push(newTask);
        console.log(newColumn.tasks);
      }
      console.log(current(stateTask));
    },
    reorderTaskDragDrop: (state, action) => {
      const { source, destination } = action.payload;
      const activeBoard = state.boards.find((b) => b.active === true);
      // destion.dropableId is the index of the column
      const sourceColumn = activeBoard.columns[source.droppableId];
      const destinationColumn = activeBoard.columns[destination.droppableId];
      const task = sourceColumn.tasks[source.index];
      sourceColumn.tasks.splice(source.index, 1);
      destinationColumn.tasks.splice(destination.index, 0, task);
      const intDestId = parseInt(destination.droppableId);
      task.columnID = destinationColumn.id;
      // Iterate through subtasks and change the columnID
      task.subTasks.forEach((s) => (s.columnID = destinationColumn.id));
    },
    changeTaskColumn: (state, action) => {
      const { boardID, oldColumnID, newColumnID, taskID } = action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const oldColumn = board.columns.find((c) => c.id === oldColumnID);
      const newColumn = board.columns.find((c) => c.id === newColumnID);
      const task = oldColumn.tasks.find((t) => t.id === taskID);
      oldColumn.tasks = oldColumn.tasks.filter((t) => t.id !== taskID);
      task.columnID = newColumnID;
      // Iterate through subtasks and change the columnID
      task.subTasks.forEach((s) => (s.columnID = newColumnID));
      newColumn.tasks.push(task);
    },

    // SubTasks
    addSubTask: (state, action) => {},

    toggleSubTask: (state, action) => {
      const board = state.boards.find((b) => b.id === action.payload.boardID);
      const column = board.columns.find(
        (c) => c.id === action.payload.columnID
      );
      const task = column.tasks.find((t) => t.id === action.payload.taskID);
      const subTask = task.subTasks.find(
        (s) => s.id === action.payload.subTaskID
      );
      subTask.isDone = !subTask.isDone;
    },
    editSubTask: (state, action) => {
      const { taskID, columnID, subTaskID, title } = action.payload;
      const board = state.boards[state.activeBoardIndex];
      const column = board.columns.find((c) => c.id === columnID);
      if (column) {
        const task = column.tasks.find((t) => t.id === taskID);
        if (task) {
          const subTask = task.subTasks.find((s) => s.id === subTaskID);
          if (subTask) {
            subTask.title = title;
          }
        }
      }
    },
  },
});

export const finishedSubTasksOfTask = (state, boardID, columnID, taskID) => {
  const board = state.boards.boards.find((b) => b.id === boardID);
  const column = board.columns.find((c) => c.id === columnID);
  const task = column.tasks.find((t) => t.id === taskID);
  return task.subTasks.filter((s) => s.isDone).length;
};

export const findActiveBoard = (state) => {
  // Find the board that has the attribute active = true
  return state.boards.boards.find((b) => b.active);
};

export const {
  addBoard,
  deleteBoard,
  editBoard,
  setActiveBoard,
  addColumn,
  deleteColumn,
  editColumn,
  addTask,
  dragAndDropBoard,
  deleteTask,
  editTask,
  changeTaskColumn,
  addSubTask,
  deleteSubTask,
  reorderTaskDragDrop,
  editSubTask,
  toggleSubTask,
  clearBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;
