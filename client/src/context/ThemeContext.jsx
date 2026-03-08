import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Phase 1: Blur + fade in the overlay
    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.classList.add('theme-overlay--active');

      // Phase 2: After overlay fully covers screen, switch theme
      const onMid = () => {
        overlay.removeEventListener('transitionend', onMid);
        setDarkMode((prev) => !prev);

        // Phase 3: Small delay then fade out overlay
        requestAnimationFrame(() => {
          setTimeout(() => {
            overlay.classList.remove('theme-overlay--active');

            const onEnd = () => {
              overlay.removeEventListener('transitionend', onEnd);
              setIsTransitioning(false);
            };
            overlay.addEventListener('transitionend', onEnd, { once: true });
          }, 80);
        });
      };
      overlay.addEventListener('transitionend', onMid, { once: true });
    });
  }, [isTransitioning]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
      {/* Blur + Fade transition overlay */}
      <div ref={overlayRef} className="theme-overlay" aria-hidden="true" />
    </ThemeContext.Provider>
  );
};
