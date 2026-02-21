import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { MusicTrack } from "@/app/(project)/(types)/other.types";

type NowPlayingBarProps = {
  tracks?: MusicTrack[];
};

const DEFAULT_TRACKS: MusicTrack[] = [
  {
    title: "Rohit's Muse",
    audioUrl: "/music/instrumental.mp3",
    albumCover: "/images/profile-photo.png",
  },
];

const NowPlayingBar = ({ tracks = [] }: NowPlayingBarProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlist = tracks.length > 0 ? tracks : DEFAULT_TRACKS;
  const playlistLengthRef = useRef(playlist.length);
  const safeTrackIndex =
    playlist.length > 0
      ? ((currentTrackIndex % playlist.length) + playlist.length) % playlist.length
      : 0;
  const currentTrack = playlist[safeTrackIndex] ?? DEFAULT_TRACKS[0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = false;
    const onEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % Math.max(playlistLengthRef.current, 1));
    };
    audio.addEventListener("ended", onEnded);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    playlistLengthRef.current = playlist.length;
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.audioUrl;
    audio.load();

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  const handlePreviousTrack = () => {
    if (playlist.length <= 1) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      return;
    }

    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleNextTrack = () => {
    if (playlist.length <= 1) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      return;
    }

    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <div className="mobile-now-playing" aria-label="Now playing">
      <div className="mobile-now-playing-left">
        <img
          src={currentTrack.albumCover || "/images/profile-photo.png"}
          alt="Album cover"
          loading="lazy"
          className="mobile-now-playing-cover"
        />
        <div className="mobile-now-playing-text">
          <span className="mobile-now-playing-label">Now Playing</span>
          <div className="mobile-now-playing-title-track">
            <span className={`mobile-now-playing-title ${isPlaying ? "" : "is-paused"}`}>
              {currentTrack.title}
            </span>
          </div>
        </div>
      </div>

      <div className="mobile-now-playing-controls">
        <button
          type="button"
          className="mobile-now-playing-btn"
          aria-label="Previous"
          onClick={handlePreviousTrack}
        >
          <SkipBack size={14} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className="mobile-now-playing-btn mobile-now-playing-btn-main"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? <Pause size={14} strokeWidth={2.7} /> : <Play size={14} strokeWidth={2.7} />}
        </button>
        <button
          type="button"
          className="mobile-now-playing-btn"
          aria-label="Next"
          onClick={handleNextTrack}
        >
          <SkipForward size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div
        className={`mobile-now-playing-eq ${isPlaying ? "" : "is-paused"}`}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default NowPlayingBar;
