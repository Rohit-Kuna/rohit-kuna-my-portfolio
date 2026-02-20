import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

const NowPlayingBar = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="mobile-now-playing" aria-label="Now playing">
      <div className="mobile-now-playing-left">
        <img
          src="/images/profile-photo.png"
          alt="Album cover"
          loading="lazy"
          className="mobile-now-playing-cover"
        />
        <div className="mobile-now-playing-text">
          <span className="mobile-now-playing-label">Now Playing</span>
          <div className="mobile-now-playing-title-track">
            <span className={`mobile-now-playing-title ${isPlaying ? "" : "is-paused"}`}>
              Rohit Kuna&apos;s Portfolio
            </span>
          </div>
        </div>
      </div>

      <div className="mobile-now-playing-controls">
        <button type="button" className="mobile-now-playing-btn" aria-label="Previous">
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
        <button type="button" className="mobile-now-playing-btn" aria-label="Next">
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
