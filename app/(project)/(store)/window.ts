import { create } from "zustand";
import { INITIAL_WINDOWS_STATE, INITIAL_Z_INDEX } from "@/app/(project)/(content)/windowsInitial.content";
import { WindowKey, WindowState } from "@/app/(project)/(types)/windows.types";

export type WindowStore = {
  windows: Record<WindowKey, WindowState>;
  nextZIndex: number;

  openWindow: <T = unknown>(key: WindowKey, data?: T) => void;
  closeWindow: (key: WindowKey) => void;
  focusWindow: (key: WindowKey) => void;
  toggleMaximizeWindow: (key: WindowKey) => void;
};

/* ---------- Store ---------- */

export const useWindowStore = create<WindowStore>((set) => ({
  windows: INITIAL_WINDOWS_STATE,
  nextZIndex: INITIAL_Z_INDEX + 1,

  /* ---------- Open ---------- */
  openWindow: (key, data) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return state;

      const nextWindows = {
        ...state.windows,
        [key]: {
          ...win,
          isOpen: true,
          isMaximized: false,
          zIndex: state.nextZIndex,
          data: data ?? win.data
        }
      };

      return {
        windows: nextWindows,
        nextZIndex: state.nextZIndex + 1
      };
    }),

  /* ---------- Close ---------- */
  closeWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return state;

      const nextWindows = {
        ...state.windows,
        [key]: {
          ...win,
          isOpen: false,
          isMaximized: false,
          zIndex: INITIAL_Z_INDEX,
          data: null
        }
      };

      return {
        windows: nextWindows
      };
    }),

  /* ---------- Focus ---------- */
  focusWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return state;

      return {
        windows: {
          ...state.windows,
          [key]: {
            ...win,
            zIndex: state.nextZIndex
          }
        },
        nextZIndex: state.nextZIndex + 1
      };
    }),

  /* ---------- Maximize / Restore ---------- */
  toggleMaximizeWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return state;

      return {
        windows: {
          ...state.windows,
          [key]: {
            ...win,
            isMaximized: !win.isMaximized,
            zIndex: state.nextZIndex
          }
        },
        nextZIndex: state.nextZIndex + 1
      };
    }),
}));
