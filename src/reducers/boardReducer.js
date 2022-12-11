// A board has multiple columns, and each column has multiple Tasks.
const initialState = {
  columns: [
    {
      id: 1,
      name: "TODO",
      color: "#FFCCEE",
      tasks: [{ id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      id: 2,
      name: "In Progress",
      color: "#FFEECC",
      tasks: [{ id: 4 }, { id: 5 }, { id: 6 }],
    },
  ],
};
