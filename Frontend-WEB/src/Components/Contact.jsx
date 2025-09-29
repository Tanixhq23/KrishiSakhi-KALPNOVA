import React, { useRef, useEffect, useState } from "react";
import "../Styling/Contact.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(
        "h2, p, input, textarea, button, .social-links, .contact-info h2, .contact-info p"
      );

      gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // each element animates one after another
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
      await api.post("/contact/", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message!", error);
      alert("Failed to send message!");
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-container">
        {/* Left Side: Contact Form */}
        <div className="contact-form">
          <h2>Get in Touch</h2>
          <p>We’d love to hear from you! Fill out the form below and we’ll get back to you soon.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <textarea rows="5" name="message" placeholder="Your Message" required value={formData.message} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        {/* Right Side: Contact Info */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
            </svg> 123 Green Valley, Wayanad, Kerala
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
            </svg> +91 98765 43210
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
            </svg> support@krishisakhi.com
          </p>

          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </section>
  );
}
