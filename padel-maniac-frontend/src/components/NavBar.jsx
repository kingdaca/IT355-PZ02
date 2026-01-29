import './navbar.css';
import { useState } from 'react';
import CreateMatchModal from "./Match/CreatMatchComponent";
import {useNavigate} from "react-router-dom";

const NavBar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
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
                    </div>

                    <div className="nav-actions">
                        <button
                            className="nav-action-btn search-btn"
                            onClick={() => setShowSearch(!showSearch)}
                            title="Search"
                        >
                            🔍
                        </button>

                        <button
                            className="nav-action-btn create-match-btn"
                            onClick={goToCreatMatch}
                            title="Create Match"
                        >
                            🎾 Create Match
                        </button>
                    </div>
                </div>

                <div className="right-part">
                    <img src="/user.png" alt="User Profile" className="user-avatar" />
                    <div className="user-dropdown">
                        <span className="dropdown-arrow">▼</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar;