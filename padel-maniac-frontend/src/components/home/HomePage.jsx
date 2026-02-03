import NavBar from "../NavBar";
import "./Home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy, faCalendarAlt, faMapMarkerAlt, faStar, faHeart } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {

    const role = localStorage.getItem("role")[0];

    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">🎾 <span className="highlight">Padel</span> Maniac</h1>
                    <p className="hero-subtitle">Find the perfect partner for your next padel match</p>
                    <p className="hero-description">
                        Connect with padel enthusiasts in your area, organize matches, and improve your game
                    </p>
                    <div className="hero-buttons">
                        {role ? (
                            <a href="/Matches" className="btn-primary">Find match</a>
                            ) : (
                            <a href="/Login" className="btn-primary">Start Your Journey</a>
                            )}
                    </div>
                </div>
                <div className="hero-image">
                    <div className="padel-court">
                        <div className="court-design"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose <span className="highlight">Padel Maniac</span>?</h2>
                <p className="section-subtitle">Everything you need for the perfect padel experience</p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <h3>Find Partners</h3>
                        <p>Connect with players of similar skill level in your area</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <h3>Organize Matches</h3>
                        <p>Easily schedule and manage your padel sessions</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <h3>Discover Courts</h3>
                        <p>Find the best padel courts in your city</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faTrophy} />
                        </div>
                        <h3>Track Progress</h3>
                        <p>Monitor your performance and improve your skills</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2 className="section-title">How It <span className="highlight">Works</span></h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Profile</h3>
                        <p>Sign up and create your padel player profile</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Find Players</h3>
                        <p>Browse players or search for specific skill levels</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Schedule Match</h3>
                        <p>Pick a time, location, and confirm your match</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h3>Play & Rate</h3>
                        <p>Enjoy your game and rate your experience</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2 className="section-title">What Players <span className="highlight">Say</span></h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Found my regular padel partner in just 2 days! Amazing platform!"</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar">M</div>
                            <div className="author-info">
                                <h4>Marko T.</h4>
                                <p>Intermediate Player</p>
                                <div className="stars">
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"As a beginner, I found players at my level. Made learning so much fun!"</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar">A</div>
                            <div className="author-info">
                                <h4>Ana S.</h4>
                                <p>Beginner Player</p>
                                <div className="stars">
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Perfect for organizing weekly matches with my friends and new players!"</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar">D</div>
                            <div className="author-info">
                                <h4>David L.</h4>
                                <p>Advanced Player</p>
                                <div className="stars">
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faHeart} style={{color: '#ff6b6b'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-item">
                        <h3>500+</h3>
                        <p>Active Players</p>
                    </div>
                    <div className="stat-item">
                        <h3>1,200+</h3>
                        <p>Matches Played</p>
                    </div>
                    <div className="stat-item">
                        <h3>50+</h3>
                        <p>Courts Listed</p>
                    </div>
                    <div className="stat-item">
                        <h3>98%</h3>
                        <p>Satisfaction Rate</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {
                !role && (
                    <section className="cta-section">
                        <div className="cta-content">
                            <h2>Ready to Play?</h2>
                            <p>Join our community of padel enthusiasts today</p>
                            <div className="cta-buttons">
                                <a href="/register" className="btn-primary">Sign Up Free</a>
                                <a href="/login" className="btn-secondary">Login</a>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h3>🎾 Padel Maniac</h3>
                        <p>Connecting padel players worldwide</p>
                    </div>
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Platform</h4>
                            <a href="/about">About Us</a>
                            <a href="/features">Features</a>
                            <a href="/pricing">Pricing</a>
                        </div>
                        <div className="footer-column">
                            <h4>Support</h4>
                            <a href="/help">Help Center</a>
                            <a href="/contact">Contact</a>
                            <a href="/faq">FAQ</a>
                        </div>
                        <div className="footer-column">
                            <h4>Legal</h4>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                            <a href="/cookies">Cookie Policy</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Padel Maniac. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default HomePage;