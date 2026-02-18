import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { ResumeContent } from "@/app/(project)/(types)/other.types";

const RESUME_CONTENT_QUERY = groq`
*[_type == "resumeContent"][0]{
  windowTitle,
  "resumeUrl": resumeFile.asset->url
}
`;

export const getResumeContentFromSanity = async (): Promise<ResumeContent | null> => {
  const content = await sanityClient.fetch<ResumeContent | null>(
    RESUME_CONTENT_QUERY,
    {},
    { cache: "no-store" }
  );

  return content ?? null;
};
