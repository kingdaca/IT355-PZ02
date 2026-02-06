import './navbar.css';
import { useState } from 'react';
import CreateMatchModal from "./Match/CreatMatchComponent";
import {useNavigate} from "react-router-dom";
import Notification from "./Notification/Notification";

const NavBar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Implement search logic here
        setShowSearch(false);
        setSearchQuery('');
    };

    const goToCreatMatch = () => {
        navigate("/CreateMatch")
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        console.log("aaaaaa");
        navigate("/login")
    }


    return (
        <>
            <div className="nav-bar">
                <div className="left-part">
                    <img src="/logo.png" alt="Padel Maniac Logo" />
                </div>

                <div className="middle-part">
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/matches" className="nav-link">Matches</a>
                        <a href="/courts" className="nav-link">Courts</a>
                        {role !== 'PLAYER' && (<a href="/sendOffer" className="nav-link">Send offer</a>)}
                        {role !== 'PLAYER' && (<a href="/MyOffers" className="nav-link">My offers</a>)}
                        {role === 'ADMIN' && (<a href="/registrationAsCourt" className="nav-link">Register new court</a>)}
                        <button
                            className="nav-link"
                            onClick={goToCreatMatch}
                            title="Create Match"
                        >
                            🎾 Create Match
                        </button>
                    </div>
                </div>

                <div className="right-part">
                    <div className="name">
                        <img src="/user.png" alt="User Profile" className="user-avatar"/>
                        <span>{localStorage.getItem("username")}</span>
                    </div>
                    <div className="user-dropdown">
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <div className="notification">
                        <Notification></Notification>
                        <span onClick={logout}>Logout</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar;