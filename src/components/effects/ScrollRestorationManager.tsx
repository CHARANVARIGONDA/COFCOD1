import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollRestorationManager: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const isPopRef = useRef(false);

  // Set manual browser scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track scroll position per location.key
  useEffect(() => {
    const handleScroll = () => {
      if (location.key) {
        sessionStorage.setItem(`cofoco_scroll_${location.key}`, String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key]);

  // Handle route changes
  useEffect(() => {
    if (navType === 'POP') {
      isPopRef.current = true;
      const savedY = sessionStorage.getItem(`cofoco_scroll_${location.key}`);
      const targetY = savedY ? parseInt(savedY, 10) : 0;
      
      // Instant restore on POP without triggering scroll-to-top
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' as ScrollBehavior });
      });
    } else if (navType === 'PUSH') {
      isPopRef.current = false;
      // Scroll to top only on PUSH navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [location.key, location.pathname, navType]);

  return null;
};
