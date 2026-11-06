import React, { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Minimum finger pull distance (in px) required to trigger refresh ("swip down too much")
const PULL_THRESHOLD = 125;
const MAX_PULL_VISUAL = 80;
const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
          Math.pow(diffY, 0.78) * 1.55
        );
        setPullDistance(visualDistance);

        // Check if user swiped down past the threshold ("swip down too much")
        const over = diffY >= PULL_THRESHOLD;
        setIsOverThreshold(over);

        if (over && !vibratedRef.current) {
          vibratedRef.current = true;
          try {
            if ("vibrate" in navigator) {
              navigator.vibrate(22);
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
            navigator.vibrate([18, 40, 25]);
          }
        } catch {}

        // Reload the application after rich animation finishes
        setTimeout(() => {
          window.location.reload();
        }, 850);
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

  // Calculate circular stroke progress (0 to 1)
  const progressRatio = Math.min(1, pullDistance / (MAX_PULL_VISUAL * 0.9));
  const strokeOffset = CIRCUMFERENCE - progressRatio * CIRCUMFERENCE;

  return (
    <>
      {/* ── 1. Top Screen Animated Neon Loading Bar (Active when refreshing) ── */}
      {isRefreshing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "3.5px",
            zIndex: 999999,
            overflow: "hidden",
            backgroundColor: "rgba(15, 91, 228, 0.2)",
            boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "45%",
              background: "linear-gradient(90deg, #0F5BE4 0%, #38BDF8 50%, #10B981 100%)",
              borderRadius: "999px",
              animation: "ptrTopBar 0.9s infinite ease-in-out",
            }}
          />
        </div>
      )}

      {/* ── 2. Subtle Backdrop Blur (gives depth while refreshing) ── */}
      {isRefreshing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            zIndex: 999997,
            pointerEvents: "none",
            animation: "ptrFadeIn 0.25s ease-out",
          }}
        />
      )}

      {/* ── 3. Floating Pull & Refresh Pill Badge ── */}
      <div
        style={{
          position: "fixed",
          top: isRefreshing ? "28px" : `${Math.max(-55, pullDistance - 48)}px`,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999998,
          pointerEvents: "none",
          transition: isPullingRef.current
            ? "none"
            : "top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease",
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
            gap: "9px",
            padding: isOverThreshold || isRefreshing ? "8px 18px 8px 12px" : "10px",
            borderRadius: "999px",
            backgroundColor: "var(--color-surface, #0E131F)",
            border: `1.5px solid ${
              isRefreshing
                ? "rgba(56, 189, 248, 0.8)"
                : isOverThreshold
                ? "var(--color-brand, #0F5BE4)"
                : "rgba(255, 255, 255, 0.16)"
            }`,
            boxShadow: isRefreshing
              ? "0 0 25px rgba(56, 189, 248, 0.5), 0 10px 30px rgba(0, 0, 0, 0.75)"
              : isOverThreshold
              ? "0 8px 24px rgba(15, 91, 228, 0.45), 0 2px 8px rgba(0, 0, 0, 0.6)"
              : "0 6px 18px rgba(0, 0, 0, 0.45)",
            color:
              isOverThreshold || isRefreshing
                ? "var(--color-brand-variant, #38BDF8)"
                : "var(--color-text-secondary, #94A3B8)",
            fontSize: "12.5px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            animation: isRefreshing ? "ptrPulseGlow 1.2s infinite ease-in-out" : undefined,
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            userSelect: "none",
          }}
        >
          {/* Circular Progress Arc / Spinner Container */}
          <div
            style={{
              position: "relative",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* SVG Progress Circle */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: isRefreshing ? undefined : "rotate(-90deg)",
                animation: isRefreshing ? "ptrSvgSpin 0.85s linear infinite" : undefined,
              }}
            >
              {/* Background Track */}
              <circle
                cx="16"
                cy="16"
                r={RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2.5"
              />
              {/* Active Progress Ring */}
              <circle
                cx="16"
                cy="16"
                r={RADIUS}
                fill="none"
                stroke={isOverThreshold || isRefreshing ? "#38BDF8" : "var(--color-brand, #0F5BE4)"}
                strokeWidth="2.5"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={isRefreshing ? CIRCUMFERENCE * 0.35 : strokeOffset}
                strokeLinecap="round"
                style={{
                  transition: isPullingRef.current ? "none" : "stroke-dashoffset 0.25s ease",
                }}
              />
            </svg>

            {/* Inner Refresh Icon */}
            <RefreshCw
              size={15}
              style={{
                transform: isRefreshing
                  ? undefined
                  : `rotate(${pullDistance * 4.5}deg) scale(${1 + (pullDistance / MAX_PULL_VISUAL) * 0.15})`,
                animation: isRefreshing ? "ptrIconSpin 0.75s linear infinite" : undefined,
                transition: isPullingRef.current ? "none" : "transform 0.2s ease",
                color: isOverThreshold || isRefreshing ? "#38BDF8" : "inherit",
              }}
            />
          </div>

          {/* Status Label with Animated Dots */}
          {isRefreshing ? (
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <span>{language === "bn" ? "রিলোড হচ্ছে" : "Refreshing"}</span>
              <span className="ptr-dot ptr-dot-1">.</span>
              <span className="ptr-dot ptr-dot-2">.</span>
              <span className="ptr-dot ptr-dot-3">.</span>
            </span>
          ) : isOverThreshold ? (
            <span style={{ color: "#38BDF8" }}>
              {language === "bn" ? "ছেড়ে দিন রিলোড হবে" : "Release to reload"}
            </span>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes ptrTopBar {
          0% { left: -45%; width: 45%; }
          50% { width: 65%; }
          100% { left: 100%; width: 45%; }
        }
        @keyframes ptrSvgSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ptrIconSpin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.12); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes ptrPulseGlow {
          0%, 100% {
            box-shadow: 0 0 18px rgba(56, 189, 248, 0.4), 0 8px 25px rgba(0, 0, 0, 0.75);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 32px rgba(56, 189, 248, 0.7), 0 12px 32px rgba(15, 91, 228, 0.5);
            transform: scale(1.04);
          }
        }
        @keyframes ptrFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ptrDotJump {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        .ptr-dot {
          display: inline-block;
          font-weight: 800;
          animation: ptrDotJump 1s infinite ease-in-out;
        }
        .ptr-dot-1 { animation-delay: 0s; }
        .ptr-dot-2 { animation-delay: 0.2s; }
        .ptr-dot-3 { animation-delay: 0.4s; }
      `}</style>
    </>
  );
};
