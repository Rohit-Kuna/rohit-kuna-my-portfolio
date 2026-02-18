import App from "./(project)/App";
import {
  getBlogPostsFromSanity,
  getContactContentFromSanity,
  getFinderLocationsFromSanity,
  getResumeContentFromSanity,
  getTechStackFromSanity,
} from "@/sanity/fetches";
import type { Location } from "@/app/(project)/(types)/location.types";
import type {
  BlogPost,
  ContactContent,
  ResumeContent,
  TechStackCategory,
} from "@/app/(project)/(types)/other.types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let locationsData: Record<string, Location> = {};
  let blogPostsData: BlogPost[] = [];
  let techStackData: TechStackCategory[] = [];
  let contactContentData: ContactContent | undefined;
  let resumeContentData: ResumeContent | undefined;

  try {
    locationsData = await getFinderLocationsFromSanity();
  } catch {
    locationsData = {};
  }

  try {
    blogPostsData = await getBlogPostsFromSanity();
  } catch {
    blogPostsData = [];
  }

  try {
    techStackData = await getTechStackFromSanity();
  } catch {
    techStackData = [];
  }

  try {
    const cmsContactContent = await getContactContentFromSanity();
    if (cmsContactContent) {
      contactContentData = cmsContactContent;
    }
  } catch {
    contactContentData = undefined;
  }

  try {
    const cmsResumeContent = await getResumeContentFromSanity();
    if (cmsResumeContent?.resumeUrl) {
      resumeContentData = cmsResumeContent;
    }
  } catch {
    resumeContentData = undefined;
  }

  return (
    <App
      locationsData={locationsData}
      blogPostsData={blogPostsData}
      techStackData={techStackData}
      contactContent={contactContentData}
      resumeContent={resumeContentData}
    />
  );
}
