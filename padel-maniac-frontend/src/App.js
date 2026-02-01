import logo from './logo.svg';
import './App.css';
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import HomePage from "./components/home/HomePage";
import CreateMatch from "./components/Match/CreatMatchComponent";
import {Route, Routes} from "react-router-dom";
import Matches from "./components/Match/Matches";
import MatchDetails from "./components/MatchDetails/MatchDetails";
import Courts from "./components/Court/Courts";
import SendOffer from "./components/SendOffer/SendOffer";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/createMatch" element={<CreateMatch />} />
          <Route path="/matches" element={<Matches />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/sendOffer" element={<SendOffer />} />
      </Routes>
    </div>
  );
}

export default App;
