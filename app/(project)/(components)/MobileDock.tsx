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

  if (!isMobile) return null;

  const activeWindowKey = dockApps.reduce<WindowKey | null>((active, app) => {
    const key = app.id as WindowKey;
    const win = windows[key];
    if (!win?.isOpen) return active;
    if (!active) return key;

    return (win.zIndex ?? 0) > (windows[active]?.zIndex ?? 0) ? key : active;
  }, null);

  const goHome = () => {
    const currentWindows = getState().windows;
    (Object.keys(currentWindows) as WindowKey[]).forEach((key) => {
      if (currentWindows[key]?.isOpen) {
        closeWindow(key);
      }
    });
  };

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

  const items: MobileDockItem[] = [
    ...dockApps.filter((app) => app.canOpen),
    { id: "home", name: "Home", icon: "iconapplewhite.png", canOpen: true }
  ];

  const isHomeActive = Object.values(windows).every((win) => !win.isOpen);

  return (
    <section id="mobile-dock">
      <div className="mobile-dock-shell">
        {items.map(({ id, name, icon, canOpen }) => {
          const isHome = id === "home";
          const isActive = isHome ? isHomeActive : activeWindowKey === (id as WindowKey);

          return (
            <button
              key={id}
              type="button"
              aria-label={name}
              className={`mobile-dock-item ${isActive ? "is-active" : ""}`}
              onClick={() => {
                closeNotificationPanel();
                if (isHome) {
                  goHome();
                } else {
                  toggleWindow(id, canOpen);
                }
              }}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className="mobile-dock-icon"
              />
              <span className="mobile-dock-label">{name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MobileDock;
