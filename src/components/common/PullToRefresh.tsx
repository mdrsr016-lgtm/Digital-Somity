import React, { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Minimum finger pull distance (in px) required to trigger refresh ("swip down too much")
const PULL_THRESHOLD = 130;
const MAX_PULL_VISUAL = 75;

export const PullToRefresh: React.FC = () => {
  const { language } = useLanguage();
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOverThreshold, setIsOverThreshold] = useState(false);

  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const isPullingRef = useRef(false);
  const canPullRef = useRef(false);
  const vibratedRef = useRef(false);

  // Helper: check if target or any ancestor is currently scrolled down
  const isScrolledDown = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    let el: HTMLElement | null = target;
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollTop > 5) {
        return true;
      }
      el = el.parentElement;
    }
    if (window.scrollY > 5 || document.documentElement.scrollTop > 5 || document.body.scrollTop > 5) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing || e.touches.length !== 1) return;

      // Only allow pull-down if already at the top of the scroll container
      if (isScrolledDown(e.target)) {
        canPullRef.current = false;
        return;
      }

      canPullRef.current = true;
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      isPullingRef.current = false;
      vibratedRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPullRef.current || isRefreshing || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - startYRef.current;
      const diffX = currentX - startXRef.current;

      // If user is swiping horizontally more than vertically, cancel pull
      if (Math.abs(diffX) > Math.abs(diffY) && diffY < 30) {
        canPullRef.current = false;
        setPullDistance(0);
        setIsOverThreshold(false);
        return;
      }

      // Check again to ensure user hasn't scrolled down during the gesture
      if (diffY > 15) {
        if (isScrolledDown(e.target)) {
          canPullRef.current = false;
          setPullDistance(0);
          setIsOverThreshold(false);
          return;
        }

        isPullingRef.current = true;

        // Apply progressive damping resistance curve
        const visualDistance = Math.min(
          MAX_PULL_VISUAL,
          Math.pow(diffY, 0.78) * 1.5
        );
        setPullDistance(visualDistance);

        // Check if user swiped down past the threshold ("swip down too much")
        const over = diffY >= PULL_THRESHOLD;
        setIsOverThreshold(over);

        if (over && !vibratedRef.current) {
          vibratedRef.current = true;
          try {
            if ("vibrate" in navigator) {
              navigator.vibrate(18);
            }
          } catch {}
        }
      } else {
        setPullDistance(0);
        setIsOverThreshold(false);
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current || isRefreshing) {
        canPullRef.current = false;
        setPullDistance(0);
        setIsOverThreshold(false);
        return;
      }

      if (isOverThreshold) {
        // Trigger app refresh
        setIsRefreshing(true);
        setPullDistance(MAX_PULL_VISUAL);
        
        try {
          if ("vibrate" in navigator) {
            navigator.vibrate([15, 30, 20]);
          }
        } catch {}

        // Reload the application
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Did not pull enough — spring back smoothly
        setPullDistance(0);
        setIsOverThreshold(false);
      }

      isPullingRef.current = false;
      canPullRef.current = false;
      vibratedRef.current = false;
    };

    const handleTouchCancel = () => {
      isPullingRef.current = false;
      canPullRef.current = false;
      vibratedRef.current = false;
      setPullDistance(0);
      setIsOverThreshold(false);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isRefreshing]);

  if (pullDistance <= 0 && !isRefreshing) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: isRefreshing ? "24px" : `${Math.max(-50, pullDistance - 45)}px`,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999998,
        pointerEvents: "none",
        transition: isPullingRef.current ? "none" : "top 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
        opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: isOverThreshold || isRefreshing ? "7px 16px" : "9px",
          borderRadius: "999px",
          backgroundColor: "var(--color-surface, #0E131F)",
          border: `1.5px solid ${
            isOverThreshold || isRefreshing
              ? "var(--color-brand, #0F5BE4)"
              : "rgba(255, 255, 255, 0.16)"
          }`,
          boxShadow:
            isOverThreshold || isRefreshing
              ? "0 8px 24px rgba(15, 91, 228, 0.4), 0 2px 8px rgba(0, 0, 0, 0.6)"
              : "0 6px 18px rgba(0, 0, 0, 0.45)",
          color:
            isOverThreshold || isRefreshing
              ? "var(--color-brand-variant, #38BDF8)"
              : "var(--color-text-secondary, #94A3B8)",
          fontSize: "12px",
          fontWeight: 600,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          userSelect: "none",
        }}
      >
        <RefreshCw
          size={16}
          style={{
            transform: isRefreshing ? undefined : `rotate(${pullDistance * 4}deg)`,
            animation: isRefreshing ? "ptrSpin 0.75s linear infinite" : undefined,
            transition: isPullingRef.current ? "none" : "transform 0.2s ease",
            color: isOverThreshold || isRefreshing ? "#38BDF8" : "inherit",
          }}
        />
        {isRefreshing ? (
          <span>{language === "bn" ? "রিলোড হচ্ছে..." : "Refreshing..."}</span>
        ) : isOverThreshold ? (
          <span>{language === "bn" ? "ছেড়ে দিন রিলোড হবে" : "Release to reload"}</span>
        ) : null}
      </div>

      <style>{`
        @keyframes ptrSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
