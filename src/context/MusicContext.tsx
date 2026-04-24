import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";
import { playlist, type Song } from "@/data/mockData";

export interface MusicSettings {
  volume: number;
  autoPlay: boolean;
  minimized: boolean;
  repeatMode: "none" | "one" | "all";
}

interface MusicContextValue {
  currentIndex: number;
  song: Song;
  isPlaying: boolean;
  progress: number;
  settings: MusicSettings;
  elapsed: number;
  setCurrentIndex: (i: number) => void;
  setIsPlaying: (v: boolean) => void;
  setProgress: (v: number) => void;
  updateSettings: (patch: Partial<MusicSettings>) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (i: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [settings, setSettings] = useState<MusicSettings>({
    volume:     80,
    autoPlay:   false,
    minimized:  true,
    repeatMode: "none",
  });

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const song  = playlist[currentIndex];
  const elapsed = Math.floor((progress / 100) * song.duration);

  useEffect(() => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (settings.repeatMode === "one") return 0;
            if (settings.repeatMode === "all" || currentIndex < playlist.length - 1) {
              nextTrack();
              return 0;
            }
            setIsPlaying(false);
            if (timer.current) clearInterval(timer.current);
            return 100;
          }
          const nextProgress = p + (100 / song.duration) * 0.5;
          if (nextProgress >= 100) {
            return 100;
          }
          return nextProgress;
        });
      }, 500);
    } else {
      if (timer.current) clearInterval(timer.current);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [isPlaying, currentIndex, settings.repeatMode, song.duration]);

  function nextTrack() {
    setCurrentIndex(i => {
      if (settings.repeatMode === "all") return (i + 1) % playlist.length;
      return Math.min(i + 1, playlist.length - 1);
    });
    setProgress(0);
  }

  function prevTrack() {
    if (progress > 10) { setProgress(0); return; }
    setCurrentIndex(i => Math.max(i - 1, 0));
    setProgress(0);
  }

  function selectTrack(i: number) {
    setCurrentIndex(i);
    setProgress(0);
    setIsPlaying(true);
  }

  function updateSettings(patch: Partial<MusicSettings>) {
    setSettings(s => ({ ...s, ...patch }));
  }

  return (
    <MusicContext.Provider value={{
      currentIndex, song, isPlaying, progress, settings, elapsed,
      setCurrentIndex, setIsPlaying, setProgress, updateSettings,
      nextTrack, prevTrack, selectTrack,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be inside MusicProvider");
  return ctx;
}
