import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "@/app/(project)/(content)/other.content";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";
import type { DockApp } from "@/app/(project)/(types)/other.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

const Dock = () => {
  const { openWindow, closeWindow } = useWindowStore();
  const windows = useWindowStore((state) => state.windows);
  const getState = useWindowStore.getState;
  const isMobile = useIsMobile();

  const dockRef = useRef<HTMLDivElement | null>(null);

  /* ---------- GSAP Hover Animation ---------- */
  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock || isMobile) return;

    const icons = dock.querySelectorAll<HTMLButtonElement>(".dock-icon");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out"
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out"
        })
      );
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, [isMobile]);

  /* ---------- Window Toggle ---------- */
  const toggleApp = (app: Pick<DockApp, "id" | "canOpen">) => {
    if (!app.canOpen) return;

    const windows = getState().windows;
    const windowKey = app.id as WindowKey;
    const window = windows[windowKey];

    if (!window) {
      console.error(`Window not found for app: ${app.id}`);
      return;
    }

    window.isOpen ? closeWindow(windowKey) : openWindow(windowKey);
  };

  const activeWindowKey = dockApps.reduce<WindowKey | null>((active, app) => {
    const key = app.id as WindowKey;
    const win = windows[key];
    if (!win?.isOpen) return active;

    if (!active) return key;

    return (win.zIndex ?? 0) > (windows[active]?.zIndex ?? 0) ? key : active;
  }, null);

  const isAnyDesktopWindowFullscreen = !isMobile && Object.values(windows).some(
    (win) => win.isOpen && win.isMaximized
  );

  if (isAnyDesktopWindowFullscreen) return null;

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className={`dock-icon ${activeWindowKey === (id as WindowKey) ? "dock-icon-active" : ""}`}
              data-app={id}
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className="object-cover object-center"
              />
            </button>
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
