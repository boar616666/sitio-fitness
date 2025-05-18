import { useState, useEffect } from 'react';
import '../styles/ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando se baja 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  // Función para subir al inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Función para bajar al final
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-buttons">
      <button
        onClick={scrollToTop}
        className="scroll-button scroll-up"
        aria-label="Volver arriba"
      >
        ↑
      </button>
      <button
        onClick={scrollToBottom}
        className="scroll-button scroll-down"
        aria-label="Ir abajo"
      >
        ↓
      </button>
    </div>
  );
};

export default ScrollToTop;