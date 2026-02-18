import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { SocialLink } from "@/app/(project)/(types)/other.types";

type RawSocialLink = {
  text: string;
  link: string;
  icon: string;
  bg: string;
  order?: number;
};

const SOCIAL_LINKS_QUERY = groq`
*[_type == "socialLink"] | order(order asc){
  text,
  link,
  icon,
  bg,
  order
}
`;

export const getSocialLinksFromSanity = async (): Promise<SocialLink[]> => {
  const links = await sanityClient.fetch<RawSocialLink[]>(
    SOCIAL_LINKS_QUERY,
    {},
    { cache: "no-store" }
  );

  return (links ?? []).map((item, index) => ({
    id: index + 1,
    text: item.text,
    link: item.link,
    icon: item.icon,
    bg: item.bg,
  }));
};
