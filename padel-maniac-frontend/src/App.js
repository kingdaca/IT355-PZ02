import logo from './logo.svg';
import './App.css';
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import HomePage from "./components/home/HomePage";
import CreateMatch from "./components/Match/CreatMatchComponent";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Matches from "./components/Match/Matches";
import MatchDetails from "./components/MatchDetails/MatchDetails";
import Courts from "./components/Court/Courts";
import SendOffer from "./components/SendOffer/SendOffer";
import {jwtDecode} from "jwt-decode";
import {useEffect} from "react";
import NavBar from "./components/NavBar";
import CourtRegistrationForm from "./components/auth/CourtRegistrationForm";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      // ⚠️ exp je u SEKUNDAMA
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="App">
      { location.pathname !== '/login' && location.pathname !== '/registration' &&(<NavBar />)}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/registrationAsCourt" element={<CourtRegistrationForm />} />
          <Route path="/" element={<HomePage />} />
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
