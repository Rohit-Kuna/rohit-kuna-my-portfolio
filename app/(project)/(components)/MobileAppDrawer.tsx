import { useEffect, useRef, useState } from "react";
import { dockApps } from "@/app/(project)/(content)/other.content";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";

const SWIPE_CLOSE_THRESHOLD = 54;

const MobileAppDrawer = () => {
  const isMobile = useIsMobile();
  const { openWindow, closeWindow } = useWindowStore();
  const windows = useWindowStore((state) => state.windows);
  const getState = useWindowStore.getState;

  const [isOpen, setIsOpen] = useState(false);

  const startY = useRef(0);
  const startX = useRef(0);
  const isTrackingCloseSwipe = useRef(false);

  useEffect(() => {
    if (!isMobile) return;

    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);
    const onNotificationOpened = () => setIsOpen(false);

    window.addEventListener("mobile-app-drawer-open", openDrawer);
    window.addEventListener("mobile-app-drawer-close", closeDrawer);
    window.addEventListener("mobile-notification-opened", onNotificationOpened);

    return () => {
      window.removeEventListener("mobile-app-drawer-open", openDrawer);
      window.removeEventListener("mobile-app-drawer-close", closeDrawer);
      window.removeEventListener("mobile-notification-opened", onNotificationOpened);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const root = document.documentElement;
    root.classList.toggle("mobile-app-drawer-open", isOpen);

    return () => {
      root.classList.remove("mobile-app-drawer-open");
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile) return;
    if (!isOpen) return;

    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("#mobile-app-drawer")) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      startY.current = touch.clientY;
      startX.current = touch.clientX;
      isTrackingCloseSwipe.current = true;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!isTrackingCloseSwipe.current) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - startY.current;
      const deltaX = Math.abs(touch.clientX - startX.current);

      if (deltaY > SWIPE_CLOSE_THRESHOLD && deltaX < 70) {
        setIsOpen(false);
      }

      isTrackingCloseSwipe.current = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, isOpen]);

  if (!isMobile) return null;

  const toggleWindow = (id: string) => {
    const key = id as WindowKey;
    const win = getState().windows[key];
    if (!win) return;

    if (win.isOpen) {
      closeWindow(key);
    } else {
      openWindow(key);
    }

    window.dispatchEvent(new Event("mobile-notification-close"));
    setIsOpen(false);
  };

  const items = dockApps.filter((app) => app.canOpen);

  return (
    <>
      <button
        type="button"
        aria-label="Close app drawer"
        className={`mobile-app-drawer-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <section id="mobile-app-drawer" className={isOpen ? "is-open" : ""} aria-hidden={!isOpen}>
        <div className="mobile-grab-handle mobile-app-drawer-handle" />
        <p className="mobile-app-drawer-title">App Drawer</p>

        <div className="mobile-app-drawer-grid">
          {items.map(({ id, name, icon }) => {
            const key = id as WindowKey;
            const isActive = Boolean(windows[key]?.isOpen);

            return (
              <button
                key={id}
                type="button"
                className={`mobile-app-drawer-app ${isActive ? "is-active" : ""}`}
                onClick={() => toggleWindow(id)}
              >
                <img src={`/images/${icon}`} alt={name} loading="lazy" className="mobile-app-drawer-icon" />
                <span className="mobile-app-drawer-label">{name}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MobileAppDrawer;
