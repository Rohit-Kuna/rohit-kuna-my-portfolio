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
      name: "resumeFile",
      title: "Resume PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "windowTitle",
    },
  },
});

