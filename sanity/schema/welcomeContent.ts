import { defineField, defineType } from "sanity";

export const welcomeContent = defineType({
  name: "welcomeContent",
  title: "Welcome Content",
  type: "document",
  fields: [
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      initialValue: "I'm Rohit Kuna, I design and engineer software systems that scale from",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "idea to production",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
  },
});
