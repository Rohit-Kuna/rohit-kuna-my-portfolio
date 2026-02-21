import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { WelcomeContent } from "@/app/(project)/(types)/other.types";

const WELCOME_CONTENT_QUERY = groq`
*[_type == "welcomeContent"][0]{
  subtitle,
  title
}
`;

export const getWelcomeContentFromSanity = async (): Promise<WelcomeContent | null> => {
  return sanityClient.fetch<WelcomeContent | null>(
    WELCOME_CONTENT_QUERY,
    {},
    { cache: "no-store" }
  );
};
