import type {
  NavLink,
  NavIcon,
  DockApp,
} from "@/app/(project)/(types)/other.types";

import { Folder, UserCircle, FileText, Wifi, Search, Mail } from "lucide-react";

const navLinks : NavLink[] = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
    icon: Folder,
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
    icon: UserCircle,
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
    icon: FileText
  },
];

const navIcons : NavIcon[] = [
  {
    id: 1,
    img: "/icons/wifi.svg",
    icon: Wifi
  },
  {
    id: 2,
    img: "/icons/search.svg",
    icon: Search,
  },
  {
    id: 3,
    img: "/icons/user.svg",
    icon: Mail
  },
];

const dockApps: DockApp[] = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Articles", // was "Safari"
    icon: "safari.png",
    canOpen: true,
  },
  {
    id: "resume",
    name: "Resume", // was "Photos"
    icon: "notes-icon.webp",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.png",
    canOpen: true,
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
};

