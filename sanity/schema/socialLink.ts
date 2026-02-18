import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  fields: [
    defineField({
      name: "text",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Profile URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Path",
      type: "string",
      description: "Public asset path, e.g. /icons/github.svg",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bg",
      title: "Card Background Color",
      type: "string",
      description: "Hex color, e.g. #f4656b",
      validation: (Rule) =>
        Rule.required().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
          name: "hexColor",
        }),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls list order in Contact window.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "text",
      subtitle: "link",
    },
  },
});

