
import React, { useEffect } from "react";

const FloatingElements: React.FC = () => {
  useEffect(() => {
    // Add animated background elements
    const section = document.getElementById('about');
    if (section) {
      for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element floating';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 100 + 50}px`;
        element.style.height = `${Math.random() * 100 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.02}`;
        section.appendChild(element);
      }
    }
  }, []);

  return null;
};

export default FloatingElements;
