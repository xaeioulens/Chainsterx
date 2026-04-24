import { useState, useEffect } from "react";
import {
  X, User, Wallet, Music2, Settings, LogOut, ChevronRight, ChevronLeft,
  Volume2, VolumeX, Repeat, SkipForward, Zap, Link2, Bell, Shield,
  Moon, Palette, ExternalLink, Copy, Crown, Sparkles, Check,
} from "lucide-react";
import {
  connectWallet, disconnectWallet, subscribeWallet,
  shortenAddress, type WalletState,
} from "@/lib/wallet";
import { useMusic } from "@/context/MusicContext";
import { useUserTier, TIER_LABEL, TIER_COLOR, type Tier } from "@/context/UserTierContext";
import { currentUser, formatTime, playlist } from "@/data/mockData";

type Panel = "main" | "wallet" | "music" | "settings" | "premium";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

/* ── small toggle component ──────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{
        background: on
          ? "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))"
          : "rgba(59,130,246,.12)",
        border: on ? "1px solid rgba(59,130,246,.5)" : "1px solid rgba(59,130,246,.2)",
        boxShadow: on ? "0 0 10px rgba(59,130,246,.35)" : "none",
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? "calc(100% - 21px)" : "2px" }}
      />
    </button>
  );
}

/* ── volume slider ───────────────────────────────────────────── */
function VolumeSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range"
      min={0} max={100}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="music-range w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, var(--neon-blue) ${value}%, rgba(59,130,246,.15) ${value}%)`,
      }}
    />
  );
}

export default function MenuDrawer({ open, onClose, onNavigate }: MenuDrawerProps) {
  const [panel, setPanel]           = useState<Panel>("main");
  const [wallet, setWallet]         = useState<WalletState>({ status: "idle" });
  const [copied, setCopied]         = useState(false);
  const [billing, setBilling]       = useState<"monthly" | "annual">("monthly");
  const music    = useMusic();
  const { tier: activeTier, setTier } = useUserTier();

  useEffect(() => subscribeWallet(setWallet), []);
  useEffect(() => { if (!open) setTimeout(() => setPanel("main"), 300); }, [open]);

  const isConnected  = wallet.status === "connected";
  const isConnecting = wallet.status === "connecting";

  function copyAddr() {
    if (wallet.status !== "connected") return;
    navigator.clipboard.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openExplorer() {
    if (wallet.status !== "connected") return;
    window.open(`https://etherscan.io/address/${wallet.address}`, "_blank", "noopener,noreferrer");
  }

  function nav(tab: string) { onNavigate(tab); onClose(); }

  /* ── PANEL: MAIN ─────────────────────────────────────────── */
  const MainPanel = (
    <div className="flex flex-col h-full">
      {/* Header – user identity */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full object-cover"
              style={{ border: "2px solid rgba(59,130,246,.35)" }}
            />
            {isConnected && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full"
                style={{ border: "2px solid rgba(4,5,14,.95)", boxShadow: "0 0 6px #4ade80" }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-foreground">{currentUser.username}</p>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: `rgba(${TIER_COLOR[activeTier]},.15)`,
                  color: `rgb(${TIER_COLOR[activeTier]})`,
                  border: `1px solid rgba(${TIER_COLOR[activeTier]},.3)`,
                }}
              >
                {TIER_LABEL[activeTier]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{currentUser.handle}</p>
            {isConnected && wallet.status === "connected" && (
              <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                {shortenAddress(wallet.address)}
              </p>
            )}
          </div>
        </div>

        {/* Wallet status pill */}
        {isConnected && wallet.status === "connected" ? (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)" }}
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ boxShadow: "0 0 5px #4ade80" }} />
            <span className="text-xs font-medium text-green-400">Wallet Connected</span>
            <span className="ml-auto text-xs text-green-400/70 font-semibold">{wallet.balance}</span>
          </div>
        ) : (
          <button
            onClick={async () => { try { await connectWallet(); } catch {} }}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
              boxShadow: "0 0 12px rgba(59,130,246,.35)",
            }}
          >
            {isConnecting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connecting…</>
            ) : (
              <><Wallet className="w-3.5 h-3.5" />Connect Wallet</>
            )}
          </button>
        )}
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {[
          { label: "Profile",                icon: User,     action: () => nav("profile"),       color: "59,130,246" },
          { label: "Wallet",                 icon: Wallet,   action: () => setPanel("wallet"),   color: "59,130,246" },
          { label: "Music Player Settings",  icon: Music2,   action: () => setPanel("music"),    color: "59,130,246" },
          { label: "General Settings",       icon: Settings, action: () => setPanel("settings"), color: "59,130,246" },
          { label: "Premium",                icon: Crown,    action: () => setPanel("premium"),  color: "234,179,8" },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-foreground hover:text-white transition-all group"
            style={{ background: "rgba(59,130,246,.0)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,.09)";
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59,130,246,.18)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,.0)";
              (e.currentTarget as HTMLElement).style.border = "none";
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${item.color},.10)`, border: `1px solid rgba(${item.color},.16)` }}
            >
              <item.icon className="w-4 h-4" style={{ color: `rgb(${item.color})` }} />
            </div>
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2" style={{ borderTop: "1px solid rgba(59,130,246,.08)" }}>
        <button
          onClick={() => { if (isConnected) disconnectWallet(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:text-red-300 transition-all"
          style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,.08)" }}>
            <LogOut className="w-4 h-4" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  /* ── PANEL: WALLET ───────────────────────────────────────── */
  const WalletPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold gradient-text">Wallet</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isConnected && wallet.status === "connected" ? (
          <>
            {/* Connected state */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.2)" }}>
              <div className="px-4 py-3" style={{ background: "rgba(59,130,246,.06)", borderBottom: "1px solid rgba(59,130,246,.12)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 5px #4ade80" }} />
                  <span className="text-xs font-semibold text-green-400">Connected</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs text-foreground break-all leading-relaxed">{wallet.address}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={copyAddr} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={openExplorer}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copied && <p className="text-[11px] text-blue-400 mt-1 animate-fade-in">Copied!</p>}
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="text-base font-bold gradient-text">{wallet.balance}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <p className="text-sm font-semibold text-blue-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Ethereum
                  </p>
                </div>
              </div>
            </div>

            {/* NFT count */}
            <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(59,130,246,.05)", border: "1px solid rgba(59,130,246,.12)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,.15)" }}>
                  <Link2 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">NFTs Owned</p>
                  <p className="text-xs text-muted-foreground">Across all chains</p>
                </div>
              </div>
              <span className="text-lg font-bold gradient-text">14</span>
            </div>

            <button
              onClick={async () => { await disconnectWallet(); }}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-red-400 hover:text-red-300 transition-all"
              style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)" }}
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          /* Not connected */
          <div className="flex flex-col items-center justify-center gap-5 pt-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.15))",
                border: "1px solid rgba(59,130,246,.25)",
                boxShadow: "0 0 24px rgba(59,130,246,.15)",
              }}
            >
              <Wallet className="w-9 h-9 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold gradient-text mb-1">No Wallet Connected</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Connect your wallet to access assets, NFTs, and DeFi features.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Ready for Dynamic SDK or WalletConnect
              </p>
            </div>
            <button
              onClick={async () => { try { await connectWallet(); } catch {} }}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                boxShadow: "0 0 16px rgba(59,130,246,.4)",
              }}
            >
              {isConnecting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connecting…</>
              ) : (
                <><Wallet className="w-4 h-4" />Connect Wallet</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ── PANEL: MUSIC SETTINGS ───────────────────────────────── */
  const MusicPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold gradient-text">Music Player</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Now playing */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.14)" }}
        >
          <img
            src={music.song.cover}
            alt={music.song.title}
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            style={{ boxShadow: music.isPlaying ? "0 0 12px rgba(59,130,246,.5)" : "none" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{music.song.title}</p>
            <p className="text-xs text-muted-foreground truncate">{music.song.artist}</p>
            <p className="text-[11px] text-muted-foreground/50">{formatTime(music.elapsed)} / {formatTime(music.song.duration)}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${music.isPlaying ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-white/5"}`}>
            {music.isPlaying ? "Playing" : "Paused"}
          </span>
        </div>

        {/* Volume */}
        <div className="rounded-2xl px-4 py-4 space-y-3" style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.10)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {music.settings.volume === 0
                ? <VolumeX className="w-4 h-4 text-muted-foreground" />
                : <Volume2 className="w-4 h-4 text-blue-400" />}
              <span className="text-sm font-medium text-foreground">Volume</span>
            </div>
            <span className="text-sm font-bold gradient-text">{music.settings.volume}%</span>
          </div>
          <VolumeSlider
            value={music.settings.volume}
            onChange={v => music.updateSettings({ volume: v })}
          />
        </div>

        {/* Toggles */}
        {[
          {
            label:    "Auto-play",
            desc:     "Automatically play next track",
            key:      "autoPlay" as const,
            icon:     SkipForward,
          },
          {
            label:    "Minimized player",
            desc:     "Keep player compact by default",
            key:      "minimized" as const,
            icon:     Music2,
          },
        ].map(row => (
          <div
            key={row.key}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.10)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,.10)" }}>
                <row.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-[11px] text-muted-foreground">{row.desc}</p>
              </div>
            </div>
            <Toggle
              on={music.settings[row.key] as boolean}
              onChange={v => music.updateSettings({ [row.key]: v })}
            />
          </div>
        ))}

        {/* Repeat mode */}
        <div
          className="px-4 py-3.5 rounded-2xl"
          style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.10)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,.10)" }}>
              <Repeat className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-foreground">Repeat Mode</p>
          </div>
          <div className="flex gap-2">
            {(["none", "one", "all"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => music.updateSettings({ repeatMode: mode })}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
                style={music.settings.repeatMode === mode ? {
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(59,130,246,.4)",
                } : {
                  background: "rgba(59,130,246,.06)",
                  border: "1px solid rgba(59,130,246,.14)",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.12)" }}>
          <div className="px-4 py-2.5" style={{ background: "rgba(59,130,246,.06)", borderBottom: "1px solid rgba(59,130,246,.10)" }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Playlist</p>
          </div>
          {playlist.map((s, i) => (
            <button
              key={s.id}
              onClick={() => music.selectTrack(i)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                background: i === music.currentIndex ? "rgba(59,130,246,.10)" : "transparent",
                borderBottom: i < playlist.length - 1 ? "1px solid rgba(59,130,246,.06)" : "none",
              }}
            >
              <img src={s.cover} alt={s.title} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm font-medium truncate ${i === music.currentIndex ? "gradient-text" : "text-foreground"}`}>
                  {s.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{s.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatTime(s.duration)}</span>
              {i === music.currentIndex && music.isPlaying && (
                <span className="flex items-end gap-[2px] h-4">
                  {[1,2,3].map(b => (
                    <span
                      key={b}
                      className="w-[2.5px] rounded-full origin-bottom"
                      style={{
                        height: "100%",
                        background: "var(--neon-blue)",
                        animation: `eqBar .${4+b}s ${b*0.08}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── PANEL: GENERAL SETTINGS ─────────────────────────────── */
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [privacyOn,       setPrivacyOn]       = useState(false);
  const [neonOn,          setNeonOn]          = useState(true);

  const settingsRows = [
    { icon: Bell,    label: "Notifications",   desc: "Push and in-app alerts",    color: "59,130,246",  on: notificationsOn, setOn: setNotificationsOn },
    { icon: Shield,  label: "Privacy Mode",    desc: "Hide wallet & activity",    color: "139,92,246",  on: privacyOn,       setOn: setPrivacyOn },
    { icon: Moon,    label: "Dark Mode",       desc: "Always on for Web3 vibes",  color: "96,165,250",  on: true,            setOn: () => {}, locked: true },
    { icon: Palette, label: "Neon Accent",     desc: "Blue / Purple theme",       color: "236,72,153",  on: neonOn,          setOn: setNeonOn },
  ];

  const SettingsPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold gradient-text">General Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {settingsRows.map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
              style={{ background: `rgba(${row.color},.04)`, border: `1px solid rgba(${row.color},.12)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `rgba(${row.color},.12)` }}>
                  <row.icon className="w-4 h-4" style={{ color: `rgb(${row.color})` }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                </div>
              </div>
              {row.locked
                ? <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,.06)" }}>Always on</span>
                : <Toggle on={row.on} onChange={row.setOn} />
              }
            </div>
          ))}

        <div
          className="px-4 py-4 rounded-2xl space-y-1"
          style={{ background: "rgba(59,130,246,.03)", border: "1px solid rgba(59,130,246,.08)" }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">About</p>
          {[
            { label: "Version",     value: "1.0.0" },
            { label: "Network",     value: "Ethereum Mainnet" },
            { label: "SDK Ready",   value: "Dynamic / WalletConnect" },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="text-sm text-foreground font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── PANEL: PREMIUM ──────────────────────────────────────── */
  type PlanDef = { id: Tier; badge?: string; monthly: string; annual: string; color: string; features: string[]; };
  const plans: PlanDef[] = [
    {
      id: "free",
      monthly: "$0", annual: "$0",
      color: "59,130,246",
      features: [
        "5 posts/day",
        "Basic wallet connect",
        "Public feed",
        "Music player",
        "Explicit content blurred",
      ],
    },
    {
      id: "pro",
      monthly: "$5", annual: "$55",
      color: "139,92,246",
      features: [
        "Unlimited posts",
        "Image & video uploads",
        "Priority feed",
        "DM anyone",
        "✓ View explicit feed content",
        "Custom profile badge",
        "HD music streaming",
      ],
    },
    {
      id: "plus",
      badge: "Most Popular",
      monthly: "$9.9", annual: "$99.9",
      color: "236,72,153",
      features: [
        "Everything in Pro",
        "✓ Private explicit chat media",
        "NFT portfolio analytics",
        "Chain-verified identity",
        "Video & voice calls",
        "Boosted posts",
      ],
    },
    {
      id: "vip",
      monthly: "$24", annual: "$250",
      color: "234,179,8",
      features: [
        "Everything in Plus",
        "AI content tools",
        "Early feature access",
        "Dedicated support",
        "Custom on-chain username",
        "Revenue share program",
      ],
    },
  ];

  const PremiumPanel = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-400" style={{ filter: "drop-shadow(0 0 5px rgba(234,179,8,.5))" }} />
          <h3 className="text-base font-bold gradient-text">Premium Plans</h3>
        </div>
        {/* Current tier badge */}
        <div className="ml-auto">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: `rgba(${TIER_COLOR[activeTier]},.15)`,
              border: `1px solid rgba(${TIER_COLOR[activeTier]},.3)`,
              color: `rgb(${TIER_COLOR[activeTier]})`,
            }}
          >
            {TIER_LABEL[activeTier]}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Billing toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-2xl"
          style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.12)" }}
        >
          {(["monthly", "annual"] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={billing === b ? {
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                color: "#fff",
                boxShadow: "0 0 10px rgba(59,130,246,.3)",
              } : { color: "hsl(var(--muted-foreground))" }}
            >
              {b}{b === "annual" && <span className="ml-1 text-green-400 text-[10px]">Save 20%</span>}
            </button>
          ))}
        </div>

        {plans.map(plan => {
          const isCurrent = activeTier === plan.id;
          const price = billing === "monthly" ? plan.monthly : plan.annual;
          const period = billing === "monthly" ? "/mo" : "/yr";
          return (
            <div
              key={plan.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                border: isCurrent
                  ? `2px solid rgba(${plan.color},.5)`
                  : `1px solid rgba(${plan.color},.2)`,
                background: `rgba(${plan.color},.04)`,
                boxShadow: isCurrent ? `0 0 20px rgba(${plan.color},.15)` : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                  style={{ background: `linear-gradient(135deg, rgba(${plan.color},.25), rgba(${plan.color},.12))`, color: `rgb(${plan.color})` }}
                >
                  <Sparkles className="w-3 h-3" /> {plan.badge}
                </div>
              )}
              {isCurrent && (
                <div
                  className="flex items-center justify-center gap-1 py-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: `rgba(${plan.color},.12)`, color: `rgb(${plan.color})` }}
                >
                  <Check className="w-3 h-3" /> Active Plan
                </div>
              )}

              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-base text-foreground">{TIER_LABEL[plan.id]}</p>
                  <div className="text-right">
                    <span className="text-xl font-bold" style={{ color: `rgb(${plan.color})` }}>{price}</span>
                    <span className="text-xs text-muted-foreground">{period}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${plan.color},.15)` }}>
                        <Check className="w-2.5 h-2.5" style={{ color: `rgb(${plan.color})` }} />
                      </div>
                      <span className={`text-xs ${f.startsWith("✓") ? "font-semibold" : ""}`} style={{ color: f.startsWith("✓") ? `rgb(${plan.color})` : "hsl(var(--foreground) / .8)" }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !isCurrent && setTier(plan.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[.98]"
                  style={isCurrent ? {
                    background: `rgba(${plan.color},.10)`,
                    border: `1px solid rgba(${plan.color},.25)`,
                    color: `rgb(${plan.color})`,
                    cursor: "default",
                  } : plan.id === "free" ? {
                    background: "rgba(59,130,246,.06)",
                    border: "1px solid rgba(59,130,246,.18)",
                    color: "hsl(var(--muted-foreground))",
                  } : {
                    background: `linear-gradient(135deg, rgba(${plan.color},1), rgba(${plan.color},.75))`,
                    color: "#fff",
                    boxShadow: `0 0 14px rgba(${plan.color},.4)`,
                  }}
                >
                  {isCurrent ? `✓ Active — ${TIER_LABEL[plan.id]}` : plan.id === "free" ? "Switch to Free" : `Activate ${TIER_LABEL[plan.id]}`}
                </button>
              </div>
            </div>
          );
        })}

        <p className="text-center text-[11px] text-muted-foreground/60 pt-1">
          Payments via crypto or card · Cancel anytime
        </p>
      </div>
    </div>
  );

  const panels: Record<Panel, JSX.Element> = {
    main:     MainPanel,
    wallet:   WalletPanel,
    music:    MusicPanel,
    settings: SettingsPanel,
    premium:  PremiumPanel,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background:     open ? "rgba(0,0,0,.65)" : "transparent",
          backdropFilter: open ? "blur(4px)" : "none",
          pointerEvents:  open ? "all" : "none",
          opacity:        open ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[70] w-80 max-w-[90vw] glass-heavy"
        style={{
          borderLeft:   "1px solid rgba(59,130,246,.2)",
          boxShadow:    open ? "-8px 0 40px rgba(0,0,0,.6), -4px 0 80px rgba(59,130,246,.1)" : "none",
          transform:    open ? "translateX(0)" : "translateX(100%)",
          transition:   "transform .32s cubic-bezier(.32,1,.36,1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Panel content with slide transition */}
        <div className="h-full overflow-hidden relative">
          {panels[panel]}
        </div>
      </div>
    </>
  );
}
