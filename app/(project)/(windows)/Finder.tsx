import WindowControls from "@/app/(project)/(components)/WindowControls";
import { Search } from "lucide-react";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import useLocationStore from "@/app/(project)/(store)/location";
import clsx from "clsx";
import { useWindowStore }from "@/app/(project)/(store)/window";
import { WindowKey } from "@/app/(project)/(types)/windows.types";
import type {
  Location,
  FolderNode,
  FileNode,
  FinderNode,
} from "@/app/(project)/(types)/location.types";

/* ------------------------------------------------------------------ */
/* Finder Component */
/* ------------------------------------------------------------------ */

type FinderProps = {
  locationsData: Record<string, Location>;
};

const Finder = ({ locationsData }: FinderProps) => {
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();

  /* ---------- Open file / folder ---------- */
  const openItem = (item: FinderNode) => {
    // Folder → navigate
    if (item.kind === "folder") {
      setActiveLocation(item);
      return;
    }

    // File handling
    const file = item as FileNode;

    if (file.fileType === "pdf") {
      const isResumeFolder = Boolean(
        activeLocation &&
        "type" in activeLocation &&
        activeLocation.type === "resume"
      );
      openWindow(isResumeFolder ? "resume" : "pdffile", file);
      return;
    }

    if (
      (file.fileType === "fig" || file.fileType === "url") &&
      file.href
    ) {
      window.open(file.href, "_blank");
      return;
    }

    // txtfile / imgfile
    const windowKey = `${file.fileType}${file.kind}` as WindowKey;
    openWindow(windowKey, file);
  };

  /* ---------- Sidebar renderer ---------- */
  const renderList = (
    title: string,
    items: Array<Location | FolderNode>
  ) => (
    <div>
      <h3 className="text-xs font-medium text-gray-400 mb-1">{title}</h3>
      <ul className="sidebar-tabs-container">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={clsx("sidebar-list-item",
              item.id === activeLocation?.id ? "active" : "not-active"
            )}
          >
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  /* ---------- Render ---------- */
  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        {/* Sidebar */}
        <div className="sidebar">
          {renderList("Favorites", Object.values(locationsData))}
          {renderList(
            "Projects",
            (locationsData.work?.children ?? []).filter(
              (item): item is FolderNode => item.kind === "folder"
            )
          )}
        </div>

        {/* Content */}
        <ul className="content">
          {activeLocation?.children.map((item) => (
            <li
              className="content-list-item"
              key={item.id}
              onClick={() => openItem(item)}
            >
              <img className="size-16 object-contain" src={item.icon} alt={item.name} />
              <p className="text-xs font-medium text-center w-full truncate">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Wrapped Window */
/* ------------------------------------------------------------------ */

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
