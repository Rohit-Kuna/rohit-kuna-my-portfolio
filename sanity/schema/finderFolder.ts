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
      name: "icon",
      title: "Icon Path",
      type: "string",
      description: 'Path in /public (example: "/images/folder.png").',
    }),
    defineField({
      name: "iconUpload",
      title: "Icon Upload",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Optional upload. If present, this is used instead of icon path.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const iconPath = (context.document as { icon?: string } | undefined)?.icon;
          if (!value && !iconPath) {
            return "Provide either Icon Path or Icon Upload.";
          }
          return true;
        }),
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
