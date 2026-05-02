import { useState, useMemo } from "react";
import { BadgeCheck, Edit3, Grid3x3, BarChart2, Copy, ExternalLink, Wallet, Zap, TrendingUp, Heart, Eye, Layers } from "lucide-react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { currentUser, formatCount } from "@/data/mockData";
import { shortenAddress } from "@/lib/wallet";
import { useUserTier, TIER_COLOR, TIER_LABEL } from "@/context/UserTierContext";
import { arcTestnet } from "@/lib/arcChain";

export default function Profile() {
  const [tab, setTab]         = useState<"posts" | "stats">("posts");
  const [copied, setCopied]   = useState(false);
  const [following, setFollowing] = useState(false);

  const { address, isConnected, isConnecting } = useAccount();
  const { data: balance } = useBalance({ address, chainId: arcTestnet.id });
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { tier } = useUserTier();
  const tierColor = TIER_COLOR[tier];

  function copyAddress() {
    if (!address) return;
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function openExplorer() {
    if (!address) return;
    window.open(`${arcTestnet.blockExplorers.default.url}/address/${address}`, "_blank", "noopener,noreferrer");
  }

  const balanceDisplay = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "—";

  const stats = [
    { label: "Posts",     value: formatCount(currentUser.posts) },
    { label: "Followers", value: formatCount(currentUser.followers) },
    { label: "Following", value: formatCount(currentUser.following) },
  ];

  const gridLikes = useMemo(
    () => currentUser.gridImages.map((_, i) => 50 + ((i * 137) % 900)),
    [],
  );

  const analyticsRows = [
    { icon: Heart,      label: "Total Likes",         value: "18.4K", pct: 78, color: "236,72,153" },
    { icon: TrendingUp, label: "Avg. Engagement",     value: "6.2%",  pct: 62, color: "59,130,246" },
    { icon: Eye,        label: "Profile Views (30d)", value: "9,210", pct: 55, color: "139,92,246" },
    { icon: Layers,     label: "NFTs Collected",      value: "14",    pct: 35, color: "234,179,8" },
  ];

  return (
    <div className="space-y-4 cs-page-fade">

      {/* Profile card */}
      <div className="glass-card rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.16)" }}>
        {/* Banner */}
        <div
          className="h-28 w-full relative"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,.3) 0%, rgba(139,92,246,.25) 50%, rgba(236,72,153,.2) 100%)" }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(59,130,246,.15) 0%, transparent 55%), radial-gradient(circle at 75% 50%, rgba(139,92,246,.15) 0%, transparent 55%)" }} />
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: `rgba(${tierColor},.2)`, border: `1px solid rgba(${tierColor},.4)`, color: `rgb(${tierColor})`, backdropFilter: "blur(8px)" }}
          >
            {TIER_LABEL[tier]}
          </div>
        </div>

        <div className="px-4 pb-4">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: "3px solid rgba(6,8,18,.95)", boxShadow: `0 0 0 2px rgba(${tierColor},.5), 0 0 24px rgba(${tierColor},.25)` }}
              />
              {currentUser.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--neon-blue)", boxShadow: "0 0 8px rgba(59,130,246,.8)" }}>
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setFollowing(v => !v)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={following ? { background: "transparent", border: "1px solid rgba(59,130,246,.35)", color: "rgba(96,165,250,1)" }
                  : { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", boxShadow: "0 0 14px rgba(59,130,246,.4)", color: "#fff" }}
              >
                {following ? "Following" : "Follow"}
              </button>
              <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-all" style={{ border: "1px solid rgba(59,130,246,.2)" }}>
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-foreground">{currentUser.username}</h2>
            {currentUser.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{currentUser.handle}</p>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{currentUser.bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {stats.map(s => (
              <div key={s.label} className="text-center py-3 rounded-xl" style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.1)" }}>
                <p className="text-lg font-extrabold gradient-text">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Wallet card */}
          <div className="rounded-xl p-3" style={{ background: "rgba(59,130,246,.05)", border: "1px solid rgba(59,130,246,.14)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-foreground">Wallet</span>
                {/* ARC Testnet badge */}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.25)", color: "rgb(96,165,250)" }}>
                  Arc Testnet
                </span>
              </div>
              {isConnected && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ boxShadow: "0 0 5px #4ade80" }} />
                  Connected
                </span>
              )}
            </div>

            {isConnected && address ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{shortenAddress(address)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={copyAddress} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={openExplorer} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copied && <p className="text-[11px] text-blue-400 animate-fade-in">Address copied!</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3 text-blue-400" />Arc Testnet
                  </div>
                  <span className="text-sm font-bold gradient-text">{balanceDisplay}</span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="w-full text-xs text-red-400 hover:text-red-300 py-1 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={openConnectModal}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", boxShadow: "0 0 14px rgba(59,130,246,.35)" }}
              >
                {isConnecting
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connecting…</>
                  : <><Wallet className="w-3.5 h-3.5" />Connect to Arc Testnet</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex glass-card rounded-2xl p-1" style={{ border: "1px solid rgba(59,130,246,.12)" }}>
        {(["posts", "stats"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
            style={tab === t ? { background: "linear-gradient(135deg, rgba(59,130,246,.22), rgba(139,92,246,.18))", border: "1px solid rgba(59,130,246,.3)", boxShadow: "0 0 12px rgba(59,130,246,.15)" } : {}}
          >
            {t === "posts" ? <Grid3x3 className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
            <span className="capitalize">{t}</span>
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {tab === "posts" && (
        <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden animate-fade-in">
          {currentUser.gridImages.map((img, i) => (
            <div key={i} className="post-grid-item relative aspect-square overflow-hidden group">
              <img src={img} alt={`Post ${i + 1}`} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
              <div className="post-grid-overlay absolute inset-0 opacity-0 transition-opacity duration-250 flex items-center justify-center gap-3" style={{ background: "rgba(4,5,14,.7)", backdropFilter: "blur(4px)" }}>
                <span className="flex items-center gap-1 text-sm font-bold text-white"><span className="text-pink-400">♥</span>{gridLikes[i]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics */}
      {tab === "stats" && (
        <div className="space-y-3 animate-fade-in">
          {analyticsRows.map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4" style={{ border: "1px solid rgba(59,130,246,.1)" }}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(${s.color},.12)` }}>
                    <s.icon className="w-3.5 h-3.5" style={{ color: `rgb(${s.color})` }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <span className="text-sm font-extrabold gradient-text">{s.value}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: `rgba(${s.color},.1)` }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: `linear-gradient(to right, rgb(${s.color}), rgba(${s.color},.6))`, boxShadow: `0 0 6px rgba(${s.color},.4)` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
