"use client";

import { useEffect } from "react";
import Navbar from "@/app/(project)/(components)/NavBar";
import Welcome from "@/app/(project)/(components)/Welcome";
import Dock from "@/app/(project)/(components)/Dock";
import Home from "@/app/(project)/(components)/Home";
import useLocationStore from "@/app/(project)/(store)/location";
import { Terminal, Safari, Resume, Finder, Text, Image, Contact } from "@/app/(project)/(windows)";
import type { Location } from "@/app/(project)/(types)/location.types";
import type {
  BlogPost,
  ContactContent,
  SocialLink,
  TechStackCategory,
} from "@/app/(project)/(types)/other.types";
import {
  blogPosts as staticBlogPosts,
  socials as staticSocials,
  techStack as staticTechStack,
} from "@/app/(project)/(content)/other.content";

const staticContactContent: ContactContent = {
  windowTitle: "Contact Me",
  profileImage: "/images/profile-photo.png",
  profileAlt: "Rohit",
  heading: "Let's Connect",
  message: "Got an idea ? A bug to squash? Or just wanna talk tech? I'm in.",
  email: "rohitkuna28@gmail.com",
};

type AppProps = {
  locationsData: Record<string, Location>;
  blogPostsData?: BlogPost[];
  techStackData?: TechStackCategory[];
  socialsData?: SocialLink[];
  contactContent?: ContactContent;
};

const App = ({
  locationsData,
  blogPostsData = staticBlogPosts,
  socialsData = staticSocials,
  techStackData = staticTechStack,
  contactContent = staticContactContent,
}: AppProps) => {
  const { activeLocation, setActiveLocation } = useLocationStore();

  useEffect(() => {
    const defaultLocation =
      locationsData.work ?? Object.values(locationsData)[0] ?? null;

    if (!activeLocation && defaultLocation) {
      setActiveLocation(defaultLocation);
    }
  }, [activeLocation, locationsData, setActiveLocation]);

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal techStackData={techStackData} />
      <Safari blogPosts={blogPostsData} />
      <Resume />
      <Finder locationsData={locationsData} />
      <Text />
      <Image />
      <Contact socialsData={socialsData} contactContent={contactContent} />
      <Home locationsData={locationsData} />
    </main>
  );
};

export default App;
