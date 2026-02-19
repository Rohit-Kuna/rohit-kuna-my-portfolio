"use client";

import { useEffect } from "react";
import Navbar from "@/app/(project)/(components)/NavBar";
import MobileNotificationPanel from "@/app/(project)/(components)/MobileNotificationPanel";
import Welcome from "@/app/(project)/(components)/Welcome";
import Dock from "@/app/(project)/(components)/Dock";
import Home from "@/app/(project)/(components)/Home";
import useLocationStore from "@/app/(project)/(store)/location";
import { Terminal, Safari, Resume, Finder, Text, Image, Contact } from "@/app/(project)/(windows)";
import type { Location } from "@/app/(project)/(types)/location.types";
import type {
  BlogPost,
  ContactContent,
  ResumeContent,
  TechStackCategory,
} from "@/app/(project)/(types)/other.types";

type AppProps = {
  locationsData: Record<string, Location>;
  blogPostsData?: BlogPost[];
  techStackData?: TechStackCategory[];
  contactContent?: ContactContent;
  resumeContent?: ResumeContent;
};

const App = ({
  locationsData,
  blogPostsData = [],
  techStackData = [],
  contactContent,
  resumeContent,
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
      <MobileNotificationPanel />
      <Welcome />
      <Dock />

      <Terminal techStackData={techStackData} />
      <Safari blogPosts={blogPostsData} />
      <Resume resumeContent={resumeContent} />
      <Finder locationsData={locationsData} />
      <Text />
      <Image />
      <Contact contactContent={contactContent} />
      <Home locationsData={locationsData} />
    </main>
  );
};

export default App;
