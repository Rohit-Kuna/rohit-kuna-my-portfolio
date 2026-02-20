import { defineField, defineType } from "sanity";

export const finderLocation = defineType({
  name: "finderLocation",
  title: "Finder Location",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Location Key",
      type: "string",
      description:
        "Unique key used by the app (examples: work, about, resume, certifications).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Path",
      type: "string",
      description: 'Path in /public (example: "/icons/work.svg").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      initialValue: "folder",
      readOnly: true,
      options: {
        list: [{ title: "Folder", value: "folder" }],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "finderFolder" }, { type: "finderFile" }],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sidebar Order",
      type: "number",
      description: "Controls location order in Finder sidebar.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
    },
  },
});
