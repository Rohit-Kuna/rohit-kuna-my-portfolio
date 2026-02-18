import App from "./(project)/App";
import { getFinderLocationsFromSanity } from "@/app/(project)/(content)/location.cms";
import {
  getBlogPostsFromSanity,
  getContactContentFromSanity,
  getSocialLinksFromSanity,
  getTechStackFromSanity,
} from "@/app/(project)/(content)/other.cms";
import type { Location } from "@/app/(project)/(types)/location.types";
import type {
  BlogPost,
  ContactContent,
  SocialLink,
  TechStackCategory,
} from "@/app/(project)/(types)/other.types";
import {
  blogPosts as staticBlogPosts,
  socials as staticSocials,
  techStack as staticTechStack,
} from "@/app/(project)/(content)/other.content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let locationsData: Record<string, Location> = {};
  let blogPostsData: BlogPost[] = staticBlogPosts;
  let socialsData: SocialLink[] = staticSocials;
  let techStackData: TechStackCategory[] = staticTechStack;
  let contactContentData: ContactContent | undefined;

  try {
    locationsData = await getFinderLocationsFromSanity();
  } catch {
    locationsData = {};
  }

  try {
    const cmsBlogPosts = await getBlogPostsFromSanity();
    if (cmsBlogPosts.length > 0) {
      blogPostsData = cmsBlogPosts;
    }
  } catch {
    blogPostsData = staticBlogPosts;
  }

  try {
    const cmsSocialLinks = await getSocialLinksFromSanity();
    if (cmsSocialLinks.length > 0) {
      socialsData = cmsSocialLinks;
    }
  } catch {
    socialsData = staticSocials;
  }

  try {
    const cmsTechStack = await getTechStackFromSanity();
    if (cmsTechStack.length > 0) {
      techStackData = cmsTechStack;
    }
  } catch {
    techStackData = staticTechStack;
  }

  try {
    const cmsContactContent = await getContactContentFromSanity();
    if (cmsContactContent) {
      contactContentData = cmsContactContent;
    }
  } catch {
    contactContentData = undefined;
  }

  return (
    <App
      locationsData={locationsData}
      blogPostsData={blogPostsData}
      socialsData={socialsData}
      techStackData={techStackData}
      contactContent={contactContentData}
    />
  );
}
