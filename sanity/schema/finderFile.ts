import { defineField, defineType } from "sanity";

const FILE_TYPES = ["txt", "img", "url", "fig", "pdf"] as const;

export const finderFile = defineType({
  name: "finderFile",
  title: "Finder File",
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
      initialValue: "file",
      readOnly: true,
      options: {
        list: [{ title: "File", value: "file" }],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fileType",
      title: "File Type",
      type: "string",
      options: {
        list: FILE_TYPES.map((value) => ({ title: value.toUpperCase(), value })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "External Link",
      type: "url",
      hidden: ({ document }) =>
        document?.fileType !== "url" && document?.fileType !== "fig",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const fileType = (context.document as { fileType?: string })?.fileType;
          if ((fileType === "url" || fileType === "fig") && !value) {
            return "href is required for url and fig files";
          }
          return true;
        }),
    }),
    defineField({
      name: "imageUrl",
      title: "Image Upload",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.fileType !== "img",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      hidden: ({ document }) => document?.fileType !== "txt",
    }),
    defineField({
      name: "image",
      title: "Text File Header Image Upload",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.fileType !== "txt",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF Upload",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      hidden: ({ document }) => document?.fileType !== "pdf",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const fileType = (context.document as { fileType?: string })?.fileType;
          if (fileType === "pdf" && !value) {
            return "PDF upload is required when fileType is pdf";
          }
          return true;
        }),
    }),
    defineField({
      name: "description",
      title: "Description Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      hidden: ({ document }) => document?.fileType !== "txt",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls item order inside a folder.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "fileType",
    },
  },
});
