import { useState, useEffect, useRef } from 'react';

// Check interval: 10 seconds for testing (can be increased later)
const CHECK_INTERVAL = 10000; 

export function useVersionCheck() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const currentVersion = useRef<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${new Date().getTime()}`);
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (currentVersion.current === null) {
          currentVersion.current = data.version;
          console.log('[VersionCheck] Initial version stored:', data.version);
        } else if (data.version && data.version !== currentVersion.current) {
          console.log('[VersionCheck] New version available:', data.version);
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('[VersionCheck] Check failed:', error);
      }
    };

    checkVersion();
    const intervalId = setInterval(checkVersion, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const reloadApp = () => {
    window.location.reload();
  };

  return { isUpdateAvailable, reloadApp };
}
