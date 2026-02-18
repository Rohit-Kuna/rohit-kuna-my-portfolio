import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
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
  const resumeData = windows.resume?.data as FileNode | null;
  const pdfUrl = resumeData?.href ?? resumeContent?.resumeUrl ?? "";
  const pdfName = resumeData?.name ?? resumeContent?.windowTitle ?? "";

  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [numPages, setNumPages] = useState(0);

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

  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;

  return (
    <>

      <div id="window-header" className="font-bold text-sm text-center flex-1">
        <WindowControls target="resume" />
        <h2>{pdfName}</h2>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download
            className="cursor-pointer"
            title="Download resume"
          >
            <Download className="icon" />
          </a>
        )}
      </div>
      <div className="pr-1">
  <div className="window-scroll mac-scrollbar">
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
