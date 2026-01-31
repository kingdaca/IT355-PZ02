import logo from './logo.svg';
import './App.css';
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import HomePage from "./components/home/HomePage";
import CreateMatch from "./components/Match/CreatMatchComponent";
import {Route, Routes} from "react-router-dom";
import Matches from "./components/Match/Matches";
import MatchDetails from "./components/MatchDetails/MatchDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/CreateMatch" element={<CreateMatch />} />
          <Route path="/Matches" element={<Matches />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
      </Routes>
    </div>
  );
}

export default App;
