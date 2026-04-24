/**
 * WalletButton  — floating connect-wallet button.
 *
 * This is a standalone component you can drop anywhere.
 * The placeholder connectWallet() function in lib/wallet.ts
 * is ready to be swapped for Dynamic SDK or WalletConnect.
 */
import { useState, useEffect } from "react";
import { Wallet, X, Copy, ExternalLink, Zap } from "lucide-react";
import {
  connectWallet, disconnectWallet, subscribeWallet,
  shortenAddress, type WalletState,
} from "@/lib/wallet";

export default function WalletButton() {
  const [wallet, setWallet] = useState<WalletState>({ status: "idle" });
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => subscribeWallet(setWallet), []);

  const isConnected  = wallet.status === "connected";
  const isConnecting = wallet.status === "connecting";

  async function handleConnect() {
    try { await connectWallet(); } catch {}
  }

  function copyAddr() {
    if (wallet.status !== "connected") return;
    navigator.clipboard.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => isConnected ? setOpen(v => !v) : handleConnect()}
        disabled={isConnecting}
        className="fixed right-4 bottom-24 sm:bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
        style={{
          background: isConnected
            ? "linear-gradient(135deg, rgba(59,130,246,.3), rgba(139,92,246,.3))"
            : "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
          border: isConnected
            ? "1px solid rgba(59,130,246,.5)"
            : "1px solid rgba(59,130,246,.7)",
          boxShadow: isConnected
            ? "0 0 16px rgba(59,130,246,.35), 0 4px 20px rgba(0,0,0,.5)"
            : "0 0 22px rgba(59,130,246,.6), 0 0 44px rgba(139,92,246,.25), 0 4px 20px rgba(0,0,0,.5)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isConnecting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Connecting…</span>
          </>
        ) : isConnected && wallet.status === "connected" ? (
          <>
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px #4ade80" }} />
            <span className="font-mono text-xs">{shortenAddress(wallet.address)}</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Connected wallet sheet */}
      {open && isConnected && wallet.status === "connected" && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            className="fixed right-4 bottom-40 sm:bottom-20 z-50 w-72 rounded-2xl overflow-hidden animate-slide-up"
            style={{
              background: "rgba(4,5,14,.95)",
              border: "1px solid rgba(59,130,246,.3)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 40px rgba(59,130,246,.2), 0 20px 60px rgba(0,0,0,.6)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(59,130,246,.12)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px #4ade80" }} />
                <span className="text-sm font-semibold gradient-text">Wallet Connected</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address */}
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(59,130,246,.08)" }}>
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-foreground break-all leading-relaxed flex-1">
                  {wallet.address}
                </p>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={copyAddr} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {copied && <p className="text-[11px] text-blue-400 mt-1 animate-fade-in">Copied to clipboard!</p>}
            </div>

            {/* Balance / Network */}
            <div className="px-4 py-3 grid grid-cols-2 gap-3" style={{ borderBottom: "1px solid rgba(59,130,246,.08)" }}>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-sm font-bold gradient-text">{wallet.balance}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Network</p>
                <p className="text-sm font-semibold text-blue-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Ethereum
                </p>
              </div>
            </div>

            {/* Disconnect */}
            <div className="px-4 py-3">
              <button
                onClick={async () => { setOpen(false); await disconnectWallet(); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 transition-all"
                style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)" }}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
