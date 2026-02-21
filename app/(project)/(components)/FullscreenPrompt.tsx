"use client";

import { useCallback, useEffect, useState } from "react";

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

  const closePrompt = useCallback(() => {
    setIsVisible(false);
    markPromptResolved();
  }, []);

  const enableFullscreen = useCallback(async () => {
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
  }, [closePrompt]);

  useEffect(() => {
    if (!isVisible || typeof window === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void enableFullscreen();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closePrompt();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVisible, enableFullscreen, closePrompt]);

  if (!isVisible) return null;

  return (
    <div
      className="fullscreen-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-prompt-title"
      aria-describedby="fullscreen-prompt-description"
    >
      <div className="fullscreen-prompt-card glass-div">
        <h3 id="fullscreen-prompt-title" className="fullscreen-prompt-title">
          Enter Fullscreen Mode?
        </h3>
        <p id="fullscreen-prompt-description" className="fullscreen-prompt-text">
          For immersive experience, switch to fullscreen.
        </p>
        <div className="fullscreen-prompt-actions">
          <button type="button" onClick={closePrompt}>
            Dismiss
          </button>
          <button
            type="button"
            className="is-primary"
            onClick={enableFullscreen}
            autoFocus
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPrompt;
