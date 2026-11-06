import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

// Finger travel required before a release reloads the app.
const PULL_THRESHOLD = 110;
// How far the page slides down once the gesture is ready to release.
const MAX_SHIFT = 72;
const SIZE = 40;
const STROKE = 2.25;
const RADIUS = 13.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PullToRefresh: React.FC = () => {
  const [pull, setPull] = useState(0);
  const [gesture, setGesture] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [ready, setReady] = useState(false);

  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const isPullingRef = useRef(false);
  const canPullRef = useRef(false);
  const vibratedRef = useRef(false);
  const readyRef = useRef(false);
  const refreshingRef = useRef(false);

  const isScrolledDown = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    let el: HTMLElement | null = target;
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollTop > 5) return true;
      el = el.parentElement;
    }
    return (
      window.scrollY > 5 ||
      document.documentElement.scrollTop > 5 ||
      document.body.scrollTop > 5
    );
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (refreshingRef.current || e.touches.length !== 1) return;

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
      if (!canPullRef.current || refreshingRef.current || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - startYRef.current;
      const diffX = currentX - startXRef.current;

      if (Math.abs(diffX) > Math.abs(diffY) && diffY < 30) {
        canPullRef.current = false;
        isPullingRef.current = false;
        readyRef.current = false;
        setPull(0);
        setGesture(0);
        setReady(false);
        return;
      }

      if (diffY > 12) {
        if (isScrolledDown(e.target)) {
          canPullRef.current = false;
          isPullingRef.current = false;
          readyRef.current = false;
          setPull(0);
          setGesture(0);
          setReady(false);
          return;
        }

        isPullingRef.current = true;

        const shown = Math.min(1, diffY / PULL_THRESHOLD);
        const extra = Math.max(0, diffY - PULL_THRESHOLD);
        // Linear until the release point, then a short rubber-band.
        setPull(shown * MAX_SHIFT + Math.min(22, extra * 0.16));
        setGesture(shown);

        const over = diffY >= PULL_THRESHOLD;
        if (over !== readyRef.current) {
          readyRef.current = over;
          setReady(over);
          if (over && !vibratedRef.current) {
            vibratedRef.current = true;
            try {
              navigator.vibrate?.(12);
            } catch {
              /* haptic unsupported */
            }
          }
          if (!over) vibratedRef.current = false;
        }
      } else if (isPullingRef.current) {
        setPull(0);
        setGesture(0);
        if (readyRef.current) {
          readyRef.current = false;
          setReady(false);
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current || refreshingRef.current) {
        canPullRef.current = false;
        isPullingRef.current = false;
        return;
      }

      isPullingRef.current = false;
      canPullRef.current = false;

      if (readyRef.current) {
        refreshingRef.current = true;
        readyRef.current = false;
        setReady(false);
        setRefreshing(true);
        setGesture(1);
        setPull(MAX_SHIFT);

        try {
          navigator.vibrate?.(16);
        } catch {
          /* haptic unsupported */
        }

        window.setTimeout(() => {
          window.location.reload();
        }, 720);
      } else {
        setPull(0);
        setGesture(0);
        setReady(false);
      }

      vibratedRef.current = false;
    };

    const handleTouchCancel = () => {
      isPullingRef.current = false;
      canPullRef.current = false;
      vibratedRef.current = false;
      readyRef.current = false;
      setPull(0);
      setGesture(0);
      setReady(false);
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
  }, []);

  const progress = refreshing ? 1 : gesture;
  const shift = refreshing ? MAX_SHIFT : pull;

  useLayoutEffect(() => {
    const el = document.getElementById("ptr-content");
    if (!el) return;
    el.style.transition = isPullingRef.current
      ? "none"
      : "transform 0.5s cubic-bezier(0.22, 1.15, 0.36, 1)";
    el.style.transform = shift > 0.5 ? `translateY(${shift}px)` : "";
  }, [shift]);

  useLayoutEffect(() => {
    return () => {
      const el = document.getElementById("ptr-content");
      if (!el) return;
      el.style.transform = "";
      el.style.transition = "";
    };
  }, []);

  const visible = shift > 2 || refreshing;
  // Sit in the middle of the gap the page just opened.
  const drop = shift / 2 - SIZE / 2;
  const scale = refreshing ? 1 : 0.82 + progress * 0.18;
  const opacity = refreshing ? 1 : Math.min(1, Math.max(0, (pull - 6) / 22));
  const arcOffset = refreshing
    ? CIRCUMFERENCE * 0.72
    : CIRCUMFERENCE * (1 - progress);

  return (
    <>
      <div
        aria-hidden={!visible}
        style={{
          position: "fixed",
          top: "env(safe-area-inset-top, 0px)",
          left: "50%",
          zIndex: 999998,
          pointerEvents: "none",
          opacity,
          transform: `translateX(-50%) translateY(${drop}px)`,
          transition: isPullingRef.current
            ? "none"
            : "transform 0.5s cubic-bezier(0.22, 1.15, 0.36, 1), opacity 0.28s ease",
        }}
      >
        <div
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "color-mix(in srgb, var(--color-surface, #ffffff) 86%, transparent)",
            border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
            boxShadow:
              "0 1px 1px rgba(0,0,0,0.04), 0 8px 24px rgba(4, 27, 69, 0.12)",
            backdropFilter: "blur(18px) saturate(1.4)",
            WebkitBackdropFilter: "blur(18px) saturate(1.4)",
            transform: `scale(${scale})`,
            transition: isPullingRef.current
              ? "none"
              : "transform 0.45s cubic-bezier(0.22, 1.2, 0.36, 1)",
            animation: ready && !refreshing ? "ptrPop 0.38s cubic-bezier(0.22, 1.2, 0.36, 1)" : undefined,
          }}
        >
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{
              position: "absolute",
              animation: refreshing ? "ptrSpin 0.8s linear infinite" : undefined,
            }}
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-brand-soft, rgba(15, 91, 228, 0.16))"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-brand, #0F5BE4)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={arcOffset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{
                transition: isPullingRef.current || refreshing
                  ? "none"
                  : "stroke-dashoffset 0.35s ease",
              }}
            />
          </svg>

          <ChevronDown
            size={16}
            strokeWidth={2.5}
            style={{
              color: ready ? "var(--color-brand, #0F5BE4)" : "var(--color-text-muted, #94A3B8)",
              opacity: refreshing ? 0 : 1,
              transform: `rotate(${progress * 180}deg)`,
              transition: isPullingRef.current
                ? "color 0.2s ease, opacity 0.2s ease"
                : "transform 0.35s cubic-bezier(0.22, 1.15, 0.36, 1), opacity 0.2s ease, color 0.2s ease",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes ptrSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes ptrPop {
          0%   { transform: scale(0.94); }
          55%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ptrSpin { to { transform: none; } }
          @keyframes ptrPop { to { transform: none; } }
        }
      `}</style>
    </>
  );
};
