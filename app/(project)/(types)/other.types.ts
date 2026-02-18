/* ---------- Navigation ---------- */
import type { LucideIcon } from "lucide-react";
export type NavLink = {
  id: number;
  name: string;
  type: string; // future CMS enum
  icon: LucideIcon;
};

export type NavIcon = {
  id: number;
  img: string;
  icon: LucideIcon;
};

/* ---------- Dock ---------- */

export type DockApp = {
  id: string;
  name: string;
  icon: string;
  canOpen: boolean;
};

/* ---------- Blog ---------- */

export type BlogPost = {
  id: number;
  date: string; // CMS date string
  title: string;
  icon: LucideIcon;
  link: string;
};

/* ---------- Tech Stack ---------- */

export type TechStackCategory = {
  category: string;
  items: string[];
};

/* ---------- Social ---------- */

export type SocialLink = {
  id: number;
  text: string;
  icon: string;
  bg: string;
  link: string;
};

/* ---------- Gallery ---------- */

export type GalleryItem = {
  id: number;
  img: string;
};

export type PhotosLink = {
  id: number;
  icon: string;
  title: string;
};