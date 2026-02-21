import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { ContactContent, SocialLink } from "@/app/(project)/(types)/other.types";

const CONTACT_CONTENT_QUERY = groq`
*[_type == "contactContent"][0]{
  windowTitle,
  "profileImage": profileImage.asset->url,
  profileAlt,
  heading,
  message,
  email,
  whatsappNumber,
  whatsappPrefillMessage,
  "socialLinks": socialLinks[]->{
    text,
    link,
    icon,
    bg
  }
}
`;

export const getContactContentFromSanity = async (): Promise<ContactContent | null> => {
  type RawContactContent = Omit<ContactContent, "socialLinks"> & {
    socialLinks?: Omit<SocialLink, "id">[];
  };

  const content = await sanityClient.fetch<RawContactContent | null>(
    CONTACT_CONTENT_QUERY,
    {},
    { cache: "no-store" }
  );

  if (!content) return null;

  return {
    ...content,
    socialLinks: (content.socialLinks ?? []).map((item, index) => ({
      id: index + 1,
      ...item,
    })),
  };
};
