import { useState, useEffect } from "react";
import {
  X, User, Wallet, Settings, LogOut, ChevronRight, ChevronLeft,
  Bell, Shield, Moon, Palette, ExternalLink, Copy, Crown, Sparkles,
  Check, Zap, Link2, Globe, Lock, Eye, EyeOff, Smartphone, Info,
  HelpCircle, FileText, Star, MessageSquare, SlidersHorizontal,
} from "lucide-react";
import {
  connectWallet, disconnectWallet, subscribeWallet,
  shortenAddress, type WalletState,
} from "@/lib/wallet";
import { useUserTier, TIER_LABEL, TIER_COLOR, type Tier } from "@/context/UserTierContext";
import { currentUser } from "@/data/mockData";

type Panel = "main" | "wallet" | "settings" | "premium";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

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

export default function MenuDrawer({ open, onClose, onNavigate }: MenuDrawerProps) {
  const [panel, setPanel] = useState<Panel>("main");
  const [wallet, setWallet] = useState<WalletState>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const { tier: activeTier, setTier } = useUserTier();

  // settings state
  const [notifOn, setNotifOn] = useState(true);
  const [notifDMs, setNotifDMs] = useState(true);
  const [notifLikes, setNotifLikes] = useState(false);
  const [privacyOn, setPrivacyOn] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [neonOn, setNeonOn] = useState(true);
  const [compactOn, setCompactOn] = useState(false);

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

  // ── MAIN PANEL ──────────────────────────────────────────────
  const MainPanel = (
    <div className="flex flex-col h-full">
      {/* User identity header */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-14 h-14 rounded-2xl object-cover"
              style={{ border: "2px solid rgba(59,130,246,.3)", boxShadow: "0 0 16px rgba(59,130,246,.2)" }}
            />
            {isConnected && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                style={{ border: "2px solid rgba(4,5,14,.95)", boxShadow: "0 0 6px #4ade80" }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-sm text-foreground truncate">{currentUser.username}</p>
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
              <p className="text-[11px] text-blue-400 font-mono mt-0.5">{shortenAddress(wallet.address)}</p>
            )}
          </div>
        </div>

        {/* Wallet status */}
        {isConnected && wallet.status === "connected" ? (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.18)" }}
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ boxShadow: "0 0 5px #4ade80" }} />
            <span className="text-xs font-medium text-green-400">Wallet Connected</span>
            <span className="ml-auto text-xs text-green-400/70 font-semibold">{wallet.balance}</span>
          </div>
        ) : (
          <button
            onClick={async () => { try { await connectWallet(); } catch {} }}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", boxShadow: "0 0 12px rgba(59,130,246,.35)" }}
          >
            {isConnecting
              ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connecting…</>
              : <><Wallet className="w-3.5 h-3.5" />Connect Wallet</>}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {[
          { label: "Profile",  icon: User,     action: () => nav("profile"),      color: "59,130,246",  desc: "View your page" },
          { label: "Wallet",   icon: Wallet,   action: () => setPanel("wallet"),  color: "59,130,246",  desc: "Assets & NFTs" },
          { label: "Settings", icon: Settings, action: () => setPanel("settings"),color: "139,92,246",  desc: "Preferences & privacy" },
          { label: "Premium",  icon: Crown,    action: () => setPanel("premium"), color: "234,179,8",   desc: "Upgrade your plan" },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-foreground hover:text-white transition-all group"
            style={{ border: "1px solid transparent" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `rgba(${item.color},.08)`;
              (e.currentTarget as HTMLElement).style.borderColor = `rgba(${item.color},.18)`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${item.color},.10)`, border: `1px solid rgba(${item.color},.18)` }}
            >
              <item.icon className="w-4 h-4" style={{ color: `rgb(${item.color})` }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold leading-tight">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2" style={{ borderTop: "1px solid rgba(59,130,246,.08)" }}>
        <button
          onClick={() => { if (isConnected) disconnectWallet(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-red-400 hover:text-red-300 transition-all"
          style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,.08)" }}>
            <LogOut className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold leading-tight">Sign Out</p>
            <p className="text-[11px] text-red-400/60">Disconnect & exit</p>
          </div>
        </button>
      </div>
    </div>
  );
  // ── WALLET PANEL ────────────────────────────────────────────
  const WalletPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Wallet className="w-4 h-4 text-blue-400" />
        <h3 className="text-base font-bold gradient-text">Wallet</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isConnected && wallet.status === "connected" ? (
          <>
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
                    <button onClick={openExplorer} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
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
                  <p className="text-sm font-semibold text-blue-400 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />Ethereum</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(139,92,246,.05)", border: "1px solid rgba(139,92,246,.15)" }}>
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
          <div className="flex flex-col items-center justify-center gap-5 pt-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.15))", border: "1px solid rgba(59,130,246,.25)", boxShadow: "0 0 24px rgba(59,130,246,.15)" }}
            >
              <Wallet className="w-9 h-9 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold gradient-text mb-1">No Wallet Connected</p>
              <p className="text-sm text-muted-foreground max-w-xs">Connect your wallet to access assets, NFTs, and DeFi features.</p>
            </div>
            <button
              onClick={async () => { try { await connectWallet(); } catch {} }}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", boxShadow: "0 0 16px rgba(59,130,246,.4)" }}
            >
              {isConnecting
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connecting…</>
                : <><Wallet className="w-4 h-4" />Connect Wallet</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
  // ── SETTINGS PANEL ──────────────────────────────────────────
  const SettingsPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Settings className="w-4 h-4 text-purple-400" />
        <h3 className="text-base font-bold gradient-text">Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        {/* ── Appearance ── */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Appearance</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.12)" }}>
            {[
              { icon: Moon,        label: "Dark Mode",     desc: "Always on",          color: "96,165,250",  on: true,      setOn: () => {},        locked: true },
              { icon: Palette,     label: "Neon Accents",  desc: "Blue / purple theme",color: "236,72,153",  on: neonOn,    setOn: setNeonOn },
              { icon: SlidersHorizontal, label: "Compact View", desc: "Denser feed layout", color: "139,92,246", on: compactOn, setOn: setCompactOn },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(59,130,246,.07)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(${row.color},.12)` }}>
                    <row.icon className="w-3.5 h-3.5" style={{ color: `rgb(${row.color})` }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                  </div>
                </div>
                {row.locked
                  ? <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,.06)" }}>Always on</span>
                  : <Toggle on={row.on} onChange={row.setOn} />}
              </div>
            ))}
          </div>
        </section>

        {/* ── Notifications ── */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <Bell className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Notifications</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.12)" }}>
            {[
              { icon: Bell,        label: "Push Alerts",   desc: "In-app notifications",color: "59,130,246",  on: notifOn,   setOn: setNotifOn },
              { icon: MessageSquare, label: "Direct Messages", desc: "New DM alerts",    color: "59,130,246",  on: notifDMs,  setOn: setNotifDMs },
              { icon: Star,        label: "Likes & Replies",desc: "Engagement alerts",  color: "234,179,8",   on: notifLikes,setOn: setNotifLikes },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(59,130,246,.07)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(${row.color},.12)` }}>
                    <row.icon className="w-3.5 h-3.5" style={{ color: `rgb(${row.color})` }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                  </div>
                </div>
                <Toggle on={row.on} onChange={row.setOn} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Privacy & Security ── */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Privacy & Security</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,.15)" }}>
            {[
              { icon: EyeOff,  label: "Privacy Mode",    desc: "Hide wallet & activity", color: "139,92,246", on: privacyOn,    setOn: setPrivacyOn },
              { icon: Eye,     label: "Show Activity",   desc: "Visible to followers",   color: "139,92,246", on: showActivity, setOn: setShowActivity },
              { icon: Lock,    label: "2FA",             desc: "Coming soon",            color: "139,92,246", on: false,        setOn: () => {},       locked: true },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(139,92,246,.08)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(${row.color},.12)` }}>
                    <row.icon className="w-3.5 h-3.5" style={{ color: `rgb(${row.color})` }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                  </div>
                </div>
                {row.locked
                  ? <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,.08)" }}>Soon</span>
                  : <Toggle on={row.on} onChange={row.setOn} />}
              </div>
            ))}
          </div>
        </section>

        {/* ── Account ── */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Account</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(6,182,212,.15)" }}>
            {[
              { icon: Smartphone, label: "Connected Devices", desc: "Manage sessions",    color: "6,182,212" },
              { icon: Globe,      label: "Language",          desc: "English (US)",        color: "6,182,212" },
              { icon: FileText,   label: "Data & Export",     desc: "Download your data",  color: "6,182,212" },
            ].map((row, i, arr) => (
              <button
                key={row.label}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/3 transition-all"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(6,182,212,.08)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(${row.color},.12)` }}>
                    <row.icon className="w-3.5 h-3.5" style={{ color: `rgb(${row.color})` }} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground leading-tight">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* ── About ── */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">About</p>
          </div>
          <div className="rounded-2xl px-4 py-3 space-y-2" style={{ background: "rgba(59,130,246,.03)", border: "1px solid rgba(59,130,246,.08)" }}>
            {[
              { label: "Version",   value: "1.0.0" },
              { label: "Network",   value: "Ethereum Mainnet" },
              { label: "SDK",       value: "Dynamic / WalletConnect" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm text-foreground font-medium">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all" style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.1)" }}>
              <HelpCircle className="w-3.5 h-3.5" />Help
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all" style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.1)" }}>
              <FileText className="w-3.5 h-3.5" />Terms
            </button>
          </div>
        </section>

      </div>
    </div>
  );
  // ── PREMIUM PANEL ───────────────────────────────────────────
  type PlanDef = { id: Tier; badge?: string; monthly: string; annual: string; color: string; features: string[]; };
  const plans: PlanDef[] = [
    { id: "free",  monthly: "$0",   annual: "$0",   color: "59,130,246",  features: ["5 posts/day", "Basic wallet connect", "Public feed", "Explicit content blurred"] },
    { id: "pro",   monthly: "$5",   annual: "$55",  color: "139,92,246",  features: ["Unlimited posts", "Image & video uploads", "Priority feed", "DM anyone", "✓ View explicit feed content", "Custom profile badge"] },
    { id: "plus",  monthly: "$9.9", annual: "$99",  color: "236,72,153",  badge: "Most Popular", features: ["Everything in Pro", "✓ Private explicit chat media", "NFT portfolio analytics", "Chain-verified identity", "Video & voice calls"] },
    { id: "vip",   monthly: "$24",  annual: "$250", color: "234,179,8",   features: ["Everything in Plus", "AI content tools", "Early feature access", "Dedicated support", "Custom on-chain username"] },
  ];

  const PremiumPanel = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
        <button onClick={() => setPanel("main")} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Crown className="w-4 h-4 text-yellow-400" style={{ filter: "drop-shadow(0 0 5px rgba(234,179,8,.5))" }} />
        <h3 className="text-base font-bold gradient-text">Premium Plans</h3>
        <div className="ml-auto">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: `rgba(${TIER_COLOR[activeTier]},.15)`, border: `1px solid rgba(${TIER_COLOR[activeTier]},.3)`, color: `rgb(${TIER_COLOR[activeTier]})` }}
          >
            {TIER_LABEL[activeTier]}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Billing toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.12)" }}>
          {(["monthly", "annual"] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={billing === b ? { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", color: "#fff", boxShadow: "0 0 10px rgba(59,130,246,.3)" } : { color: "hsl(var(--muted-foreground))" }}
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
                border: isCurrent ? `2px solid rgba(${plan.color},.5)` : `1px solid rgba(${plan.color},.2)`,
                background: `rgba(${plan.color},.04)`,
                boxShadow: isCurrent ? `0 0 20px rgba(${plan.color},.15)` : "none",
              }}
            >
              {plan.badge && (
                <div className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ background: `linear-gradient(135deg, rgba(${plan.color},.25), rgba(${plan.color},.12))`, color: `rgb(${plan.color})` }}>
                  <Sparkles className="w-3 h-3" />{plan.badge}
                </div>
              )}
              {isCurrent && (
                <div className="flex items-center justify-center gap-1 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: `rgba(${plan.color},.12)`, color: `rgb(${plan.color})` }}>
                  <Check className="w-3 h-3" />Active Plan
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
                      <span className={`text-xs ${f.startsWith("✓") ? "font-semibold" : ""}`} style={{ color: f.startsWith("✓") ? `rgb(${plan.color})` : "hsl(var(--foreground) / .8)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => !isCurrent && setTier(plan.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[.98]"
                  style={isCurrent ? { background: `rgba(${plan.color},.10)`, border: `1px solid rgba(${plan.color},.25)`, color: `rgb(${plan.color})`, cursor: "default" }
                    : plan.id === "free" ? { background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.18)", color: "hsl(var(--muted-foreground))" }
                    : { background: `linear-gradient(135deg, rgba(${plan.color},1), rgba(${plan.color},.75))`, color: "#fff", boxShadow: `0 0 14px rgba(${plan.color},.4)` }}
                >
                  {isCurrent ? `✓ Active — ${TIER_LABEL[plan.id]}` : plan.id === "free" ? "Switch to Free" : `Activate ${TIER_LABEL[plan.id]}`}
                </button>
              </div>
            </div>
          );
        })}
        <p className="text-center text-[11px] text-muted-foreground/60 pt-1">Payments via crypto or card · Cancel anytime</p>
      </div>
    </div>
  );

  const panels: Record<Panel, JSX.Element> = {
    main: MainPanel,
    wallet: WalletPanel,
    settings: SettingsPanel,
    premium: PremiumPanel,
  };

  return (
    <>
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
      <div
        className="fixed top-0 right-0 h-full z-[70] w-80 max-w-[90vw] glass-heavy"
        style={{
          borderLeft:  "1px solid rgba(59,130,246,.2)",
          boxShadow:   open ? "-8px 0 40px rgba(0,0,0,.6), -4px 0 80px rgba(59,130,246,.1)" : "none",
          transform:   open ? "translateX(0)" : "translateX(100%)",
          transition:  "transform .32s cubic-bezier(.32,1,.36,1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-full overflow-hidden relative">
          {panels[panel]}
        </div>
      </div>
    </>
  );
}
