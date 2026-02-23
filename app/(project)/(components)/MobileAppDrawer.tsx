import { useEffect, useRef, useState } from "react";
import { dockApps } from "@/app/(project)/(content)/other.content";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import useLocationStore from "@/app/(project)/(store)/location";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";
import type { FolderNode, Location } from "@/app/(project)/(types)/location.types";

const SWIPE_CLOSE_THRESHOLD = 54;

type MobileAppDrawerProps = {
  locationsData: Record<string, Location>;
};

type AppDrawerItem =
  | {
      kind: "app";
      id: string;
      name: string;
      icon: string;
    }
  | {
      kind: "project-folder";
      id: string;
      name: string;
      icon: string;
      folder: FolderNode;
    };

const MobileAppDrawer = ({ locationsData }: MobileAppDrawerProps) => {
  const isMobile = useIsMobile();
  const { openWindow, closeWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
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

  const closeAllWindows = () => {
    const currentWindows = getState().windows;
    (Object.keys(currentWindows) as WindowKey[]).forEach((key) => {
      if (currentWindows[key]?.isOpen) {
        closeWindow(key);
      }
    });
  };

  const projectFolders = (locationsData.work?.children ?? []).filter(
    (item): item is FolderNode => item.kind === "folder"
  );

  const appItems: AppDrawerItem[] = dockApps
    .filter((app) => app.canOpen)
    .map((app) => ({
      kind: "app",
      id: app.id,
      name: app.name,
      icon: `/images/${app.icon}`,
    }));

  const projectItems: AppDrawerItem[] = projectFolders.map((folder) => ({
    kind: "project-folder",
    id: `project-${String(folder.id)}`,
    name: folder.name,
    icon: folder.icon,
    folder,
  }));

  const items: AppDrawerItem[] = [...appItems, ...projectItems];

  const openSingleWindow = (id: string) => {
    const key = id as WindowKey;
    if (!getState().windows[key]) return;

    closeAllWindows();
    openWindow(key);
    window.dispatchEvent(new Event("mobile-notification-close"));
    setIsOpen(false);
  };

  const openProjectFolder = (folder: FolderNode) => {
    closeAllWindows();
    setActiveLocation(folder);
    openWindow("finder");
    window.dispatchEvent(new Event("mobile-notification-close"));
    setIsOpen(false);
  };

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
          {items.map((item) => {
            const isActive =
              item.kind === "app"
                ? Boolean(windows[item.id as WindowKey]?.isOpen)
                : Boolean(windows.finder?.isOpen) && activeLocation?.id === item.folder.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-app-drawer-app ${isActive ? "is-active" : ""}`}
                onClick={() =>
                  item.kind === "app"
                    ? openSingleWindow(item.id)
                    : openProjectFolder(item.folder)
                }
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  loading="lazy"
                  className="mobile-app-drawer-icon"
                />
                <span className="mobile-app-drawer-label">{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MobileAppDrawer;
