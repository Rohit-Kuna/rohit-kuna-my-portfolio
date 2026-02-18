import { create } from "zustand";
import { locations } from "@/app/(project)/(content)/location.content";
import type { Location, NavigableFolder } from "@/app/(project)/(types)/location.types";

/* ---------- Defaults ---------- */

const DEFAULT_LOCATION: Location = locations.work;

/* ---------- Store Type ---------- */

type LocationStore = {
  activeLocation: NavigableFolder | null;
  setActiveLocation: (location: NavigableFolder | null) => void;
  resetActiveLocation: () => void;
};

/* ---------- Store ---------- */

const useLocationStore = create<LocationStore>((set) => ({
  activeLocation: DEFAULT_LOCATION,

  setActiveLocation: (location) =>
    set({
      activeLocation: location,
    }),

  resetActiveLocation: () =>
    set({
      activeLocation: DEFAULT_LOCATION,
    }),
}));

export default useLocationStore;
