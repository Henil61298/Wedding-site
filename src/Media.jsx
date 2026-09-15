import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";
import { wedding } from "./config.js";
export function useMediaAvailable(src, kind) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    setAvailable(false);
    if (!src) return;
    const controller = new AbortController();
    fetch(src, { method: "HEAD", signal: controller.signal })
      .then((r) =>
        setAvailable(
          r.ok && r.headers.get("content-type")?.startsWith(kind + "/"),
        ),
      )
      .catch(() => {});
    return () => controller.abort();
  }, [src, kind]);
  return available;
}
export function ChapterVideo({ active }) {
  const video = useRef(null);
  const available = useMediaAvailable(wedding.media.chapterVideo, "video");
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (active && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      el.play().catch(() => {});
    else el.pause();
  }, [active, available]);
  return (
    <div className="chapter-background" aria-hidden="true">
      {available ? (
        <video
          ref={video}
          src={wedding.media.chapterVideo}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/villa.png"
        />
      ) : (
        <img src="/villa.png" alt="" />
      )}
      <div className="chapter-shade" />
    </div>
  );
}
export function MusicPlayer() {
  const audio = useRef(null);
  const available = useMediaAvailable(wedding.media.music, "audio");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  async function toggle() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else
      try {
        await audio.current.play();
        setError(false);
      } catch {
        setError(true);
      }
  }
  return (
    <aside className="music-player" aria-label="Wedding music">
      {available && (
        <audio
          ref={audio}
          src={wedding.media.music}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setPlaying(false);
            setError(true);
          }}
        />
      )}
      <button
        className="music-toggle"
        onClick={toggle}
        disabled={!available}
        aria-label={
          available
            ? playing
              ? "Pause A Thousand Years"
              : "Play A Thousand Years"
            : "Wedding music coming soon"
        }
      >
        {playing ? <Pause size={16} /> : <Music2 size={16} />}
        <span>
          {available
            ? playing
              ? "Pause music"
              : "A Thousand Years"
            : "Music coming soon"}
        </span>
        {available && !playing && <Play size={12} />}
      </button>
      {error && (
        <p className="music-error" role="status">
          Music is unavailable. Please try again.
        </p>
      )}
    </aside>
  );
}
export function WeddingFilm() {
  const available = useMediaAvailable(wedding.media.film, "video");
  return (
    <section className="film-section" id="film">
      <p className="eyebrow">A LITTLE FILM, A LOT OF LOVE</p>
      <h2>
        Some moments
        <br />
        <i>deserve to be relived.</i>
      </h2>
      <div className="film-frame">
        {available ? (
          <video
            src={wedding.media.film}
            controls
            playsInline
            preload="metadata"
            poster="/portrait.png"
            aria-label="Henil and Vidhi's film"
          />
        ) : (
          <div className="film-coming">
            <img
              src="/portrait.png"
              alt="Henil and Vidhi together"
              loading="lazy"
            />
            <div>
              <Play size={34} strokeWidth={1} />
              <p>Our film is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
