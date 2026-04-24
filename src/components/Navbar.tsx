import { useState, useEffect } from "react";
import { Home, User, Link2, Menu, MessageSquare } from "lucide-react";
import { subscribeWallet, type WalletState } from "@/lib/wallet";
import { currentUser } from "@/data/mockData";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  onMenuOpen: () => void;
}

const NAV_ITEMS = [
  { id: "feed",     label: "Home",     icon: Home },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile",  label: "Profile",  icon: User },
];

export default function Navbar({ activeTab, onTabChange, unreadCount, onMenuOpen }: NavbarProps) {
  const [wallet, setWallet] = useState<WalletState>({ status: "idle" });

  useEffect(() => subscribeWallet(setWallet), []);

  const isConnected = wallet.status === "connected";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass-heavy"
      style={{ borderBottom: "1px solid rgba(59,130,246,.18)" }}
    >
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between gap-4" style={{ height: 60 }}>

        {/* ── Logo ────────────────────────────────────────── */}
        <button
          onClick={() => onTabChange("feed")}
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--neon-blue) 0%, var(--neon-purple) 100%)",
              boxShadow: "0 0 14px rgba(59,130,246,.5), 0 0 28px rgba(139,92,246,.2)",
            }}
          >
            <Link2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block" style={{ letterSpacing: "-0.02em" }}>
            Chainster
          </span>
        </button>

        {/* ── Desktop nav ─────────────────────────────────── */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              style={activeTab === id ? {
                background: "rgba(59,130,246,.12)",
                border: "1px solid rgba(59,130,246,.25)",
                boxShadow: "0 0 12px rgba(59,130,246,.15)",
              } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === "messages" && unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Right: avatar + menu button ─────────────────── */}
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="Open menu"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full object-cover transition-all group-hover:scale-105"
              style={{
                border: isConnected
                  ? "2px solid rgba(74,222,128,.5)"
                  : "2px solid rgba(59,130,246,.3)",
                boxShadow: isConnected
                  ? "0 0 0 1px rgba(74,222,128,.2), 0 0 10px rgba(74,222,128,.15)"
                  : "none",
              }}
            />
            {isConnected && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full"
                style={{ border: "1.5px solid rgba(4,5,14,.95)", boxShadow: "0 0 5px #4ade80" }}
              />
            )}
          </div>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:bg-white/8"
            style={{ border: "1px solid rgba(59,130,246,.2)" }}
          >
            <Menu className="w-4 h-4 text-foreground" />
          </div>
        </button>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 sm:hidden glass-heavy"
        style={{ borderTop: "1px solid rgba(59,130,246,.18)", zIndex: 50 }}
      >
        <div className="flex items-center justify-around px-2 h-16">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                activeTab === id ? "text-blue-400" : "text-muted-foreground"
              }`}
            >
              <Icon
                className="w-5 h-5"
                style={activeTab === id ? { filter: "drop-shadow(0 0 6px rgba(59,130,246,.8))" } : {}}
              />
              {id === "messages" && unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "var(--neon-blue)", boxShadow: "0 0 4px var(--neon-blue)" }}
                />
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}

          <button
            onClick={onMenuOpen}
            className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-muted-foreground transition-all relative"
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {isConnected && (
                <span
                  className="absolute -top-0.5 -right-1 w-2 h-2 bg-green-400 rounded-full"
                  style={{ border: "1px solid rgba(4,5,14,.95)", boxShadow: "0 0 4px #4ade80" }}
                />
              )}
            </div>
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
