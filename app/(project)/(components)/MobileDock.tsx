import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { dockApps } from "@/app/(project)/(content)/other.content";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";

type MobileDockItem = {
  id: string;
  name: string;
  icon: string;
  canOpen: boolean;
};

const MobileDock = () => {
  const isMobile = useIsMobile();
  const { openWindow, closeWindow } = useWindowStore();
  const windows = useWindowStore((state) => state.windows);
  const getState = useWindowStore.getState;
  const [showAppHintTap, setShowAppHintTap] = useState(false);
  const swipeStartY = useRef(0);
  const swipeStartX = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    const onHintDockStart = () => setShowAppHintTap(true);
    const onHintDockEnd = () => setShowAppHintTap(false);
    const onAnyDockTap = () => setShowAppHintTap(false);

    window.addEventListener("mobile-hint-dock-start", onHintDockStart);
    window.addEventListener("mobile-hint-dock-end", onHintDockEnd);
    window.addEventListener("mobile-dock-icon-tap", onAnyDockTap);

    return () => {
      window.removeEventListener("mobile-hint-dock-start", onHintDockStart);
      window.removeEventListener("mobile-hint-dock-end", onHintDockEnd);
      window.removeEventListener("mobile-dock-icon-tap", onAnyDockTap);
    };
  }, [isMobile]);

  if (!isMobile) return null;

  const activeWindowKey = dockApps.reduce<WindowKey | null>((active, app) => {
    const key = app.id as WindowKey;
    const win = windows[key];
    if (!win?.isOpen) return active;
    if (!active) return key;

    return (win.zIndex ?? 0) > (windows[active]?.zIndex ?? 0) ? key : active;
  }, null);

  const toggleWindow = (id: string, canOpen: boolean) => {
    if (!canOpen) return;

    const key = id as WindowKey;
    const win = getState().windows[key];
    if (!win) return;

    if (win.isOpen) {
      closeWindow(key);
    } else {
      openWindow(key);
    }
  };

  const closeNotificationPanel = () => {
    window.dispatchEvent(new Event("mobile-notification-close"));
    window.dispatchEvent(new Event("mobile-app-drawer-close"));
  };

  const onDockTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    swipeStartY.current = touch.clientY;
    swipeStartX.current = touch.clientX;
  };

  const onDockTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaY = touch.clientY - swipeStartY.current;
    const deltaX = Math.abs(touch.clientX - swipeStartX.current);

    if (deltaY < -42 && deltaX < 72) {
      closeNotificationPanel();
      window.dispatchEvent(new Event("mobile-app-drawer-open"));
    }
  };

  const items: MobileDockItem[] = dockApps.filter((app) => app.canOpen);

  return (
    <section id="mobile-dock" onTouchStart={onDockTouchStart} onTouchEnd={onDockTouchEnd}>
      <div className="mobile-dock-shell">
        <div className="mobile-grab-handle mobile-dock-handle" aria-hidden="true" />
        {items.map(({ id, name, icon, canOpen }) => {
          const isActive = activeWindowKey === (id as WindowKey);

          return (
            <button
              key={id}
              type="button"
              aria-label={name}
              className={`mobile-dock-item ${isActive ? "is-active" : ""} ${showAppHintTap && id === "contact" ? "is-hint-app-tap" : ""}`}
              onClick={() => {
                window.dispatchEvent(new Event("mobile-dock-icon-tap"));
                closeNotificationPanel();
                toggleWindow(id, canOpen);
              }}
            >
              <div className="mobile-dock-icon-wrap">
                <img
                  src={`/images/${icon}`}
                  alt={name}
                  loading="lazy"
                  className="mobile-dock-icon"
                />
              </div>
              <span className="mobile-dock-label">{name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MobileDock;
