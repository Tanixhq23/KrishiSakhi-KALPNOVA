import React, { useState, useEffect } from "react";
import "../Styling/Hero.css";

const images = [
  "/6.jpg",
  "/4.jpg",
  "/7.avif",
  "/5.jpg",
  "/3.jpg",
  "/2.jpg"
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="hero-slider">
      <div
        className="slides"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="slide"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="overlay">
              <p className="subtitle">
                <span className="dot">🟢</span> Farmers' 1st Choice{" "}
                <span className="krishi-sakhi">Krishi Sakhi</span>
              </p>
              <h1 className="title">
                Bridging Technology And <br /> Tradition For Better Farming
              </h1>
              <button className="hero-btn">Swipe Up ⬇</button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot-nav ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
}
