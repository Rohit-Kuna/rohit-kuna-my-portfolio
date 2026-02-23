import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { FileNode } from "@/app/(project)/(types)/location.types";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type ReactPdfModule = typeof import("react-pdf");

const MIN_MOBILE_ZOOM = 1;
const DOUBLE_TAP_ZOOM = 2;
const DOUBLE_TAP_DELAY_MS = 260;

const PdfFile = () => {
  const { windows } = useWindowStore();
  const isMobile = useIsMobile();
  const pdfData = windows.pdffile?.data as FileNode | null;
  const pdfUrl = pdfData?.href ?? "";
  const pdfName = pdfData?.name ?? "";

  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [mobilePageWidth, setMobilePageWidth] = useState<number | undefined>(undefined);
  const [mobileZoom, setMobileZoom] = useState(1);
  const [supportsTouchZoom, setSupportsTouchZoom] = useState(false);
  const zoomContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTapAtRef = useRef(0);

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
    setMobileZoom(1);
  }, [pdfUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setSupportsTouchZoom(hasTouchPoints || hasCoarsePointer);
  }, []);

  const enableTouchZoom = isMobile || supportsTouchZoom;

  useEffect(() => {
    if (!enableTouchZoom || typeof window === "undefined") {
      setMobilePageWidth(undefined);
      setMobileZoom(1);
      return;
    }

    const updatePageWidth = () => {
      const width = Math.floor(window.innerWidth - 20);
      setMobilePageWidth(Math.max(240, width));
    };

    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);

    return () => window.removeEventListener("resize", updatePageWidth);
  }, [enableTouchZoom]);

  useEffect(() => {
    if (!enableTouchZoom) return;

    const container = zoomContainerRef.current;
    if (!container) return;

    const onTouchEnd = (event: TouchEvent) => {
      if (event.changedTouches.length !== 1) return;
      const now = Date.now();
      if (now - lastTapAtRef.current <= DOUBLE_TAP_DELAY_MS) {
        setMobileZoom((prev) => (prev > MIN_MOBILE_ZOOM ? MIN_MOBILE_ZOOM : DOUBLE_TAP_ZOOM));
        lastTapAtRef.current = 0;
        return;
      }

      lastTapAtRef.current = now;
    };

    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enableTouchZoom]);

  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;
  const effectivePageWidth = enableTouchZoom && mobilePageWidth
    ? Math.floor(mobilePageWidth * mobileZoom)
    : mobilePageWidth;

  const handlePdfDownload = async () => {
    if (!pdfUrl || typeof window === "undefined") return;

    window.open(pdfUrl, "_blank", "noopener,noreferrer");

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = pdfName || "file.pdf";
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(objectUrl);
    } catch {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = pdfUrl;
      fallbackLink.download = pdfName || "file.pdf";
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
        <WindowControls target="pdffile" />
        <h2>{pdfName}</h2>

        {pdfUrl && (
          <button
            type="button"
            onClick={handlePdfDownload}
            className="cursor-pointer"
            title="Download pdf"
          >
            <Download className="icon" />
          </button>
        )}
      </div>
      <div>
        <div className="window-scroll resume-scroll mac-scrollbar">
          <div
            ref={zoomContainerRef}
            data-mobile-zoomed={enableTouchZoom && mobileZoom > 1 ? "1" : "0"}
            className={`resume-pdf-content flex justify-center ${enableTouchZoom ? "mobile-zoomable" : ""}`}
            style={{
              justifyContent: enableTouchZoom && mobileZoom > 1 ? "flex-start" : "center"
            }}
          >
            {pdfUrl && Document && Page && (
              <Document
                className={`resume-pdf-document ${enableTouchZoom ? "mobile-zoomable" : ""}`}
                file={pdfUrl}
                onLoadSuccess={({ numPages: totalPages }: { numPages: number }) =>
                  setNumPages(totalPages)
                }
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <Page
                    key={`${pdfUrl}-${index + 1}`}
                    pageNumber={index + 1}
                    width={effectivePageWidth}
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

const PdfFileWindow = WindowWrapper(PdfFile, "pdffile");

export default PdfFileWindow;
