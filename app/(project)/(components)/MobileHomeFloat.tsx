import { useEffect, useState } from "react";
import type { PointerEventHandler } from "react";
import { HomeButtonIcon } from "@/app/(project)/(components)/HomeButton";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";

const BUTTON_SIZE = 52;
const SCREEN_MARGIN = 10;
const TOP_BOUNDARY = 52;
const INITIAL_BOTTOM_RESERVE = 132;
const DRAG_BOTTOM_RESERVE_FALLBACK = 92;
const DOCK_CLEARANCE = 8;
const DRAG_THRESHOLD = 6;

type Position = { x: number; y: number };

const getMaxYAboveDock = (): number => {
  if (typeof window === "undefined") return TOP_BOUNDARY;

  const dock = document.getElementById("mobile-dock");
  if (!dock) {
    return Math.max(
      TOP_BOUNDARY,
      window.innerHeight - BUTTON_SIZE - DRAG_BOTTOM_RESERVE_FALLBACK
    );
  }

  const dockTop = dock.getBoundingClientRect().top;
  return Math.max(TOP_BOUNDARY, dockTop - BUTTON_SIZE - DOCK_CLEARANCE);
};

const getInitialPosition = (): Position => {
  if (typeof window === "undefined") {
    return { x: SCREEN_MARGIN, y: TOP_BOUNDARY };
  }

  const maxX = Math.max(SCREEN_MARGIN, window.innerWidth - BUTTON_SIZE - SCREEN_MARGIN);
  const maxY = Math.max(
    TOP_BOUNDARY,
    window.innerHeight - BUTTON_SIZE - INITIAL_BOTTOM_RESERVE
  );

  return {
    x: maxX,
    y: maxY,
  };
};

const MobileHomeFloat = () => {
  const isMobile = useIsMobile();
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const getState = useWindowStore.getState;
  const [position, setPosition] = useState<Position>(getInitialPosition);

  useEffect(() => {
    if (!isMobile || typeof window === "undefined") return;

    const onResize = () => {
      const maxX = Math.max(SCREEN_MARGIN, window.innerWidth - BUTTON_SIZE - SCREEN_MARGIN);
      const maxY = getMaxYAboveDock();

      setPosition((prev) => ({
        x: prev.x <= window.innerWidth / 2 ? SCREEN_MARGIN : maxX,
        y: Math.min(Math.max(prev.y, TOP_BOUNDARY), maxY),
      }));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  const goHome = () => {
    const currentWindows = getState().windows;
    (Object.keys(currentWindows) as WindowKey[]).forEach((key) => {
      if (currentWindows[key]?.isOpen) closeWindow(key);
    });
    window.dispatchEvent(new Event("mobile-notification-close"));
  };

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = (event) => {
    if (!isMobile || typeof window === "undefined") return;

    const startPointerX = event.clientX;
    const startPointerY = event.clientY;
    const startX = position.x;
    const startY = position.y;
    let moved = false;

    const clampPosition = (nextX: number, nextY: number): Position => {
      const maxX = Math.max(SCREEN_MARGIN, window.innerWidth - BUTTON_SIZE - SCREEN_MARGIN);
      const maxY = getMaxYAboveDock();

      return {
        x: Math.min(Math.max(nextX, SCREEN_MARGIN), maxX),
        y: Math.min(Math.max(nextY, TOP_BOUNDARY), maxY),
      };
    };

    event.currentTarget.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startPointerX;
      const dy = moveEvent.clientY - startPointerY;

      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        moved = true;
      }

      if (!moved) return;
      setPosition(clampPosition(startX + dx, startY + dy));
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      if (!moved) {
        goHome();
        return;
      }

      setPosition((prev) => {
        const maxX = Math.max(SCREEN_MARGIN, window.innerWidth - BUTTON_SIZE - SCREEN_MARGIN);
        const snapLeft = prev.x + BUTTON_SIZE / 2 < window.innerWidth / 2;
        return { ...prev, x: snapLeft ? SCREEN_MARGIN : maxX };
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  if (!isMobile) return null;

  return (
    <button
      type="button"
      aria-label="Go to Home screen"
      id="mobile-home-float"
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <span className="mobile-home-float-icon">
        <HomeButtonIcon size={38} outerColor="#ffffff" innerColor="#ffffff" />
      </span>
    </button>
  );
};

export default MobileHomeFloat;
