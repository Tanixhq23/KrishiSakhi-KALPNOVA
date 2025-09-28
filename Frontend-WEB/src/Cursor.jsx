import { useEffect, useState } from "react";
import "./Cursor.css";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const moveCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // update main cursor position
      setPosition({ x, y });

      // create a smoke trail
      const id = Date.now();
      setTrails((prev) => [...prev, { id, x, y }]);

      // remove after animation duration
      setTimeout(() => {
        setTrails((prev) => prev.filter((trail) => trail.id !== id));
      }, 800);
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        className="custom-cursor"
        style={{ left: position.x, top: position.y }}
      >
        <img
          src="/tree-banana-leaf.cur" // replace with your cursor image or PNG
          alt="cursor"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Smoke trail */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="smoke-trail"
          style={{ left: trail.x, top: trail.y }}
        />
      ))}
    </>
  );
};

export default Cursor;
