import dayjs from "dayjs";
import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { BlogPost } from "@/app/(project)/(types)/other.types";

type RawBlogPost = {
  _id: string;
  title: string;
  link: string;
  publishedAt: string;
  postImage?: string;
  order?: number;
};

const BLOG_POSTS_QUERY = groq`
*[_type == "blogPost"] | order(order asc, publishedAt desc){
  _id,
  title,
  link,
  publishedAt,
  "postImage": postImage.asset->url,
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
    postImage: post.postImage,
  }));
};
