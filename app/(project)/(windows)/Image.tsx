import WindowControls from "@/app/(project)/(components)/WindowControls";
import { useWindowStore } from "@/app/(project)/(store)/window";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import type { FileNode } from "@/app/(project)/(types)/location.types";

/* ---------- Component ---------- */

const Image = () => {
  const { windows } = useWindowStore();

  const windowState = windows.imgfile;
  const data = windowState?.data as FileNode | null;

  if (!data || data.fileType !== "img") return null;

  const { name, imageUrl } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div>
        {imageUrl && (
          <div className="p-2 bg-gray-200 flex justify-center items-center">
            <img
              src={imageUrl}
              alt={name}
              className="max-h-[70vh] w-auto object-contain object-center rounded"
            />
          </div>
        )}
      </div>
    </>
  );
};

/* ---------- Wrapped Window ---------- */

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
