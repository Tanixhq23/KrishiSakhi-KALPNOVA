import React, { useEffect, useRef, useState } from "react";
import "../Styling/NewsAndUpdates.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../api";

gsap.registerPlugin(ScrollTrigger);

export default function NewsAndUpdates() {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState("");
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (sectionRef.current) {
      const elementsToAnimate = sectionRef.current.querySelectorAll(
        ".newsletter-title, .newsletter-input, .news-card"
      );

      gsap.from(elementsToAnimate, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }

    const fetchNews = async () => {
      try {
        const response = await api.get("/news/");
        setNews(response.data);
      } catch (error) {
        console.error("Failed to fetch news!", error);
      }
    };

    fetchNews();
  }, []);

  const handleSubscribe = async () => {
    try {
      await api.post("/subscribe/", { email });
      alert("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error("Subscription failed!", error);
      alert("Subscription failed!");
    }
  };

  return (
    <div className="newsletter-section" ref={sectionRef}>
      <img src='/1.jpg' alt="Newsletter Background" className="newsletter-bg" />

      <div className="newsletter-content">
        <h2 className="newsletter-title">
          Latest Farming Updates & News
        </h2>

        <div className="news-container">
          {news.slice(0, 4).map((item) => (
            <div key={item.id} className="news-card">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          ))}
        </div>

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="newsletter-button" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
