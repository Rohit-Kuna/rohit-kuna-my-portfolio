import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Search,
  ShieldHalf,
  Share,
  Plus,
  Copy,
  Newspaper,
  MoveRight
} from "lucide-react";
import type { BlogPost } from "@/app/(project)/(types)/other.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";

/* ---------- Component ---------- */

type SafariProps = {
  blogPosts: BlogPost[];
};

const Safari = ({ blogPosts }: SafariProps) => {
  const isMobile = useIsMobile();
  const isFullscreen = useWindowStore((state) => state.windows.safari.isMaximized);
  const useFullscreenLayout = isFullscreen || isMobile;
  const fullscreenContentStyle = useFullscreenLayout
    ? { height: "calc(100dvh - 56px - var(--compact-dock-space))" }
    : undefined;

  return (
    <>
      {/* ---------- Window Header ---------- */}
      <div id="window-header" className="flex items-center gap-3 px-4 py-2">
        <WindowControls target="safari" />

        {!isMobile && <PanelLeft className="ml-6 icon" />}

        <div className={`flex items-center gap-1 ${isMobile ? "" : "ml-4"}`}>
            <ChevronLeft className="icon" />
            <ChevronRight className="icon" />
          </div>

        <div className={`flex-1 flex items-center ${isMobile ? "justify-start gap-1" : "justify-center gap-3"}`}>
          {!isMobile && <ShieldHalf className="icon" />}

          <div className="search">
            <Search className="w-4 h-4 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder={isMobile ? "Search..." : "Search or enter website name"}
              className="search-input-box"
            />
          </div>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-4">
            <Share className="icon" />
            <Plus className="icon" />
            <Copy className="icon" />
          </div>
        )}
      </div>

      {/* ---------- Scroll Area ---------- */}
      <div
        className={`pr-1 ${useFullscreenLayout ? "safari-content-shell overflow-hidden" : ""}`}
        style={fullscreenContentStyle}
      >
        <div
          className={`px-10 py-4 overflow-y-auto mac-scrollbar ${
            useFullscreenLayout ? "safari-scroll-fullscreen h-full" : "max-h-[60vh]"
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            My Articles
          </h2>

          <hr className="border-gray-200 mb-6" />

          {/* ---------- Article List ---------- */}
          <div className="articles-list">
            {blogPosts.map(({ id, title, date, link, postImage }) => (
              <div
                key={id}
                className="article-row"
              >
                {postImage ? (
                  <img
                    src={postImage}
                    alt={title}
                    loading="lazy"
                    className="w-8 h-8 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <Newspaper className="w-8 h-8 shrink-0 text-blue-500" />
                )}

                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {title}
                    </h3>
                    <span className="text-sm text-gray-400">{date}</span>
                  </a>
                </div>

                {!isMobile && (
                  <MoveRight
                    className="
                      ml-auto
                      w-4 h-4 shrink-0
                      text-gray-400
                      transition-colors duration-150
                      group-hover:text-gray-600
                    "
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------- Wrapped Window ---------- */
const SafariWindow = WindowWrapper(Safari, "safari");
export default SafariWindow;
