"use client";

import nextDynamic from "next/dynamic";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

const NextStudio = nextDynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function AdminPage() {
  return <NextStudio config={config} />;
}
