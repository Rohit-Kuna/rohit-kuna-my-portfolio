import type {
  NavLink,
  NavIcon,
  DockApp,
  BlogPost,
  TechStackCategory,
  SocialLink,
} from "@/app/(project)/(types)/other.types";

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

// Location

import { Location, FinderNode } from "@/app/(project)/(types)/location.types";
const WORK_LOCATION : Location = {
  id: 1,
  type: "work",
  name: "Projects",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "Nike Ecommerce Website Application",
      icon: "/images/folder.png",
      kind: "folder",
      children: [
        {
          id: 1,
          name: "Nike Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          description: [
            "The Nike eCommerce website is a sleek and modern platform designed for shopping the latest Nike collections.",
            "Instead of a simple online store, it delivers an immersive experience with bold visuals, interactive product displays, and smooth navigation.",
            "Think of it like walking into a flagship Nike store—but right from your phone or laptop.",
            "It's built with Next.js and Tailwind, ensuring fast performance, responsive design, and a clean, premium look.",
          ],
        },
        {
          id: 2,
          name: "nike.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/fZdTYswuZjU?si=Awjl-pIst9e09_UU",
        },
        {
          id: 4,
          name: "nike.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/images/project-1.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
        },
      ],
    },

    // ▶ Project 2
    {
      id: 6,
      name: "AI Resume Analyzer",
      icon: "/images/folder.png",
      kind: "folder",
      children: [
        {
          id: 1,
          name: "AI Resume Analyzer Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          description: [
            "AI Resume Analyzer is a smart tool that helps you perfect your resume with instant feedback.",
            "Instead of guessing what recruiters want, you get AI-powered insights on keywords, formatting, and overall impact.",
            "Think of it like having a career coach—pointing out strengths, fixing weaknesses, and boosting your chances of landing interviews.",
            "It's built with Next.js and Tailwind, so it runs fast, looks professional, and works seamlessly on any device.",
          ],
        },
        {
          id: 2,
          name: "ai-resume-analyzer.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/iYOz165wGkQ?si=R1hs8Legl200m0Cl",
        },
        {
          id: 4,
          name: "ai-resume-analyzer.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/images/project-2.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 7,
      name: "Food Delivery App",
      icon: "/images/folder.png",
      kind: "folder",
      children: [
        {
          id: 1,
          name: "Food Delivery App Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          description: [
            "Our Food Delivery App is a fast and convenient way to order meals from your favorite restaurants.",
            "Instead of making calls or waiting in line, you can browse menus, customize orders, and track deliveries in real time.",
            "Think of it like having your favorite restaurants in your pocket—ready to deliver anytime, anywhere.",
            "It’s built with React Native, so it works smoothly on both iOS and Android with a clean, modern design.",
          ],
        },
        {
          id: 2,
          name: "food-delivery-app.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/LKrX390fJMw?si=cExkuVhf2DTV9G2-",
        },
        {
          id: 4,
          name: "food-delivery-app.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/images/project-3.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION : Location = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/profile-photo.png",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/adrian-2.jpg",
    },
    {
      id: 3,
      name: "conference-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/adrian-3.jpeg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/profile-photo.png",
      description: [
        "Hey! I'm Adrian 👋, a web developer who enjoys building sleek, interactive websites that actually work well.",
        "I specialize in JavaScript, React, and Next.js—and I love making things feel smooth, fast, and just a little bit delightful.",
        "I'm big on clean UI, good UX, and writing code that doesn't need a search party to debug.",
        "Outside of dev work, you'll find me tweaking layouts at 2AM, sipping overpriced coffee, or impulse-buying gadgets I absolutely convinced myself I needed 😅",
      ],
    },
  ],
};

const RESUME_LOCATION : Location = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION : Location = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "trash1.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/trash-1.png",
    },
    {
      id: 2,
      name: "trash2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      imageUrl: "/images/trash-2.png",
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
} satisfies Record<string, Location>;

