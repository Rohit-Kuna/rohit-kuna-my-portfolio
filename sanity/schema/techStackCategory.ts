import { defineField, defineType } from "sanity";

export const techStackCategory = defineType({
  name: "techStackCategory",
  title: "Tech Stack Category",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls list order in Terminal window.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "category",
    },
  },
});

