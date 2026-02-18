import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

type ReactPdfModule = typeof import("react-pdf");
/* ---------- Component ---------- */

const Resume = () => {
  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);

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

  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;

  return (
    <>

      <div id="window-header" className="font-bold text-sm text-center flex-1">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a
          href="/files/resume.pdf"
          download
          className="cursor-pointer"
          title="Download resume"
        >
          <Download className="icon" />
        </a>
      </div>
      <div className="pr-1">
  <div className="window-scroll mac-scrollbar">
    <div className="flex justify-center">
      {Document && Page && (
        <Document file="/files/resume.pdf">
          <Page
            pageNumber={1}
            renderTextLayer
            renderAnnotationLayer
          />
          <Page
            pageNumber={2}
            renderTextLayer
            renderAnnotationLayer
          />
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
