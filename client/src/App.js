import './App.css';
import Board from './Components/Board/Board.jsx';
import Register from './Components/LogIn/Register.jsx';
import LoginPage from './Components/LogIn/LoginPage.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LoginPage/>}
          ></Route>
          <Route
            path='/register'
            element={<Register />}
          ></Route>
          <Route
          path='/board'
          element={<Board/>}
          >
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
