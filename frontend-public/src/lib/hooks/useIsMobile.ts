'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user is on a mobile device
 * Checks both screen size and user agent
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check screen width (mobile if < 768px)
      const screenCheck = window.innerWidth < 768;

      // Check user agent for mobile devices
      const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Check for touch support
      const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Consider mobile if any two conditions are true
      const mobileScore = [screenCheck, userAgentCheck, touchCheck].filter(Boolean).length;
      setIsMobile(mobileScore >= 2);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
