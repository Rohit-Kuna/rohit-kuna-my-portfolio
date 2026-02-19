import {useWindowStore} from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

/* ---------- Props ---------- */

type WindowControlsProps = {
  target: WindowKey;
};

/* ---------- Component ---------- */

const WindowControls = ({ target }: WindowControlsProps) => {
  const { closeWindow, toggleMaximizeWindow } = useWindowStore();
  const isMobile = useIsMobile();

  return (
    <div id="window-controls">
      <button
        type="button"
        className="close"
        onClick={(event) => {
          event.stopPropagation();
          closeWindow(target);
        }}
        role="button"
        aria-label="Close window"
      />

      {!isMobile && (
        <div className="minimize" />
      )}

      {!isMobile && (
        <div
          className="maximize"
          onClick={() => toggleMaximizeWindow(target)}
          role="button"
          aria-label="Maximize window"
        />
      )}
    </div>
  );
};

export default WindowControls;
