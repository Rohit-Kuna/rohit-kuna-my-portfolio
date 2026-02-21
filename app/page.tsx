import App from "./(project)/App";
import {
  getBlogPostsFromSanity,
  getContactContentFromSanity,
  getFinderLocationsFromSanity,
  getMusicTracksFromSanity,
  getResumeContentFromSanity,
  getTechStackFromSanity,
  getWelcomeContentFromSanity,
} from "@/sanity/fetches";
import type { Location } from "@/app/(project)/(types)/location.types";
import type {
  BlogPost,
  ContactContent,
  MusicTrack,
  ResumeContent,
  TechStackCategory,
  WelcomeContent,
} from "@/app/(project)/(types)/other.types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let locationsData: Record<string, Location> = {};
  let blogPostsData: BlogPost[] = [];
  let techStackData: TechStackCategory[] = [];
  let musicTracksData: MusicTrack[] = [];
  let contactContentData: ContactContent | undefined;
  let resumeContentData: ResumeContent | undefined;
  let welcomeContentData: WelcomeContent | undefined;

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
    musicTracksData = await getMusicTracksFromSanity();
  } catch {
    musicTracksData = [];
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

  try {
    const cmsWelcomeContent = await getWelcomeContentFromSanity();
    if (cmsWelcomeContent?.subtitle && cmsWelcomeContent?.title) {
      welcomeContentData = cmsWelcomeContent;
    }
  } catch {
    welcomeContentData = undefined;
  }

  return (
    <App
      locationsData={locationsData}
      blogPostsData={blogPostsData}
      techStackData={techStackData}
      musicTracksData={musicTracksData}
      contactContent={contactContentData}
      resumeContent={resumeContentData}
      welcomeContent={welcomeContentData}
    />
  );
}
