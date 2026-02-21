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
  link: string;
  postImage?: string;
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

export type ContactContent = {
  windowTitle: string;
  profileImage: string;
  profileAlt: string;
  heading: string;
  message: string;
  email: string;
  whatsappNumber?: string;
  whatsappPrefillMessage?: string;
  socialLinks: SocialLink[];
};

export type ResumeContent = {
  windowTitle: string;
  resumeUrl: string;
};

export type MusicTrack = {
  title: string;
  audioUrl: string;
  albumCover?: string;
};
