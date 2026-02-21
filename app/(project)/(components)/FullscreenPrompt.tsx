"use client";

import { useEffect, useState } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

const FullscreenPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);

  const markPromptResolved = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    document.documentElement.dataset.mobileFullscreenPromptResolved = "1";
    window.dispatchEvent(new Event("mobile-fullscreen-prompt-resolved"));
  };

  const markPromptVisible = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    document.documentElement.dataset.mobileFullscreenPromptResolved = "0";
    window.dispatchEvent(new Event("mobile-fullscreen-prompt-visible"));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const doc = document as FullscreenDocument;
    const isAlreadyFullscreen = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
    if (isAlreadyFullscreen) {
      markPromptResolved();
      return;
    }

    markPromptVisible();
    if (!isAlreadyFullscreen) {
      const timeoutId = window.setTimeout(() => setIsVisible(true), 300);
      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const closePrompt = () => {
    setIsVisible(false);
    markPromptResolved();
  };

  const enableFullscreen = async () => {
    if (typeof document === "undefined") return;

    const element = document.documentElement as FullscreenElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch {
      // Ignore failures (browser policy/support). Keep app usable.
    } finally {
      closePrompt();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fullscreen-prompt-overlay" role="dialog" aria-modal="true">
      <div className="fullscreen-prompt-card glass-div">
        <h3 className="fullscreen-prompt-title">Enter Fullscreen Mode For Immersive Experience.</h3>
        <div className="fullscreen-prompt-actions">
          <button type="button" onClick={closePrompt}>
            Not now
          </button>
          <button type="button" className="is-primary" onClick={enableFullscreen}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPrompt;
