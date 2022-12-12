import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewTaskModal: {
    open: false,
    task: null,
  },
  deleteBoardModal: {
    open: false,
  },
  clearBoardModal: {
    open: false,
  },
  editTaskModal: {
    open: false,
    task: null,
  },
  editBoardModal: {
    open: false,
    boardID: 0,
  },
  addBoardModal: {
    open: false,
  },
  addTaskModal: {
    open: false,
  },
  resetBoardsModal: {
    open: false,
  },
  deleteTaskModal: {
    open: false,
    task: null,
  },
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      // Close all modals and open the one that was clicked
      for (const modal in state) {
        state[modal].open = false;
      }
      state[action.payload].open = true;
    },
    toggleViewTaskModal: (state, action) => {
      state.viewTaskModal.open = !state.viewTaskModal.open;
      state.viewTaskModal.taskID = action.payload;
    },
    openViewTaskModal: (state, action) => {
      state.viewTaskModal.open = true;
      state.viewTaskModal.task = action.payload;
    },
    closeViewTaskModal: (state) => {
      state.viewTaskModal.open = false;
      state.viewTaskModal.task = null;
    },

    closeModal: (state, action) => {
      state[action.payload] = false;
    },
    openEditTaskModal: (state, action) => {
      state.editTaskModal.open = true;

      console.log("action.payload: ", action.payload);
      state.editTaskModal.task = action.payload;
    },
    openDeleteTaskModal: (state, action) => {
      state.deleteTaskModal.open = true;
      state.deleteTaskModal.task = action.payload;
    },
    closeAllModals: (state) => {
      for (const modal in state) {
        state[modal].open = false;
        // If they have a second property, set it to null / 0
        if (state[modal].task) {
          state[modal].task = null;
        }

        if (state[modal].boardID) {
          state[modal].boardID = 0;
        }
      }
    },
  },
});

export const isHeaderModalOpen = (state) => state.modal.headerModal;
export const isEditBoardModalOpen = (state) => state.modal.editBoardModal;
export const isDeleteBoardModalOpen = (state) => state.modal.deleteBoardModal;
export const isAddTaskModalOpen = (state) => state.modal.addTaskModal;
export const isEditTaskModalOpen = (state) => state.modal.editTaskModal;
export const isDeleteTaskModalOpen = (state) => state.modal.deleteTaskModal;
export const isViewTaskModalOpen = (state) => state.modal.viewTaskModal;

export const {
  openModal,
  closeModal,
  toggleViewTaskModal,
  closeAllModals,
  closeViewTaskModal,
  openDeleteTaskModal,
  openViewTaskModal,
  openEditTaskModal,
} = modalSlice.actions;

export default modalSlice.reducer;
