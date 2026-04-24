import { Play, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown, Music } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { formatTime } from "@/data/mockData";

/* ── Equalizer bars ─────────────────────────────────────────── */
const EQ = [
  { dur: ".5s",  del: "0s"   },
  { dur: ".7s",  del: ".1s"  },
  { dur: ".45s", del: ".2s"  },
  { dur: ".8s",  del: ".05s" },
  { dur: ".6s",  del: ".15s" },
  { dur: ".5s",  del: ".25s" },
  { dur: ".7s",  del: ".08s" },
  { dur: ".55s", del: ".18s" },
];

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2.5px] flex-shrink-0" style={{ height: 22 }}>
      {EQ.map((cfg, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full origin-bottom transition-all"
          style={{
            height: "100%",
            background: "linear-gradient(to top, var(--neon-blue), var(--neon-purple))",
            opacity:   playing ? 0.9 : 0.2,
            transform: playing ? undefined : "scaleY(0.15)",
            animation: playing ? `eqBar ${cfg.dur} ${cfg.del} ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Vinyl art ──────────────────────────────────────────────── */
function Vinyl({ src, alt, playing, size = 44 }: {
  src: string; alt: string; playing: boolean; size?: number;
}) {
  return (
    <div
      className="relative rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: size, height: size,
        animation: playing ? "spinSlow 5s linear infinite" : "none",
        boxShadow: playing
          ? `0 0 0 2px rgba(59,130,246,.5), 0 0 16px rgba(59,130,246,.4), 0 0 36px rgba(139,92,246,.15)`
          : `0 0 0 1.5px rgba(59,130,246,.15)`,
        transition: "box-shadow .4s",
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: size * 0.24, height: size * 0.24,
          background: "rgba(4,5,14,.95)",
          border: `1.5px solid rgba(59,130,246,.4)`,
        }}
      />
    </div>
  );
}

/* ── Main player ────────────────────────────────────────────── */
export default function MusicPlayer() {
  const {
    song, isPlaying, setIsPlaying, progress, setProgress,
    elapsed, settings, updateSettings, nextTrack, prevTrack,
  } = useMusic();

  const expanded = !settings.minimized;

  const bar = `linear-gradient(to right, var(--neon-blue) 0%, var(--neon-purple) ${progress}%, rgba(59,130,246,.12) ${progress}%)`;

  return (
    <div className="fixed left-0 right-0 z-40" style={{ top: 60 }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="glass-heavy overflow-hidden transition-all"
          style={{
            borderBottom: "1px solid rgba(59,130,246,.18)",
            borderLeft:   "1px solid rgba(59,130,246,.08)",
            borderRight:  "1px solid rgba(59,130,246,.08)",
          }}
        >
          {/* Expanded detail */}
          {expanded && (
            <div className="px-4 pt-4 pb-2 animate-fade-in">
              <div className="flex gap-4 mb-4 items-center">
                <Vinyl src={song.cover} alt={song.title} playing={isPlaying} size={64} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  <p className="text-[11px] text-muted-foreground/50 truncate mt-0.5">{song.album}</p>
                </div>
                <Equalizer playing={isPlaying} />
              </div>

              {/* Progress */}
              <div className="mb-2 space-y-1">
                <input
                  type="range"
                  min={0} max={100} value={progress}
                  onChange={e => setProgress(Number(e.target.value))}
                  className="music-range w-full h-1 rounded-full appearance-none"
                  style={{ background: bar }}
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{formatTime(elapsed)}</span>
                  <span>{formatTime(song.duration)}</span>
                </div>
              </div>

              {/* Volume inline indicator */}
              <div className="flex items-center gap-2 pb-1">
                <span className="text-[11px] text-muted-foreground">Vol</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,.12)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${settings.volume}%`,
                      background: "linear-gradient(to right, var(--neon-blue), var(--neon-purple))",
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground w-7 text-right">{settings.volume}%</span>
              </div>
            </div>
          )}

          {/* Controls bar */}
          <div className="flex items-center gap-3 px-4 h-14">
            {/* Compact: album + title */}
            {!expanded && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Vinyl src={song.cover} alt={song.title} playing={isPlaying} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate leading-tight">{song.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{song.artist}</p>
                </div>
                <Equalizer playing={isPlaying} />
              </div>
            )}

            {expanded && <div className="flex-1" />}

            {/* Playback controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={prevTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  boxShadow: isPlaying
                    ? "0 0 18px rgba(59,130,246,.7), 0 0 36px rgba(139,92,246,.3)"
                    : "0 0 10px rgba(59,130,246,.4)",
                }}
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-white" />
                  : <Play  className="w-4 h-4 text-white ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {!expanded && <Music className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />}

            {/* Expand / minimize toggle (synced to settings.minimized) */}
            <button
              onClick={() => updateSettings({ minimized: !settings.minimized })}
              className="p-1.5 text-muted-foreground hover:text-blue-400 transition-colors flex-shrink-0"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Mini progress bar */}
          {!expanded && (
            <div className="h-[2px]" style={{ background: "rgba(59,130,246,.08)" }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(to right, var(--neon-blue), var(--neon-purple))",
                  boxShadow: "0 0 6px rgba(59,130,246,.6)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
