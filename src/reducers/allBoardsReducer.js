const initialState = {
  allBoards: [{ id: 1, name: "Example Board" }],
  currentBoard: { id: 1, name: "Example Board" },
};
export default (state = initialState, action) => {
  switch (action.payload) {
    case "allBoards/addBoard": {
      const name = action.payload;
      const id = state.allBoards.length + 1;
      return {
        ...state,
        allBoards: [...state.allBoards, { id, name: name }],
      };
    }
    case "allBoards/removeBoard": {
      const id = action.payload;
      return {
        ...state,
        allBoards: state.allBoards.filter((board) => board.id !== id),
      };
    }
    case "allBoards/setCurrentBoard": {
      const id = action.payload;
      return {
        ...state,
        currentBoard: state.allBoards.find((board) => board.id === id),
      };
    }
    default: {
      return state;
    }
  }
};
