import React, { useRef, useEffect, useState } from "react";
import "../Styling/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api";

gsap.registerPlugin(ScrollTrigger);

export default function SignIn() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (sectionRef.current) {
      // Select all elements inside the right column (text, inputs, button, social icons)
      const elements = sectionRef.current.querySelectorAll(
        ".auth-right h2, .auth-right .form-group, .auth-right .auth-btn, .auth-right .social-icons, .auth-right .switch-auth"
      );

      gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // animate each element one by one
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login/", {
        username: formData.email, // The backend expects a username, which is the email
        password: formData.password,
      });
      localStorage.setItem("token", response.data.token);
      await api.post("/session/start/", {}, { headers: { Authorization: `Token ${response.data.token}` } });
      navigate("/");
    } catch (error) {
      console.error("Login failed!", error);
      alert("Login failed!");
    }
  };

  return (
    <div className="auth-page" ref={sectionRef}>
      <div className="auth-card">
        {/* Left column: image only */}
        <div className="auth-left">
          <img src="/13.webp" alt="Sign In" className="auth-image-full" />
        </div>

        {/* Right column: form */}
        <div className="auth-right">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" name="email" required placeholder=" " value={formData.email} onChange={handleChange} />
              <label>Email Address</label>
            </div>
            <div className="form-group">
              <input type="password" name="password" required placeholder=" " value={formData.password} onChange={handleChange} />
              <label>Password</label>
            </div>
            <button type="submit" className="auth-btn">Sign In</button>
          </form>

          {/* Social icons at bottom */}
          <div className="social-icons">
            <button className="icon-btn google" title="Google">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-google" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
              </svg>
            </button>
            <button className="icon-btn facebook" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </button>
          </div>

          <p className="switch-auth">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
