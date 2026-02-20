import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type { MusicTrack } from "@/app/(project)/(types)/other.types";

type RawMusicTrack = {
  order?: number;
  title?: string;
  albumCover?: string;
  audioUrl?: string;
};

type RawMusicContent = {
  tracks?: RawMusicTrack[];
};

const MUSIC_PLAYER_CONTENT_QUERY = groq`
*[_type == "musicPlayerContent"][0]{
  "tracks": tracks[]{
    order,
    title,
    "albumCover": albumCover.asset->url,
    "audioUrl": audioFile.asset->url
  }
}
`;

export const getMusicTracksFromSanity = async (): Promise<MusicTrack[]> => {
  const content = await sanityClient.fetch<RawMusicContent | null>(
    MUSIC_PLAYER_CONTENT_QUERY,
    {},
    { cache: "no-store" }
  );

  const tracks = content?.tracks ?? [];

  return [...tracks]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((track) => Boolean(track?.audioUrl && track?.title))
    .map((track) => ({
      title: track.title as string,
      albumCover: track.albumCover,
      audioUrl: track.audioUrl as string,
    }));
};
