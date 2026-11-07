import { Capacitor } from "@capacitor/core";

/**
 * Soften layout blow-ups when an older APK still applies Android system font scale.
 * Prefer the native WebSettings.setTextZoom(100) lock in MainActivity; this is a
 * web-side fallback for cards/text overflow until that APK is installed.
 */
export function neutralizeNativeFontScale(): void {
  if (!Capacitor.isNativePlatform()) return;

  const apply = () => {
    const probe = document.createElement("div");
    probe.textContent = "Ag";
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = [
      "position:fixed",
      "left:-9999px",
      "top:0",
      "font-size:16px",
      "line-height:1",
      "font-family:system-ui,sans-serif",
      "padding:0",
      "margin:0",
      "border:0",
      "visibility:hidden",
      "pointer-events:none",
      "white-space:nowrap",
    ].join(";");
    document.body.appendChild(probe);
    const height = probe.getBoundingClientRect().height || 16;
    document.body.removeChild(probe);

    // Unscaled Inter/system UI at 16px is typically ~16–20px tall.
    // Larger values mean Android display font size is inflating text.
    const expected = 19;
    if (height <= expected + 1.5) {
      document.documentElement.style.removeProperty("zoom");
      document.documentElement.classList.remove("font-scale-compensated");
      return;
    }

    const factor = Math.max(0.72, Math.min(1, expected / height));
    document.documentElement.style.zoom = String(Number(factor.toFixed(3)));
    document.documentElement.classList.add("font-scale-compensated");
  };

  apply();
  // Re-check after fonts load / orientation changes.
  window.addEventListener("resize", apply, { passive: true });
  if (document.fonts?.ready) {
    document.fonts.ready.then(apply).catch(() => {});
  }
}
