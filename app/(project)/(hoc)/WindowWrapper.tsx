import { useWindowStore } from "@/app/(project)/(store)/window";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { ComponentType, PropsWithChildren } from "react";
import type { WindowState, WindowKey } from "@/app/(project)/(types)/windows.types";
import type { WindowStore } from "@/app/(project)/(store)/window";

type DraggableInstance = {
  kill: () => void;
  disable: () => void;
  enable: () => void;
};

/* ---------- HOC ---------- */

const WindowWrapper = <P extends object>(
  Component: ComponentType<P>,
  windowKey: WindowKey
) => {
  const Wrapped = (props: PropsWithChildren<P>) => {
    const { focusWindow, windows } = useWindowStore() as WindowStore;

    const windowState: WindowState = windows[windowKey];

    const isOpen = windowState?.isOpen ?? false;
    const isMaximized = windowState?.isMaximized ?? false;
    const zIndex = windowState?.zIndex ?? 0;

    const ref = useRef<HTMLElement | null>(null);
    const dragInstance = useRef<DraggableInstance | null>(null);

    // ✅ Per-window drag memory
    const lastPosition = useRef({ x: 0, y: 0 });

    /* ---------- DRAGGABLE ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || typeof window === "undefined") return;

      let instance: DraggableInstance | null = null;

      const init = async () => {
        const { Draggable } = await import("gsap/Draggable");
        gsap.registerPlugin(Draggable);

        const draggables = Draggable.create(el, {
          onPress: () => focusWindow(windowKey),
          bounds: window,

          onDragEnd: function () {
            lastPosition.current = {
              x: this.x,
              y: this.y
            };
          }
        });

        instance = (draggables[0] as DraggableInstance) ?? null;
        dragInstance.current = instance;
      };

      void init();

      return () => {
        instance?.kill();
        dragInstance.current = null;
      };
    }, []);

    /* ---------- ENABLE / DISABLE DRAG ---------- */
    useGSAP(() => {
      if (!dragInstance.current) return;

      if (isMaximized) {
        dragInstance.current.disable();
      } else {
        dragInstance.current.enable();
      }
    }, [isMaximized]);

    /* ---------- RESET POSITION ON MAXIMIZE ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isMaximized) return;

      gsap.set(el, {
        x: 0,
        y: 0,
        clearProps: "transform"
      });
    }, [isMaximized]);

    /* ---------- RESTORE POSITION ON MINIMIZE ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || isMaximized) return;

      const { x, y } = lastPosition.current;

      gsap.set(el, {
        x,
        y
      });
    }, [isMaximized]);

    /* ---------- OPEN ANIMATION (UNCHANGED) ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      el.style.display = "block";

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out"
        }
      );
    }, [isOpen]);

    /* ---------- SHOW / HIDE ---------- */
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className={`absolute ${isMaximized ? "window-maximized" : ""}`}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
};

export default WindowWrapper;
