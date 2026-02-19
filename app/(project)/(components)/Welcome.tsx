"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import useIsMobile from "@/app/(project)/(hooks)/useIsMobile";

/* ---------- Config ---------- */

const TITLE_TEXT = "think different";
const TITLE_BASE_WEIGHT = 420;
const TITLE_MIN_WEIGHT = 420;
const TITLE_MAX_WEIGHT = 880;

/* ---------- Helpers ---------- */

const renderTitleLetters = (text: string, className: string) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={`${className} welcome-title-letter inline-block will-change-transform`}
      style={{ fontVariationSettings: `'wght' ${TITLE_BASE_WEIGHT}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

/* ---------- Component ---------- */

const Welcome = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const isMobile = useIsMobile();

  useGSAP(() => {
    const title = titleRef.current;
    if (!title) return;

    const letters = title.querySelectorAll<HTMLSpanElement>(".welcome-title-letter");
    if (!letters.length) return;

    if (isMobile) {
      gsap.to(letters, {
        y: (i) => (i % 2 === 0 ? -2.5 : 2.5),
        rotation: (i) => (i % 2 === 0 ? -1.1 : 1.1),
        skewX: (i) => (i % 2 === 0 ? 2.2 : -2.2),
        duration: 1.55,
        ease: "sine.inOut",
        stagger: 0.03,
        repeat: -1,
        yoyo: true
      });
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = title.getBoundingClientRect();
      const centerX = event.clientX - bounds.left;
      const centerY = event.clientY - bounds.top;

      letters.forEach((letter, index) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left - bounds.left + rect.width / 2;
        const letterY = rect.top - bounds.top + rect.height / 2;
        const distance = Math.hypot(centerX - letterX, centerY - letterY);
        const influence = Math.exp(-(distance ** 2) / 9000);
        const wave = Math.sin((centerX / bounds.width) * Math.PI * 3 + index * 0.35);

        gsap.to(letter, {
          y: -8 * influence + wave * 2.5,
          rotation: wave * 6 * influence,
          skewX: wave * 8 * influence,
          fontVariationSettings: `'wght' ${TITLE_MIN_WEIGHT + (TITLE_MAX_WEIGHT - TITLE_MIN_WEIGHT) * influence}`,
          duration: 0.35,
          ease: "power2.out"
        });
      });
    };

    const handleMouseLeave = () => {
      gsap.to(letters, {
        x: 0,
        y: 0,
        rotation: 0,
        skewX: 0,
        fontVariationSettings: `'wght' ${TITLE_BASE_WEIGHT}`,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.01
      });
    };

    title.addEventListener("mousemove", handleMouseMove);
    title.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      title.removeEventListener("mousemove", handleMouseMove);
      title.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <section id="welcome">
      <h1 ref={titleRef} className="mt-7 whitespace-nowrap leading-none text-center">
        {renderTitleLetters(TITLE_TEXT, "text-[clamp(3rem,14vw,5rem)] sm:text-6xl lg:text-9xl italic font-georama")}
      </h1>
    </section>
  );
};

export default Welcome;
