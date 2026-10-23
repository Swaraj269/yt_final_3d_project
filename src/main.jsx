// Keep the original handler so hot reloads don't stack warning filters.
const originalWarnKey = Symbol.for("swaraj-portfolio.originalConsoleWarn");

if (!Object.prototype.hasOwnProperty.call(console, originalWarnKey)) {
  const originalWarn = console.warn;

  Object.defineProperty(console, originalWarnKey, {
    value: originalWarn,
  });

  console.warn = function (...args) {
    const message = args
      .map((arg) => {
        if (typeof arg === "string") return arg;
        if (arg instanceof Error) return arg.message;
        return "";
      })
      .join(" ");

    // Suppress only the Three.js Clock deprecation warning.
    if (message.includes("THREE.Clock")) return;

    // Forward every other warning with its original arguments and context.
    return Reflect.apply(originalWarn, this, args);
  };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Keep the app inside Safari's visible viewport when its layout and visual
// viewport widths differ (for example, after a zoom or device resize).
const syncVisibleViewportWidth = () => {
  const layoutWidth =
    document.documentElement.clientWidth || window.innerWidth;
  const visibleWidth = Math.min(
    window.visualViewport?.width ?? layoutWidth,
    layoutWidth,
  );

  document.documentElement.style.setProperty(
    "--visible-viewport-width",
    `${visibleWidth}px`,
  );
};

syncVisibleViewportWidth();
window.addEventListener("resize", syncVisibleViewportWidth, { passive: true });
window.visualViewport?.addEventListener("resize", syncVisibleViewportWidth, {
  passive: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
