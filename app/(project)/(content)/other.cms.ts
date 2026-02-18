import dayjs from "dayjs";
import { createClient, groq } from "next-sanity";
import type { BlogPost } from "@/app/(project)/(types)/other.types";

const sanityClient = createClient({
  projectId: "i90q0i8o",
  dataset: "production",
  apiVersion: "2026-02-18",
  useCdn: false,
});

type RawBlogPost = {
  _id: string;
  title: string;
  link: string;
  publishedAt: string;
  order?: number;
};

const BLOG_POSTS_QUERY = groq`
*[_type == "blogPost"] | order(order asc, publishedAt desc){
  _id,
  title,
  link,
  publishedAt,
  order
}
`;

export const getBlogPostsFromSanity = async (): Promise<BlogPost[]> => {
  const posts = await sanityClient.fetch<RawBlogPost[]>(
    BLOG_POSTS_QUERY,
    {},
    { cache: "no-store" }
  );

  return (posts ?? []).map((post, index) => ({
    id: index + 1,
    title: post.title,
    link: post.link,
    date: dayjs(post.publishedAt).format("MMM D, YYYY"),
  }));
};
