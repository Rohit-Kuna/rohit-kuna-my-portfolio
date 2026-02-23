import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useWindowStore } from "@/app/(project)/(store)/window";
import type { FileNode } from "@/app/(project)/(types)/location.types";
import type { ResumeContent } from "@/app/(project)/(types)/other.types";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

type ReactPdfModule = typeof import("react-pdf");
type TouchListLike = {
  length: number;
  [index: number]: { clientX: number; clientY: number } | undefined;
};

const MIN_MOBILE_ZOOM = 1;
const MAX_MOBILE_ZOOM = 3;
const DOUBLE_TAP_ZOOM = 2;
const DOUBLE_TAP_DELAY_MS = 260;
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
  const [mobileZoom, setMobileZoom] = useState(1);
  const [supportsTouchZoom, setSupportsTouchZoom] = useState(false);
  const zoomContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileZoomRef = useRef(1);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef(1);
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
    mobileZoomRef.current = mobileZoom;
  }, [mobileZoom]);

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

  const getTouchDistance = (touches: TouchListLike) => {
    if (touches.length < 2) return 0;
    const first = touches[0];
    const second = touches[1];
    if (!first || !second) return 0;
    const dx = first.clientX - second.clientX;
    const dy = first.clientY - second.clientY;
    return Math.hypot(dx, dy);
  };

  useEffect(() => {
    if (!enableTouchZoom) return;

    const container = zoomContainerRef.current;
    if (!container) return;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        pinchStartDistanceRef.current = getTouchDistance(event.touches);
        pinchStartZoomRef.current = mobileZoomRef.current;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || pinchStartDistanceRef.current === null) return;

      const currentDistance = getTouchDistance(event.touches);
      if (currentDistance <= 0) return;

      event.preventDefault();
      const nextZoom =
        pinchStartZoomRef.current * (currentDistance / pinchStartDistanceRef.current);
      setMobileZoom(Math.min(MAX_MOBILE_ZOOM, Math.max(MIN_MOBILE_ZOOM, nextZoom)));
    };

    const onTouchEnd = (event: TouchEvent) => {
      const wasPinching = pinchStartDistanceRef.current !== null;
      if (event.touches.length < 2) {
        pinchStartDistanceRef.current = null;
      }
      if (wasPinching) return;

      if (event.changedTouches.length !== 1) return;
      const now = Date.now();
      if (now - lastTapAtRef.current <= DOUBLE_TAP_DELAY_MS) {
        setMobileZoom((prev) => (prev > MIN_MOBILE_ZOOM ? MIN_MOBILE_ZOOM : DOUBLE_TAP_ZOOM));
        lastTapAtRef.current = 0;
        return;
      }

      lastTapAtRef.current = now;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enableTouchZoom]);

  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;
  const effectivePageWidth = enableTouchZoom && mobilePageWidth
    ? Math.floor(mobilePageWidth * mobileZoom)
    : mobilePageWidth;
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
      <div>
        <div className="window-scroll resume-scroll mac-scrollbar">
          <div
            ref={zoomContainerRef}
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

/* ---------- Wrapped Window ---------- */

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
