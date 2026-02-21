export type WindowKey =
  | "finder"
  | "contact"
  | "resume"
  | "safari"
  | "photos"
  | "terminal"
  | "txtfile"
  | "imgfile"
  | "pdffile";

export type WindowState<T = unknown> = {
  isOpen: boolean;
  zIndex: number;
  data: T | null;
  isMaximized: boolean;
};
