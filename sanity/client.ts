import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: "i90q0i8o",
  dataset: "production",
  apiVersion: "2026-02-18",
  useCdn: false,
});
