import {useWindowStore} from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";

/* ---------- Props ---------- */

type WindowControlsProps = {
  target: WindowKey;
};

/* ---------- Component ---------- */

const WindowControls = ({ target }: WindowControlsProps) => {
  const { closeWindow, toggleMaximizeWindow } = useWindowStore();

  return (
    <div id="window-controls">
      <div
        className="close"
        onClick={() => closeWindow(target)}
        role="button"
        aria-label="Close window"
      />

      <div className="minimize" />

      <div
        className="maximize"
        onClick={() => toggleMaximizeWindow(target)}
        role="button"
        aria-label="Maximize window"
      />
    </div>
  );
};

export default WindowControls;
