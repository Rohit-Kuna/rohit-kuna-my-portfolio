import WindowControls from "@/app/(project)/(components)/WindowControls";
import { useWindowStore } from "@/app/(project)/(store)/window";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import type { FileNode } from "@/app/(project)/(types)/location.types";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";
import { useEffect, useRef, useState } from "react";

type TouchListLike = {
  length: number;
  [index: number]: { clientX: number; clientY: number } | undefined;
};

const MIN_IMAGE_ZOOM = 1;
const MAX_IMAGE_ZOOM = 4;
const DOUBLE_TAP_IMAGE_ZOOM = 2;
const DOUBLE_TAP_DELAY_MS = 260;

/* ---------- Component ---------- */

const Image = () => {
  const { windows } = useWindowStore();
  const isMobile = useIsMobile();

  const windowState = windows.imgfile;
  const data = windowState?.data as FileNode | null;
  const imageUrl = data?.imageUrl ?? "";
  const imageName = data?.name ?? "";

  const [imageZoom, setImageZoom] = useState(1);
  const zoomContainerRef = useRef<HTMLDivElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const imageZoomRef = useRef(1);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef(1);
  const lastTapAtRef = useRef(0);

  useEffect(() => {
    imageZoomRef.current = imageZoom;
  }, [imageZoom]);

  const supportsTouchZoom =
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches);
  const enableTouchZoom = isMobile || supportsTouchZoom;

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
    const container = zoomContainerRef.current;
    if (!container || typeof window === "undefined") return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };

    const frameId = window.requestAnimationFrame(updateSize);
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [enableTouchZoom]);

  useEffect(() => {
    if (!enableTouchZoom) return;

    const container = zoomContainerRef.current;
    if (!container) return;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        pinchStartDistanceRef.current = getTouchDistance(event.touches);
        pinchStartZoomRef.current = imageZoomRef.current;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || pinchStartDistanceRef.current === null) return;

      const currentDistance = getTouchDistance(event.touches);
      if (currentDistance <= 0) return;

      event.preventDefault();
      const nextZoom =
        pinchStartZoomRef.current * (currentDistance / pinchStartDistanceRef.current);
      setImageZoom(Math.min(MAX_IMAGE_ZOOM, Math.max(MIN_IMAGE_ZOOM, nextZoom)));
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
        setImageZoom((prev) => (prev > MIN_IMAGE_ZOOM ? MIN_IMAGE_ZOOM : DOUBLE_TAP_IMAGE_ZOOM));
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

  const hasLayoutMetrics =
    naturalSize.width > 0 &&
    naturalSize.height > 0 &&
    containerSize.width > 0 &&
    containerSize.height > 0;

  const fittedImageWidth = hasLayoutMetrics
    ? naturalSize.width *
      Math.min(
        containerSize.width / naturalSize.width,
        containerSize.height / naturalSize.height
      ) *
      imageZoom
    : 0;

  const fittedImageHeight = hasLayoutMetrics
    ? naturalSize.height *
      Math.min(
        containerSize.width / naturalSize.width,
        containerSize.height / naturalSize.height
      ) *
      imageZoom
    : 0;

  if (!data || data.fileType !== "img") return null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{imageName}</h2>
      </div>

      <div>
        {imageUrl && (
          <div
            ref={zoomContainerRef}
            className={`image-zoom-container p-2 bg-gray-200 flex ${enableTouchZoom && imageZoom > 1 ? "justify-start items-start" : "justify-center items-center"} ${enableTouchZoom ? "mobile-zoomable" : ""}`}
            style={{
              height: enableTouchZoom
                ? "calc(100dvh - 56px - var(--compact-dock-space) - 16px)"
                : undefined
            }}
          >
            <img
              key={imageUrl}
              src={imageUrl}
              alt={imageName}
              onLoad={(event) => {
                const target = event.currentTarget;
                setNaturalSize({
                  width: target.naturalWidth || 0,
                  height: target.naturalHeight || 0
                });
                setImageZoom(1);
                imageZoomRef.current = 1;
              }}
              className={`rounded ${enableTouchZoom ? "mobile-zoomable" : ""}`}
              style={{
                width: hasLayoutMetrics ? `${Math.max(1, Math.floor(fittedImageWidth))}px` : "auto",
                height: hasLayoutMetrics ? `${Math.max(1, Math.floor(fittedImageHeight))}px` : "auto",
                maxWidth: hasLayoutMetrics ? "none" : "100%",
                maxHeight: hasLayoutMetrics
                  ? "none"
                  : enableTouchZoom
                    ? "calc(100dvh - 56px - var(--compact-dock-space) - 16px)"
                    : "70vh",
                objectFit: "contain",
                objectPosition: "center"
              }}
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
