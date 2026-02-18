"use client";

import { useEffect } from "react";
import Navbar from "@/app/(project)/(components)/NavBar";
import Welcome from "@/app/(project)/(components)/Welcome";
import Dock from "@/app/(project)/(components)/Dock";
import Home from "@/app/(project)/(components)/Home";
import useLocationStore from "@/app/(project)/(store)/location";
import { Terminal, Safari, Resume, Finder, Text, Image, Contact } from "@/app/(project)/(windows)";
import type { Location } from "@/app/(project)/(types)/location.types";

type AppProps = {
  locationsData: Record<string, Location>;
};

const App = ({ locationsData }: AppProps) => {
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

      <Terminal />
      <Safari />
      <Resume />
      <Finder locationsData={locationsData} />
      <Text />
      <Image />
      <Contact />
      <Home locationsData={locationsData} />
    </main>
  );
};

export default App;
