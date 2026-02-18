import App from "./(project)/App";
import { getFinderLocationsFromSanity } from "@/app/(project)/(content)/location.cms";
import { getBlogPostsFromSanity } from "@/app/(project)/(content)/other.cms";
import type { Location } from "@/app/(project)/(types)/location.types";
import type { BlogPost } from "@/app/(project)/(types)/other.types";
import { blogPosts as staticBlogPosts } from "@/app/(project)/(content)/other.content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let locationsData: Record<string, Location> = {};
  let blogPostsData: BlogPost[] = staticBlogPosts;

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

  return <App locationsData={locationsData} blogPostsData={blogPostsData} />;
}
