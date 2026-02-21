import { defineField, defineType } from "sanity";

export const contactContent = defineType({
  name: "contactContent",
  title: "Contact Content",
  type: "document",
  fields: [
    defineField({
      name: "windowTitle",
      title: "Window Title",
      type: "string",
      initialValue: "Contact Me",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "profileAlt",
      title: "Profile Image Alt",
      type: "string",
      initialValue: "Profile photo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Let's Connect",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      description: "Use full international format without + (example: 919876543210).",
      type: "string",
      validation: (Rule) => Rule.regex(/^\d*$/, {
        name: "digits",
        invert: false,
      }),
    }),
    defineField({
      name: "whatsappPrefillMessage",
      title: "WhatsApp Prefill Message",
      type: "string",
      initialValue: "Hi Rohit, would love to connect with you",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "socialLink" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "windowTitle",
      subtitle: "email",
      media: "profileImage",
    },
  },
});
