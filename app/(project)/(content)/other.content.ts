import type {
  NavLink,
  NavIcon,
  DockApp,
  BlogPost,
  TechStackCategory,
  SocialLink,
  PhotosLink,
  GalleryItem,
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

const blogPosts : BlogPost[] = [
  {
    id: 1,
    date: "Dec 22, 2024",
    title:
      "Alchemist Of Art & Tech : The Story of Rohit Kuna",
    link: "https://medium.com/@rohitkuna28/alchemist-of-art-tech-the-story-of-rohit-kuna-ad17f3d43574",
  },
  {
    id: 2,
    date: "Jan 14, 2025",
    title: "Fun to Learn : Callbacks, Promises & Async/Await",
    link: "https://medium.com/@rohitkuna28/fun-to-learn-callbacks-promises-async-await-171d5035a8d7",
  },
  {
    id: 2.1,
    date: "Jan 14, 2025",
    title: "Callback, Promises & Async Await : Posts & Comments",
    link: "https://medium.com/@rohitkuna28/callback-promises-async-await-posts-comments-dd0c4ae4bcca",
  },
  {
    id: 3,
    date: "Jan 11, 2025",
    title: "Behavioral Design Patterns : Art of Burger Interactions",
    link: "https://medium.com/@rohitkuna28/behavioral-design-patterns-how-burgers-behave-44cb9520c1f1",
  },
  {
    id: 4,
    date: "Jan 2, 2025",
    title: "Structural Design Patterns : Arranging the Burger Restaurant",
    link: "https://medium.com/@rohitkuna28/structural-design-patterns-arranging-the-burger-restaurant-3b4f0c6fe08e",
  },
  {
    id: 5,
    date: "Dec 29, 2024",
    title: "Creational Design Patterns : The Burger Creation Recipes - Part1",
    link: "https://medium.com/@rohitkuna28/creational-design-patterns-the-burger-creation-recipes-fedc1821cd5b",
  },
];

const techStack : TechStackCategory[]= [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "Sass", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Hono"],
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub", "Docker"],
  },
];

const socials : SocialLink[] = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/Rohit-Kuna",
  },
  {
    id: 2,
    text: "Medium",
    icon: "/icons/medium.png",
    bg: "#4bcb63",
    link: "https://medium.com/@rohitkuna28",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#ff866b",
    link: "https://x.com/rohitkunaart",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/rohit-kuna/",
  },
];

const photosLinks : PhotosLink[] = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery : GalleryItem[] = [
  {
    id: 1,
    img: "/images/gal1.png",
  },
  {
    id: 2,
    img: "/images/gal2.png",
  },
  {
    id: 3,
    img: "/images/gal3.png",
  },
  {
    id: 4,
    img: "/images/gal4.png",
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
};

