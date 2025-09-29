import { useState, useRef, useEffect } from "react";
import "../Styling/Header.css"; // Import your CSS file
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const desktopNavRef = useRef(null);
  const desktopBtnRef = useRef(null);
  const mobileNavRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/session/end/", {}, { headers: { Authorization: `Token ${token}` } });
    } catch (error) {
      console.error("Logout failed!", error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    // Animate desktop nav and buttons on page load
    const desktopLinks = desktopNavRef.current.querySelectorAll("a");
    const desktopButtons = desktopBtnRef.current.querySelectorAll("button");

    gsap.from([...desktopLinks, ...desktopButtons], {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Animate mobile nav links/buttons when menu opens
    if (isMenuOpen && mobileNavRef.current) {
      const mobileItems = mobileNavRef.current.querySelectorAll("a, button");
      gsap.from(mobileItems, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <div className="logo">
            <img src="/Logo.svg" alt="" />
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" ref={desktopNavRef}>
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/services"}>Services</Link>
            <Link to={"/contact"}>Contact</Link>
            {localStorage.getItem('token') && <Link to={"/dashboard"}>Dashboard</Link>}
            {localStorage.getItem('token') && <Link to={"/profile"}>Profile</Link>}
          </nav>
          {/* Desktop Button */}
          <div className="desktop-btn" ref={desktopBtnRef}>
            {localStorage.getItem('token') ? (
              <button className="signupbtn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to={"/signin"}>
                  <button className="signinbtn">SignIn</button>
                </Link>
                <Link to={"/signup"}>
                  <button className="signupbtn">SignUp</button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-btn">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? "×" : "≡"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav" ref={mobileNavRef}>
            <nav>
              <Link to={"/"} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to={"/about"} onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to={"/services"} onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link to={"/contact"} onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              {localStorage.getItem('token') && <Link to={"/dashboard"} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
              {localStorage.getItem('token') && <Link to={"/profile"} onClick={() => setIsMenuOpen(false)}>Profile</Link>}
              {localStorage.getItem('token') ? (
                <button className="signupbtn" onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link to={"/signin"}>
                    <button className="siginbtn">SignIn</button>
                  </Link>
                  <Link to={"/signup"}>
                    <button className="signupbtn">SignUP</button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
