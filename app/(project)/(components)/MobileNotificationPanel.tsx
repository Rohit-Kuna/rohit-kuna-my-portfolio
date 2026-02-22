import { useEffect, useRef, useState } from "react";
import { dockApps } from "@/app/(project)/(content)/other.content";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { DockApp, MusicTrack } from "@/app/(project)/(types)/other.types";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { HomeButtonIcon } from "@/app/(project)/(components)/HomeButton";
import NowPlayingBar from "@/app/(project)/(components)/NowPlayingBar";

const TOP_PULL_ZONE_RATIO = 0.30;
const OPEN_THRESHOLD = 70;
const CLOSE_THRESHOLD = 60;
const MAX_PULL = 120;
const MOBILE_NOTIFICATION_WHITE_ICONS: Record<string, string> = {
  finder: "finder-white.png",
  safari: "safari-white.png",
  resume: "notes-icon-white.png",
  contact: "contact-white.png",
  terminal: "terminal-white.png",
};

type GestureMode = "open" | "close" | null;
type QuickAppItem = {
  id: string;
  name: string;
  icon?: string;
  canOpen: boolean;
};

type MobileNotificationPanelProps = {
  musicTracks?: MusicTrack[];
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

const MobileNotificationPanel = ({ musicTracks = [] }: MobileNotificationPanelProps) => {
  const isMobile = useIsMobile();
  const { openWindow, closeWindow } = useWindowStore();
  const windows = useWindowStore((state) => state.windows);
  const getState = useWindowStore.getState;

  const [isOpen, setIsOpen] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startY = useRef(0);
  const startX = useRef(0);
  const gestureMode = useRef<GestureMode>(null);
  const isHomeDragActive = useRef(false);

  useEffect(() => {
    if (!isMobile) return;

    const isDrawerOpen = () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("mobile-app-drawer-open");

    const onHomeDragStart = () => {
      isHomeDragActive.current = true;
      gestureMode.current = null;
      setPullOffset(0);
    };
    const onHomeDragEnd = () => {
      isHomeDragActive.current = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (isHomeDragActive.current) return;
      if (isDrawerOpen()) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("#mobile-home-float")) return;

      startY.current = touch.clientY;
      startX.current = touch.clientX;
      gestureMode.current = null;

      const topPullZone =
        typeof window !== "undefined"
          ? window.innerHeight * TOP_PULL_ZONE_RATIO
          : 0;

      if (!isOpen && touch.clientY <= topPullZone) {
        gestureMode.current = "open";
      } else if (isOpen) {
        gestureMode.current = "close";
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (isHomeDragActive.current) return;
      if (!gestureMode.current) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - startY.current;
      const deltaX = Math.abs(touch.clientX - startX.current);

      if (deltaX > 80) {
        setPullOffset(0);
        return;
      }

      if (gestureMode.current === "open" && deltaY > 0) {
        setPullOffset(Math.min(deltaY, MAX_PULL));
      }

      if (gestureMode.current === "close" && deltaY < 0) {
        setPullOffset(Math.max(deltaY, -MAX_PULL));
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isHomeDragActive.current) return;
      if (!gestureMode.current) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - startY.current;

      if (gestureMode.current === "open" && deltaY > OPEN_THRESHOLD) {
        setIsOpen(true);
        window.dispatchEvent(new Event("mobile-notification-opened"));
      }

      if (gestureMode.current === "close" && Math.abs(deltaY) > CLOSE_THRESHOLD && deltaY < 0) {
        setIsOpen(false);
      }

      gestureMode.current = null;
      setPullOffset(0);
    };

    window.addEventListener("mobile-home-drag-start", onHomeDragStart);
    window.addEventListener("mobile-home-drag-end", onHomeDragEnd);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("mobile-home-drag-start", onHomeDragStart);
      window.removeEventListener("mobile-home-drag-end", onHomeDragEnd);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile) return;

    const closePanel = () => setIsOpen(false);
    window.addEventListener("mobile-notification-close", closePanel);

    return () => {
      window.removeEventListener("mobile-notification-close", closePanel);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || typeof document === "undefined") return;

    const doc = document as FullscreenDocument;
    const updateFullscreenState = () => {
      setIsFullscreen(
        Boolean(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        )
      );
    };

    updateFullscreenState();
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState as EventListener);
    document.addEventListener("mozfullscreenchange", updateFullscreenState as EventListener);
    document.addEventListener("MSFullscreenChange", updateFullscreenState as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState as EventListener);
      document.removeEventListener("mozfullscreenchange", updateFullscreenState as EventListener);
      document.removeEventListener("MSFullscreenChange", updateFullscreenState as EventListener);
    };
  }, [isMobile]);

  const toggleApp = (app: Pick<DockApp, "id" | "canOpen">) => {
    if (!app.canOpen) return;

    const windowKey = app.id as WindowKey;
    const windowState = getState().windows[windowKey];
    if (!windowState) return;

    if (windowState.isOpen) {
      closeWindow(windowKey);
    } else {
      openWindow(windowKey);
    }
    setIsOpen(false);
  };

  const goHome = () => {
    const currentWindows = getState().windows;
    (Object.keys(currentWindows) as WindowKey[]).forEach((key) => {
      if (currentWindows[key]?.isOpen) {
        closeWindow(key);
      }
    });
    setIsOpen(false);
  };

  const handleFullscreenToggle = async () => {
    if (typeof document === "undefined") return;

    const doc = document as FullscreenDocument;
    const rootEl = document.documentElement as FullscreenElement;

    try {
      if (isFullscreen) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      } else if (rootEl.requestFullscreen) {
        await rootEl.requestFullscreen();
      } else if (rootEl.webkitRequestFullscreen) {
        await rootEl.webkitRequestFullscreen();
      } else if (rootEl.mozRequestFullScreen) {
        await rootEl.mozRequestFullScreen();
      } else if (rootEl.msRequestFullscreen) {
        await rootEl.msRequestFullscreen();
      }
    } catch {
      // Ignore browser policy/support failures and keep UI responsive.
    } finally {
      setIsOpen(false);
    }
  };

  const handleShowTour = () => {
    goHome();
    window.dispatchEvent(new Event("mobile-home-reset-position"));
    window.setTimeout(() => {
      window.dispatchEvent(new Event("mobile-show-tour"));
    }, 120);
  };

  const quickApps: QuickAppItem[] = [
    ...dockApps.filter((app) => app.canOpen),
    {
      id: "home",
      name: "Home",
      canOpen: true
    }
  ];

  if (!isMobile) return null;

  const resolveNotificationIcon = (id: string, fallbackIcon?: string) =>
    MOBILE_NOTIFICATION_WHITE_ICONS[id] ?? fallbackIcon ?? "";

  const openPullProgress = Math.max(0, Math.min(pullOffset, MAX_PULL)) / MAX_PULL;
  const closePullProgress = Math.max(0, Math.min(Math.abs(pullOffset), MAX_PULL)) / MAX_PULL;
  const stretchY = isOpen ? 1 - closePullProgress * 0.06 : 1 + openPullProgress * 0.15;
  const stretchX = isOpen ? 1 + closePullProgress * 0.03 : 1 - openPullProgress * 0.06;
  const panelTranslate = isOpen
    ? `translateY(${pullOffset}px)`
    : `translateY(calc(-100% + ${pullOffset}px))`;

  return (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        className={`mobile-notif-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <section
        id="mobile-notification-panel"
        className={isOpen ? "is-open" : ""}
        style={{
          transform: `${panelTranslate} scaleX(${stretchX}) scaleY(${stretchY})`,
          transition: isOpen
            ? "transform 460ms cubic-bezier(0.22, 1.22, 0.22, 1)"
            : "transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1)"
        }}
      >
        <div className="mobile-notif-handle" />
        <div className="mobile-notif-content">
          <div className="mobile-notif-title-row">
            <button
              type="button"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="mobile-notif-quick-icon-btn is-left"
              onClick={() => {
                void handleFullscreenToggle();
              }}
            >
              <img
                src={isFullscreen ? "/images/exit-fullscreen.png" : "/images/enter-fullscreen.png"}
                alt=""
                aria-hidden="true"
                className="mobile-notif-quick-icon"
              />
            </button>
            <p className="mobile-notif-title">Quick Apps</p>
            <button
              type="button"
              aria-label="Show Tour"
              className="mobile-notif-quick-icon-btn is-right"
              onClick={handleShowTour}
            >
              <img
                src="/images/show-tour.png"
                alt=""
                aria-hidden="true"
                className="mobile-notif-quick-icon"
              />
            </button>
          </div>

          <NowPlayingBar tracks={musicTracks} />

          <div className="mobile-notif-grid">
            {quickApps.map(({ id, name, icon }) => {
              const isHome = id === "home";
              const key = id as WindowKey;
              const isActive = isHome
                ? (Object.values(windows).every((win) => !win.isOpen))
                : Boolean(windows[key]?.isOpen);

              return (
                <button
                  key={id}
                  type="button"
                  className={`mobile-notif-item ${isActive ? "is-active" : ""}`}
                  onClick={() => (isHome ? goHome() : toggleApp({ id, canOpen: true }))}
                >
                  {isHome ? (
                    <HomeButtonIcon size={38} outerColor="#ffffff" innerColor="#ffffff" />
                  ) : (
                    <img
                      src={`/images/${resolveNotificationIcon(id, icon)}`}
                      alt={name}
                      loading="lazy"
                      className="mobile-notif-icon"
                    />
                  )}
                  <span className="mobile-notif-label">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default MobileNotificationPanel;
