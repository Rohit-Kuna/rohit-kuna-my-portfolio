"use client";

import Navbar from "@/app/(project)/(components)/NavBar";
import Welcome from "@/app/(project)/(components)/Welcome";
import Dock from "@/app/(project)/(components)/Dock";
import Home from "@/app/(project)/(components)/Home";
import { Terminal, Safari, Resume, Finder, Text, Image, Contact } from "@/app/(project)/(windows)";

const App=()=>{
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Home />
    </main>
  );
};

export default App;
