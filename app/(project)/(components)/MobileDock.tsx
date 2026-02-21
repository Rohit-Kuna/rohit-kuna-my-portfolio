import { useEffect, useState } from "react";
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
  const [showContactHintTap, setShowContactHintTap] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const onHintDockStart = () => setShowContactHintTap(true);
    const onHintDockEnd = () => setShowContactHintTap(false);
    const onAnyDockTap = () => setShowContactHintTap(false);

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
  };

  const items: MobileDockItem[] = dockApps.filter((app) => app.canOpen);

  return (
    <section id="mobile-dock">
      <div className="mobile-dock-shell">
        {items.map(({ id, name, icon, canOpen }) => {
          const isActive = activeWindowKey === (id as WindowKey);

          return (
            <button
              key={id}
              type="button"
              aria-label={name}
              className={`mobile-dock-item ${isActive ? "is-active" : ""} ${showContactHintTap && id === "contact" ? "is-hint-contact" : ""}`}
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
