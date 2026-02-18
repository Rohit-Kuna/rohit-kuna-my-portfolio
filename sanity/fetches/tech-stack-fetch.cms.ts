import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { TechStackCategory } from "@/app/(project)/(types)/other.types";

type RawTechStackCategory = {
  category: string;
  items: string[];
  order?: number;
};

const TECH_STACK_QUERY = groq`
*[_type == "techStackCategory"] | order(order asc){
  category,
  items,
  order
}
`;

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
