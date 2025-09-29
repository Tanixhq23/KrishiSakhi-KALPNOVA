import React, { useEffect, useRef } from "react";
import "../Styling/Stats.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const statsRef = useRef([]);

  const stats = [
    { value: "50+", label: "Years Of Experience" },
    { value: "200+", label: "Fields In Progress" },
    { value: "1,20,000+", label: "Farmers Around Kerala" },
    { value: "₹10,00,000+", label: "Agricultural Products" },
  ];

  useEffect(() => {
    statsRef.current.forEach((el, idx) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: idx * 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 80%", // When the element comes into view
          },
        }
      );
    });
  }, []);

  return (
    <section className="stats-section">
      {stats.map((item, idx) => (
        <div
          className="stat-item"
          key={idx}
          ref={(el) => (statsRef.current[idx] = el)}
        >
          <h2 className="stat-value">{item.value}</h2>
          <p className="stat-label">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
