"use client";
import type { WelcomeContent } from "@/app/(project)/(types)/other.types";

type WelcomeProps = {
  content?: WelcomeContent;
};

const defaultWelcomeContent: WelcomeContent = {
  subtitle: "I'm Rohit Kuna, I design and engineer software systems that scale from",
  title: "idea to production",
};

const Welcome = ({ content }: WelcomeProps) => {
  const welcomeContent = content ?? defaultWelcomeContent;

  return (
    <section id="welcome">
      <h2 className="welcome-subtitle">
        {welcomeContent.subtitle}
      </h2>
      <h1 className="welcome-title">
        {welcomeContent.title}
      </h1>
    </section>
  );
};

export default Welcome;
