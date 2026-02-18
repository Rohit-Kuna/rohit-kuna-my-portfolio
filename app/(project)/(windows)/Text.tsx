import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import { useWindowStore } from "@/app/(project)/(store)/window";
import WindowControls from "@/app/(project)/(components)/WindowControls";
import type { FileNode } from "@/app/(project)/(types)/location.types";

/* ---------- Component ---------- */

const Text = () => {
  const { windows } = useWindowStore();

  const windowState = windows.txtfile;
  const data = windowState?.data as FileNode | null;

  if (!data || data.fileType !== "txt") return null;

  const { name, image, subtitle, description } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="pr-1">
        <div className="p-5 space-y-6 bg-white window-scroll mac-scrollbar">
          {image && (
            <div className="w-full">
              <img
                src={image}
                alt={name}
                className="w-full h-auto rounded"
              />
            </div>
          )}

          {subtitle && (
            <h3 className="text-lg font-semibold">{subtitle}</h3>
          )}

          {Array.isArray(description) && description.length > 0 && (
            <div className="space-y-3 leading-relaxed text-base text-gray-800">
              {description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ---------- Wrapped Window ---------- */

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
