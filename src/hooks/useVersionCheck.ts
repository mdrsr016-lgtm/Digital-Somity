import { useEffect, useRef } from 'react';

// Check interval: 1 minute (60000 ms)
const CHECK_INTERVAL = 60000; 

export function useVersionCheck() {
  const currentVersion = useRef<string | null>(null);

  useEffect(() => {
    // Only run in production mode (assuming Vite standard env)
    if (import.meta.env.DEV) {
      return;
    }

    const checkVersion = async () => {
      try {
        // Prevent caching with a timestamp
        const res = await fetch(`/version.json?t=${new Date().getTime()}`);
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (currentVersion.current === null) {
          // Store the very first version we see
          currentVersion.current = data.version;
        } else if (data.version && data.version !== currentVersion.current) {
          // If the fetched version differs from our initial loaded version, reload!
          console.log('New application version detected! Reloading to apply updates.');
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to check application version:', error);
      }
    };

    // Check version immediately on mount
    checkVersion();

    // Set up a polling interval
    const intervalId = setInterval(checkVersion, CHECK_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
}
