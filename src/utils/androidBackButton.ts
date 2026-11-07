import { App as CapApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export type AndroidBackHandler = () => boolean;

const handlers = new Set<AndroidBackHandler>();

/** Register a back handler. Return true if the event was consumed. */
export function registerAndroidBackHandler(handler: AndroidBackHandler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

let started = false;

/**
 * Intercept the Android system back button so the app navigates in-app
 * instead of exiting. Handlers run newest-first; if none consume it, minimize.
 */
export function startAndroidBackButtonListener(): () => void {
  if (!Capacitor.isNativePlatform() || started) {
    return () => {};
  }
  started = true;

  const listenerPromise = CapApp.addListener("backButton", () => {
    const stack = Array.from(handlers).reverse();
    for (const handler of stack) {
      try {
        if (handler()) return;
      } catch {
        // keep trying other handlers
      }
    }

    const state = window.history.state as { digiSomiti?: string } | null;
    if (state?.digiSomiti && state.digiSomiti !== "root") {
      window.history.back();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    CapApp.minimizeApp().catch(() => {
      // last resort — never hard-exit from a single back press
    });
  }).catch((err) => {
    console.warn("Android back listener unavailable:", err);
  });

  return () => {
    started = false;
    listenerPromise
      .then((handle) => {
        if (handle && "remove" in handle) handle.remove();
      })
      .catch(() => {});
  };
}
