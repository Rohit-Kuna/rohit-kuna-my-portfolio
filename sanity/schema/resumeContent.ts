import { defineField, defineType } from "sanity";

export const resumeContent = defineType({
  name: "resumeContent",
  title: "Resume Content",
  type: "document",
  fields: [
    defineField({
      name: "windowTitle",
      title: "Window Title",
      type: "string",
      initialValue: "Resume.pdf",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "resumeFinderFile",
      title: "Resume Finder File",
      type: "reference",
      to: [{ type: "finderFile" }],
      options: {
        filter: 'fileType == $fileType',
        filterParams: { fileType: "pdf" },
      },
      description: "Select an existing Finder file of type PDF.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "windowTitle",
    },
  },
});
