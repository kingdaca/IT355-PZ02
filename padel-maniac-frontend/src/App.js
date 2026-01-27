import logo from './logo.svg';
import './App.css';
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
