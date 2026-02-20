import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { FileNode } from "@/app/(project)/(types)/location.types";
import type { ResumeContent } from "@/app/(project)/(types)/other.types";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

type ReactPdfModule = typeof import("react-pdf");
/* ---------- Component ---------- */

type ResumeProps = {
  resumeContent?: ResumeContent;
};

const Resume = ({ resumeContent }: ResumeProps) => {
  const { windows } = useWindowStore();
  const isMobile = useIsMobile();
  const resumeData = windows.resume?.data as FileNode | null;
  const pdfUrl = resumeData?.href ?? resumeContent?.resumeUrl ?? "";
  const pdfName = resumeData?.name ?? resumeContent?.windowTitle ?? "";

  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [mobilePageWidth, setMobilePageWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const loadPdf = async () => {
      const mod = await import("react-pdf");

      mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      if (mounted) {
        setPdfModule(mod);
      }
    };

    void loadPdf();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setNumPages(0);
  }, [pdfUrl]);

  useEffect(() => {
    if (!isMobile || typeof window === "undefined") {
      setMobilePageWidth(undefined);
      return;
    }

    const updatePageWidth = () => {
      const width = Math.floor(window.innerWidth - 20);
      setMobilePageWidth(Math.max(240, width));
    };

    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);

    return () => window.removeEventListener("resize", updatePageWidth);
  }, [isMobile]);

  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;
  const handleResumeDownload = async () => {
    if (!pdfUrl || typeof window === "undefined") return;

    window.open(pdfUrl, "_blank", "noopener,noreferrer");

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch resume");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = pdfName || "resume.pdf";
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: still trigger a download without leaving the current tab.
      const fallbackLink = document.createElement("a");
      fallbackLink.href = pdfUrl;
      fallbackLink.download = pdfName || "resume.pdf";
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.style.display = "none";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  return (
    <>

      <div id="window-header" className="font-bold text-sm text-center flex-1">
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
      <div className="pr-1">
  <div className="window-scroll resume-scroll mac-scrollbar">
    <div className="flex justify-center">
      {pdfUrl && Document && Page && (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages: totalPages }: { numPages: number }) =>
            setNumPages(totalPages)
          }
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`${pdfUrl}-${index + 1}`}
              pageNumber={index + 1}
              width={mobilePageWidth}
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      )}
    </div>
  </div>
</div>

    </>
  );
};

/* ---------- Wrapped Window ---------- */

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
