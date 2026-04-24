import { useState, useEffect, useMemo } from "react";
import {
  BadgeCheck, Link2, Edit3, Grid, BarChart2,
  Copy, ExternalLink, Wallet,
} from "lucide-react";
import { currentUser, formatCount } from "@/data/mockData";
import {
  connectWallet, disconnectWallet, subscribeWallet,
  shortenAddress, type WalletState,
} from "@/lib/wallet";

export default function Profile() {
  const [tab, setTab] = useState<"posts" | "stats">("posts");
  const [wallet, setWallet]     = useState<WalletState>({ status: "idle" });
  const [copied, setCopied]     = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => subscribeWallet(setWallet), []);

  function copyAddress() {
    if (wallet.status !== "connected") return;
    navigator.clipboard.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function openExplorer() {
    if (wallet.status !== "connected") return;
    window.open(`https://etherscan.io/address/${wallet.address}`, "_blank", "noopener,noreferrer");
  }

  const isConnected = wallet.status === "connected";

  const stats = [
    { label: "Posts",     value: formatCount(currentUser.posts) },
    { label: "Followers", value: formatCount(currentUser.followers) },
    { label: "Following", value: formatCount(currentUser.following) },
  ];
  const gridLikes = useMemo(
    () => currentUser.gridImages.map((_, i) => 50 + ((i * 137) % 900)),
    [],
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Profile card */}
      <div
        className="glass-card rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(59,130,246,.14)" }}
      >
        {/* Banner */}
        <div
          className="h-24 w-full relative"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,.25) 0%, rgba(139,92,246,.25) 50%, rgba(236,72,153,.15) 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 50%, rgba(59,130,246,.12) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(139,92,246,.12) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="px-4 pb-4">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-20 h-20 rounded-full object-cover"
                style={{
                  border: "3px solid rgba(6,8,18,.95)",
                  boxShadow: "0 0 0 2px rgba(59,130,246,.5), 0 0 24px rgba(59,130,246,.3)",
                }}
              />
              {currentUser.verified && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "var(--neon-blue)", boxShadow: "0 0 8px rgba(59,130,246,.8)" }}
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setFollowing(v => !v)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={following ? {
                  background: "transparent",
                  border: "1px solid rgba(59,130,246,.35)",
                  color: "rgba(96,165,250,1)",
                } : {
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  boxShadow: "0 0 14px rgba(59,130,246,.4)",
                  color: "#fff",
                }}
              >
                {following ? "Following" : "Follow"}
              </button>
              <button
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                style={{ border: "1px solid rgba(59,130,246,.2)" }}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name / handle */}
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{currentUser.username}</h2>
            {currentUser.verified && (
              <BadgeCheck className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{currentUser.handle}</p>
          <p className="text-sm text-foreground/85 leading-relaxed mb-4">{currentUser.bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {stats.map(s => (
              <div
                key={s.label}
                className="text-center py-3 rounded-xl"
                style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.1)" }}
              >
                <p className="text-lg font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Wallet section */}
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(59,130,246,.05)", border: "1px solid rgba(59,130,246,.12)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-foreground">Wallet</span>
              </div>
              {isConnected && wallet.status === "connected" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ boxShadow: "0 0 5px #4ade80" }} />
                  Connected
                </span>
              )}
            </div>

            {isConnected && wallet.status === "connected" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{shortenAddress(wallet.address)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={copyAddress}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
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
                {copied && <p className="text-[11px] text-blue-400 animate-fade-in">Address copied!</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Balance</span>
                  <span className="text-sm font-semibold gradient-text">{wallet.balance}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="w-full text-xs text-red-400 hover:text-red-300 py-1 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={wallet.status === "connecting"}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  boxShadow: "0 0 14px rgba(59,130,246,.35)",
                }}
              >
                {wallet.status === "connecting" ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    Connect Wallet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex glass-card rounded-2xl p-1"
        style={{ border: "1px solid rgba(59,130,246,.12)" }}
      >
        {(["posts", "stats"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            style={tab === t ? {
              background: "linear-gradient(135deg, rgba(59,130,246,.25), rgba(139,92,246,.25))",
              border: "1px solid rgba(59,130,246,.3)",
              boxShadow: "0 0 12px rgba(59,130,246,.15)",
            } : {}}
          >
            {t === "posts" ? <Grid className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
            <span className="capitalize">{t}</span>
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {tab === "posts" && (
        <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden animate-fade-in">
          {currentUser.gridImages.map((img, i) => (
            <div key={i} className="post-grid-item relative aspect-square overflow-hidden group">
              <img
                src={img}
                alt={`Post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
              />
              <div
                className="post-grid-overlay absolute inset-0 opacity-0 transition-opacity duration-250 flex items-center justify-center gap-3"
                style={{ background: "rgba(4,5,14,.7)", backdropFilter: "blur(4px)" }}
              >
                <span className="flex items-center gap-1 text-sm font-bold text-white">
                  <span className="text-pink-400">♥</span>
                  {gridLikes[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats view */}
      {tab === "stats" && (
        <div className="space-y-3 animate-fade-in">
          {[
            { label: "Total Likes Received",    value: "18.4K", pct: 78 },
            { label: "Avg. Engagement Rate",    value: "6.2%",  pct: 62 },
            { label: "Profile Views (30 days)", value: "9,210", pct: 55 },
            { label: "NFTs Collected",          value: "14",    pct: 35 },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4" style={{ border: "1px solid rgba(59,130,246,.1)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold gradient-text">{s.value}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(59,130,246,.1)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${s.pct}%`,
                    background: "linear-gradient(to right, var(--neon-blue), var(--neon-purple))",
                    boxShadow: "0 0 6px rgba(59,130,246,.5)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
