import { defineField, defineType } from "sanity";

export const finderFolder = defineType({
  name: "finderFolder",
  title: "Finder Folder",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
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
      title: "Order",
      type: "number",
      description: "Controls item order inside parent folder/location.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "folder",
    }),
  },
});
