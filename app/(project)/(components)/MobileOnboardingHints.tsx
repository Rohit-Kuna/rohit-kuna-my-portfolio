import { useEffect, useState } from "react";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

type HintStep = "swipe" | "dock" | "swipeLeft" | "drag" | "done";
const MOBILE_HINTS_COMPLETED_KEY = "mobile-onboarding-hints-completed";
const MOBILE_HINTS_REPEAT_AFTER_MS = 15 * 24 * 60 * 60 * 1000;

const MobileOnboardingHints = () => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<HintStep>("swipe");
  const [shouldShowHints] = useState(
    () => {
      if (typeof window === "undefined") return true;

      const savedValue = window.localStorage.getItem(MOBILE_HINTS_COMPLETED_KEY);
      if (!savedValue) return true;

      const savedTimestamp = Number(savedValue);
      if (!Number.isFinite(savedTimestamp)) return false;

      return Date.now() - savedTimestamp >= MOBILE_HINTS_REPEAT_AFTER_MS;
    }
  );
  const [isUnlocked, setIsUnlocked] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.dataset.mobileFullscreenPromptResolved === "1"
  );
  const [forceShowTour, setForceShowTour] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const onPromptVisible = () => {
      setIsUnlocked(false);
    };
    const onPromptResolved = () => {
      setIsUnlocked(true);
    };

    window.addEventListener("mobile-fullscreen-prompt-visible", onPromptVisible);
    window.addEventListener("mobile-fullscreen-prompt-resolved", onPromptResolved);

    return () => {
      window.removeEventListener("mobile-fullscreen-prompt-visible", onPromptVisible);
      window.removeEventListener("mobile-fullscreen-prompt-resolved", onPromptResolved);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !isUnlocked || (!shouldShowHints && !forceShowTour)) return;

    const onNotificationOpened = () => {
      setStep((prev) => (prev === "swipe" ? "dock" : prev));
    };

    const onDockTap = () => {
      setStep((prev) => (prev === "dock" ? "swipeLeft" : prev));
    };

    const onWindowSwiped = (event: Event) => {
      const direction = (event as CustomEvent<{ direction?: string }>).detail?.direction;
      setStep((prev) => (prev === "swipeLeft" && direction === "left" ? "drag" : prev));
    };

    const onHomeDrag = () => {
      setStep((prev) => {
        if (prev === "drag") {
          setForceShowTour(false);
          return "done";
        }
        return prev;
      });
    };

    window.addEventListener("mobile-notification-opened", onNotificationOpened);
    window.addEventListener("mobile-dock-icon-tap", onDockTap);
    window.addEventListener("mobile-window-swiped", onWindowSwiped);
    window.addEventListener("mobile-home-dragged", onHomeDrag);

    return () => {
      window.removeEventListener("mobile-notification-opened", onNotificationOpened);
      window.removeEventListener("mobile-dock-icon-tap", onDockTap);
      window.removeEventListener("mobile-window-swiped", onWindowSwiped);
      window.removeEventListener("mobile-home-dragged", onHomeDrag);
    };
  }, [isMobile, isUnlocked, shouldShowHints, forceShowTour]);

  useEffect(() => {
    if (!isMobile || (!shouldShowHints && !forceShowTour)) return;

    if (isUnlocked && step === "dock") {
      window.dispatchEvent(new Event("mobile-hint-dock-start"));
      return;
    }

    window.dispatchEvent(new Event("mobile-hint-dock-end"));
  }, [isMobile, isUnlocked, step, shouldShowHints, forceShowTour]);

  useEffect(() => {
    if (step !== "done" || !shouldShowHints || typeof window === "undefined") return;
    window.localStorage.setItem(MOBILE_HINTS_COMPLETED_KEY, String(Date.now()));
  }, [step, shouldShowHints]);

  useEffect(() => {
    if (!isMobile) return;

    const onShowTour = () => {
      const isPromptResolved =
        typeof document !== "undefined" &&
        document.documentElement.dataset.mobileFullscreenPromptResolved === "1";
      setIsUnlocked(isPromptResolved);
      setStep("swipe");
      setForceShowTour(true);
    };

    window.addEventListener("mobile-show-tour", onShowTour);
    return () => window.removeEventListener("mobile-show-tour", onShowTour);
  }, [isMobile]);

  if (!isMobile || (!shouldShowHints && !forceShowTour) || !isUnlocked || step === "done") {
    return null;
  }

  const titleByStep: Record<Exclude<HintStep, "done">, string> = {
    swipe: "Swipe down for Quick Apps",
    dock: "Tap a dock icon to open an app",
    swipeLeft: "Swipe left to switch app",
    drag: "Drag the Home button to move it, Tap to go to Home",
  };

  const subtextByStep: Record<Exclude<HintStep, "done">, string> = {
    swipe: "Pull from the top area",
    dock: "Tap Contact in the bottom dock",
    swipeLeft: "Swipe left on the open window",
    drag: "Press and drag, then release to snap",
  };

  const stepClassByStep: Record<Exclude<HintStep, "done">, string> = {
    swipe: "swipe",
    dock: "dock",
    swipeLeft: "swipe-left",
    drag: "drag",
  };

  return (
    <div className={`mobile-hint-layer is-${stepClassByStep[step]}`} aria-hidden="true">
      <div className="mobile-hint-card glass-div">
        <div className="mobile-hint-content-row">
          <div>
            <p className="mobile-hint-title">{titleByStep[step]}</p>
            <p className="mobile-hint-subtext">{subtextByStep[step]}</p>
          </div>
          {step === "swipeLeft" && (
            <div className="mobile-hint-inline-arrows" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </div>
      <div className="mobile-hint-gesture">
        <span />
        <span />
      </div>
    </div>
  );
};

export default MobileOnboardingHints;
