import { useState, useEffect } from "react";
import { Home, User, MessageSquare, Settings, Zap } from "lucide-react";
import { subscribeWallet, type WalletState } from "@/lib/wallet";
import { currentUser } from "@/data/mockData";
import { useUserTier, TIER_COLOR, TIER_LABEL } from "@/context/UserTierContext";

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
  const { tier } = useUserTier();

  useEffect(() => subscribeWallet(setWallet), []);

  const isConnected = wallet.status === "connected";
  const tierColor = TIER_COLOR[tier];

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 glass-heavy"
        style={{ borderBottom: "1px solid rgba(59,130,246,.15)" }}
      >
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between" style={{ height: 64 }}>

          {/* Logo */}
          <button
            onClick={() => onTabChange("feed")}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                boxShadow: "0 0 18px rgba(59,130,246,.5), 0 0 36px rgba(139,92,246,.2)",
              }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-xl font-extrabold gradient-text hidden sm:block"
              style={{ letterSpacing: "-0.03em" }}
            >
              Chainster
            </span>
          </button>

          {/* Desktop nav pills */}
          <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={activeTab === id ? {
                  background: "linear-gradient(135deg, rgba(59,130,246,.18), rgba(139,92,246,.12))",
                  border: "1px solid rgba(59,130,246,.3)",
                  boxShadow: "0 0 14px rgba(59,130,246,.18)",
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

          {/* Right: tier badge + settings icon + avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: `rgba(${tierColor},.12)`,
                border: `1px solid rgba(${tierColor},.28)`,
                color: `rgb(${tierColor})`,
              }}
            >
              {TIER_LABEL[tier]}
            </span>

            <button
              onClick={onMenuOpen}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-blue-400 transition-all"
              style={{ border: "1px solid rgba(59,130,246,.15)" }}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button onClick={onMenuOpen} className="relative group" aria-label="Open menu">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-9 h-9 rounded-full object-cover transition-all group-hover:scale-105"
                style={{
                  border: isConnected
                    ? "2px solid rgba(74,222,128,.5)"
                    : `2px solid rgba(${tierColor},.4)`,
                  boxShadow: isConnected
                    ? "0 0 0 1px rgba(74,222,128,.2), 0 0 10px rgba(74,222,128,.15)"
                    : `0 0 0 1px rgba(${tierColor},.1)`,
                }}
              />
              {isConnected && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full"
                  style={{ border: "1.5px solid rgba(4,5,14,.95)", boxShadow: "0 0 5px #4ade80" }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 sm:hidden glass-heavy z-50"
        style={{ borderTop: "1px solid rgba(59,130,246,.15)" }}
      >
        <div className="flex items-center justify-around px-2 h-16">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === id ? "text-blue-400" : "text-muted-foreground"
              }`}
            >
              <Icon
                className="w-5 h-5"
                style={activeTab === id ? { filter: "drop-shadow(0 0 6px rgba(59,130,246,.8))" } : {}}
              />
              {id === "messages" && unreadCount > 0 && (
                <span
                  className="absolute top-1 right-2 w-2 h-2 rounded-full"
                  style={{ background: "var(--neon-blue)", boxShadow: "0 0 4px var(--neon-blue)" }}
                />
              )}
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}

          <button
            onClick={onMenuOpen}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-muted-foreground transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}
