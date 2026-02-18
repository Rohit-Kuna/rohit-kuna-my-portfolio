import dayjs from "dayjs";
import { createClient, groq } from "next-sanity";
import type {
  BlogPost,
  ContactContent,
  SocialLink,
  TechStackCategory,
} from "@/app/(project)/(types)/other.types";

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

const TECH_STACK_QUERY = groq`
*[_type == "techStackCategory"] | order(order asc){
  category,
  items,
  order
}
`;

const SOCIAL_LINKS_QUERY = groq`
*[_type == "socialLink"] | order(order asc){
  text,
  link,
  icon,
  bg,
  order
}
`;

const CONTACT_CONTENT_QUERY = groq`
*[_type == "contactContent"][0]{
  windowTitle,
  "profileImage": profileImage.asset->url,
  profileAlt,
  heading,
  message,
  email
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

type RawTechStackCategory = {
  category: string;
  items: string[];
  order?: number;
};

export const getTechStackFromSanity = async (): Promise<TechStackCategory[]> => {
  const categories = await sanityClient.fetch<RawTechStackCategory[]>(
    TECH_STACK_QUERY,
    {},
    { cache: "no-store" }
  );

  return (categories ?? []).map((category) => ({
    category: category.category,
    items: category.items ?? [],
  }));
};

type RawSocialLink = {
  text: string;
  link: string;
  icon: string;
  bg: string;
  order?: number;
};

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

export const getContactContentFromSanity = async (): Promise<ContactContent | null> => {
  const content = await sanityClient.fetch<ContactContent | null>(
    CONTACT_CONTENT_QUERY,
    {},
    { cache: "no-store" }
  );

  return content ?? null;
};
