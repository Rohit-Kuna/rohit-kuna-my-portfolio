import { defineField, defineType } from "sanity";

export const musicPlayerContent = defineType({
  name: "musicPlayerContent",
  title: "Music Player Content",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Panel Title",
      type: "string",
      initialValue: "Now Playing",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tracks",
      title: "Tracks",
      type: "array",
      of: [
        defineField({
          name: "track",
          title: "Track",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order",
              type: "number",
              description: "Lower number appears first in playlist.",
              initialValue: 0,
            }),
            defineField({
              name: "title",
              title: "Track Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "albumCover",
              title: "Album Cover",
              type: "image",
              options: { hotspot: true },
              description: "Optional. Falls back to default profile image.",
            }),
            defineField({
              name: "audioFile",
              title: "MP3 File",
              type: "file",
              options: {
                accept: "audio/mpeg,audio/*",
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "albumCover",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tracks.0.title",
    },
    prepare: (selection) => ({
      title: selection.title || "Music Player Content",
      subtitle: selection.subtitle ? `First track: ${selection.subtitle}` : "No tracks",
    }),
  },
});
