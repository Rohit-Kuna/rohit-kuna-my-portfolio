import WindowControls from "@/app/(project)/(components)/WindowControls";
import { blogPosts } from "@/app/(project)/(content)/other.content";
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
  MoveRight
} from "lucide-react";

/* ---------- Component ---------- */

const Safari = () => {
  return (
    <>
      {/* ---------- Window Header ---------- */}
      <div id="window-header" className="flex items-center gap-3 px-4 py-2">
        <WindowControls target="safari" />

        <PanelLeft className="ml-6 icon" />

        <div className="flex items-center gap-1 ml-4">
          <ChevronLeft className="icon" />
          <ChevronRight className="icon" />
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">
          <ShieldHalf className="icon" />

          <div className="search">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search or enter website name"
              className="search-input-box"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Share className="icon" />
          <Plus className="icon" />
          <Copy className="icon" />
        </div>
      </div>

      {/* ---------- Scroll Area ---------- */}
      <div className="pr-1">
        <div className="px-10 py-4 max-h-[60vh] overflow-y-auto mac-scrollbar">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            My Articles
          </h2>

          <hr className="border-gray-200 mb-6" />

          {/* ---------- Article List ---------- */}
          <div className="articles-list">
            {blogPosts.map(({ id, icon: Icon, title, date, link }) => (
              <div
                key={id}
                className="article-row"
              >
                <Icon className="w-8 h-8 shrink-0 text-blue-500" />

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

                <MoveRight
                  className="
                    ml-auto
                    w-4 h-4 shrink-0
                    text-gray-400
                    transition-colors duration-150
                    group-hover:text-gray-600
                  "
                />
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
