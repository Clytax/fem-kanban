import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: (state) => {
      return true;
    },
    closeSidebar: (state) => {
      return false;
    },
    toggleSidebar: (state) => {
      return !state;
    },
  },
});

export const isSidebarOpen = (state) => state.sidebar;

export const { openSidebar, closeSidebar, toggleSidebar } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
