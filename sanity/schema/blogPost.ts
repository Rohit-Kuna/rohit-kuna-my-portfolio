import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Article Link",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postImage",
      title: "Post Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Optional image shown before article title in Safari list.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls list order in Safari window.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
    },
  },
});
