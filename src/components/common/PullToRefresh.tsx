import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

// Finger or mouse travel required before a release reloads this page.
const PULL_THRESHOLD = 168;
// How far the current page slides down.
const MAX_SHIFT = 140;
const SIZE = 28;
const STROKE = 2.5;
const RADIUS = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PullToRefresh: React.FC = () => {
  const [pull, setPull] = useState(0);
  const [gesture, setGesture] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const isPullingRef = useRef(false);
  const canPullRef = useRef(false);
  const vibratedRef = useRef(false);
  const readyRef = useRef(false);
  const refreshingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const isScrolledDown = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    let el: HTMLElement | null = target;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const canScroll = /(auto|scroll)/.test(style.overflowY);
      if (canScroll && el.scrollTop > 5) return true;
      el = el.parentElement;
    }
    return (
      window.scrollY > 5 ||
      document.documentElement.scrollTop > 5 ||
      document.body.scrollTop > 5
    );
  };

  const blocksPull = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  };

  useEffect(() => {
    const resetPull = () => {
      isPullingRef.current = false;
      canPullRef.current = false;
      readyRef.current = false;
      vibratedRef.current = false;
      pointerIdRef.current = null;
      setPull(0);
      setGesture(0);
    };

    const begin = (x: number, y: number, target: EventTarget | null) => {
      if (refreshingRef.current || isScrolledDown(target) || blocksPull(target)) {
        canPullRef.current = false;
        return;
      }
      canPullRef.current = true;
      startYRef.current = y;
      startXRef.current = x;
      isPullingRef.current = false;
      vibratedRef.current = false;
      readyRef.current = false;
    };

    const move = (x: number, y: number, target: EventTarget | null) => {
      if (!canPullRef.current || refreshingRef.current) return;

      const diffY = y - startYRef.current;
      const diffX = x - startXRef.current;

      if (Math.abs(diffX) > Math.abs(diffY) && diffY < 30) {
        resetPull();
        return;
      }

      if (diffY <= 12) {
        if (isPullingRef.current) resetPull();
        return;
      }

      if (isScrolledDown(target)) {
        resetPull();
        return;
      }

      isPullingRef.current = true;

      const shown = Math.min(1, diffY / PULL_THRESHOLD);
      const extra = Math.max(0, diffY - PULL_THRESHOLD);
      setPull(shown * MAX_SHIFT + Math.min(28, extra * 0.18));
      setGesture(shown);

      const over = diffY >= PULL_THRESHOLD;
      if (over !== readyRef.current) {
        readyRef.current = over;
        if (over && !vibratedRef.current) {
          vibratedRef.current = true;
          try {
            navigator.vibrate?.(10);
          } catch {
            /* haptic unsupported */
          }
        }
        if (!over) vibratedRef.current = false;
      }
    };

    const finish = () => {
      pointerIdRef.current = null;

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
        setRefreshing(true);
        setGesture(1);
        setPull(MAX_SHIFT);

        try {
          navigator.vibrate?.(12);
        } catch {
          /* haptic unsupported */
        }

        // Reload the page already on screen. Auth stays in local storage.
        window.setTimeout(() => {
          window.location.reload();
        }, 560);
      } else {
        resetPull();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      begin(e.touches[0].clientX, e.touches[0].clientY, e.target);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      move(e.touches[0].clientX, e.touches[0].clientY, e.target);
      if (isPullingRef.current) e.preventDefault();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pointerIdRef.current = e.pointerId;
      begin(e.clientX, e.clientY, e.target);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || pointerIdRef.current !== e.pointerId) return;
      move(e.clientX, e.clientY, e.target);
      if (isPullingRef.current) e.preventDefault();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || pointerIdRef.current !== e.pointerId) return;
      finish();
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", finish);
    window.addEventListener("touchcancel", resetPull);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", finish);
      window.removeEventListener("touchcancel", resetPull);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const progress = refreshing ? 1 : gesture;
  const shift = refreshing ? MAX_SHIFT : pull;

  useLayoutEffect(() => {
    const el = document.getElementById("ptr-content");
    if (!el) return;
    el.style.transition = isPullingRef.current
      ? "none"
      : "transform 0.55s cubic-bezier(0.22, 1.1, 0.36, 1)";
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

  const visible = shift > 4 || refreshing;
  const drop = Math.max(8, shift / 2 - SIZE / 2);
  const opacity = refreshing ? 1 : Math.min(1, Math.max(0, (pull - 16) / 36));
  const arcOffset = refreshing ? CIRCUMFERENCE * 0.72 : CIRCUMFERENCE * (1 - progress);

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
            : "transform 0.55s cubic-bezier(0.22, 1.1, 0.36, 1), opacity 0.25s ease",
        }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{
            display: "block",
            animation: refreshing ? "ptrSpin 0.75s linear infinite" : undefined,
          }}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-brand-soft, rgba(15, 91, 228, 0.18))"
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
          />
        </svg>
      </div>

      <style>{`
        @keyframes ptrSpin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ptrSpin { to { transform: none; } }
        }
      `}</style>
    </>
  );
};
