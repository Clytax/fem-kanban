import { Header, Board, EmptyBoard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import boardSlice from "../features/boards/boardSlice";

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const theme = useSelector((state) => state.theme);

  return (
    <div className="app" data-theme={theme.theme}>
      <Header />
      {boards.length > 0 ? <Board /> : <EmptyBoard />}
    </div>
  );
}

export default App;
