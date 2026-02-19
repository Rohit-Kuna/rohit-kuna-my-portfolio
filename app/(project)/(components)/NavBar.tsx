import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "@/app/(project)/(content)/other.content";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { WindowKey } from "@/app/(project)/(types)/windows.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

const Navbar = () => {
  const { openWindow, closeWindow } = useWindowStore();
  const getState = useWindowStore.getState;
  const isMobile = useIsMobile();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const intervalId = window.setInterval(updateNow, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const toggleWindow = (key: WindowKey) => {
    const window = getState().windows[key];
    if (!window) return;

    window.isOpen
      ? closeWindow(key)
      : openWindow(key);
  };

  const visibleNavIcons = isMobile
    ? navIcons.filter(({ id }) => id !== 3)
    : navIcons;

  return (
    <nav>
      <div>
        <img src="/images/iconapplewhite.png" className="w-8 h-8 p-2 left-0.5" alt="logo" />
        <p className="font-semibold text-white max-sm:hidden">{isMobile ? "Portfolio" : "Rohit's Portfolio"}</p>

        <ul className="nav-links flex items-center gap-2">
          {navLinks.map(({ id, name, type}) => (
            <li
              key={id}
              onClick={() => toggleWindow(type as WindowKey)}
              aria-label={name}
              className="relative flex items-center justify-center cursor-pointer"
            >
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        <ul className="nav-icons flex items-center gap-2">
          {visibleNavIcons.map(({ id, icon: Icon }) => (
            <li
              key={id}
              className="relative flex items-center justify-center w-8 h-8"
            >
              <Icon size={14} strokeWidth={2.7} />
            </li>
          ))}
        </ul>

        <time className="time-format" dateTime={now ? now.toISOString() : undefined}>
          {now ? dayjs(now).format("ddd MMM D h:mm A") : ""}
        </time>
      </div>
    </nav>
  );
};

export default Navbar;
