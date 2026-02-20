import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { FileNode } from "@/app/(project)/(types)/location.types";
import type { ResumeContent } from "@/app/(project)/(types)/other.types";
import { Download } from "lucide-react";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";

type ResumeProps = {
  resumeContent?: ResumeContent;
};

const Resume = ({ resumeContent }: ResumeProps) => {
  const { windows } = useWindowStore();
  const isMobile = useIsMobile();

  const resumeData = windows.resume?.data as FileNode | null;
  const pdfUrl = resumeData?.href ?? resumeContent?.resumeUrl ?? "";
  const pdfName = resumeData?.name ?? resumeContent?.windowTitle ?? "Resume";

  const handleResumeDownload = async () => {
    if (!pdfUrl || typeof window === "undefined") return;

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch resume");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = pdfName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Header */}
      <div
        id="window-header" className="font-bold text-sm text-center flex-1"
      >
        <WindowControls target="resume" />
        <h2>{pdfName}</h2>

        {pdfUrl && (
          <button
            type="button"
            onClick={handleResumeDownload}
            className="cursor-pointer"
            title="Download resume"
          >
            <Download className="icon" />
          </button>
        )}
      </div>

      {/* Content */}
<div className="pr-1 flex justify-center">
  <div className="window-scroll resume-scroll mac-scrollbar
                  min-h-[40vh] min-w-xl overflow-y-auto">
    {pdfUrl && (
      <div className="h-full w-full">
        <PDFViewer
  config={{
    src: pdfUrl,
    theme: {
      preference: "light",
    },
    disabledCategories: ['annotation', 'print', 'export'],
  }}
  className="w-full h-full"
/>
      </div>
    )}
  </div>
</div>
    </>
  );
};

/* ---------- Wrapped Window ---------- */

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
