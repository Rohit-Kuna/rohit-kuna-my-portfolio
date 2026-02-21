"use client";

import { useCallback, useEffect, useState } from "react";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

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

const FULLSCREEN_PROMPT_LAST_VISIT_KEY = "fullscreen-prompt-last-visit";
const FULLSCREEN_PROMPT_REPEAT_AFTER_MS = 15 * 24 * 60 * 60 * 1000;

const FullscreenPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

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

  const shouldShowPromptByVisitRule = () => {
    if (typeof window === "undefined") return true;

    const now = Date.now();
    const savedValue = window.localStorage.getItem(FULLSCREEN_PROMPT_LAST_VISIT_KEY);
    const savedTimestamp = Number(savedValue);

    const isFirstVisit = !savedValue;
    const isStaleVisit = Number.isFinite(savedTimestamp)
      ? now - savedTimestamp >= FULLSCREEN_PROMPT_REPEAT_AFTER_MS
      : true;

    window.localStorage.setItem(FULLSCREEN_PROMPT_LAST_VISIT_KEY, String(now));
    return isFirstVisit || isStaleVisit;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldShowByVisitRule = shouldShowPromptByVisitRule();

    const doc = document as FullscreenDocument;
    const isAlreadyFullscreen = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
    if (isAlreadyFullscreen || !shouldShowByVisitRule) {
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
    if (typeof window === "undefined") return;

    const onRequestFullscreen = () => {
      void enableFullscreen();
    };

    window.addEventListener("mobile-request-fullscreen", onRequestFullscreen);
    return () => window.removeEventListener("mobile-request-fullscreen", onRequestFullscreen);
  }, [enableFullscreen]);

  useEffect(() => {
    if (!isVisible || isMobile || typeof window === "undefined") return;

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
  }, [isVisible, isMobile, enableFullscreen, closePrompt]);

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
            autoFocus={!isMobile}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPrompt;
