/* ---------- Finder / File System ---------- */

export type ID = number | string;

export type Position = string;

export type FileKind = "file" | "folder";

export type FileType = "txt" | "img" | "url" | "fig" | "pdf";

export type BaseNode = {
  id: ID;
  name: string;
  icon: string;
  kind: FileKind;
};

export type FileNode = BaseNode & {
  kind: "file";
  fileType: FileType;
  href?: string;
  imageUrl?: string;
  subtitle?: string;
  image?: string;
  description?: string[];
};

export type FolderNode = BaseNode & {
  kind: "folder";
  children: FinderNode[];
};

export type FinderNode = FileNode | FolderNode;

/* ---------- Locations ---------- */

export type Location = {
  id: number;
  type: string;
  name: string;
  icon: string;
  kind: "folder";
  children: FinderNode[];
};

export type NavigableFolder = Location | FolderNode;
