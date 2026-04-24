import { useState } from "react";
import { Lock, Crown, Eye, EyeOff } from "lucide-react";
import { useUserTier, type Tier, TIER_LABEL, TIER_COLOR } from "@/context/UserTierContext";

interface TierGateProps {
  children: React.ReactNode;
  minTier: Tier;
  label?: string;
  compact?: boolean;
}

export default function TierGate({ children, minTier, label, compact = false }: TierGateProps) {
  const { hasAccess } = useUserTier();
  const [revealed, setRevealed] = useState(false);

  if (hasAccess(minTier)) return <>{children}</>;

  const color  = TIER_COLOR[minTier];
  const tLabel = TIER_LABEL[minTier];

  return (
    <div className="relative rounded-xl overflow-hidden select-none">
      {/* Blurred content underneath */}
      <div
        style={{
          filter: revealed ? "blur(0px)" : "blur(22px)",
          transform: "scale(1.04)",
          transition: "filter .3s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      {/* Overlay */}
      {!revealed && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{ background: "rgba(4,5,14,.72)", backdropFilter: "blur(2px)" }}
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(${color},.3), rgba(${color},.15))`,
              border: `1px solid rgba(${color},.4)`,
              boxShadow: `0 0 18px rgba(${color},.25)`,
            }}
          >
            <Lock className="w-5 h-5" style={{ color: `rgb(${color})` }} />
          </div>

          {!compact && (
            <>
              <p className="text-sm font-bold text-white leading-tight">
                {label ?? `${tLabel} subscribers only`}
              </p>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: `rgba(${color},.15)`,
                  border: `1px solid rgba(${color},.3)`,
                  color: `rgb(${color})`,
                }}
              >
                <Crown className="w-3 h-3" />
                Upgrade to {tLabel} to unlock
              </div>
            </>
          )}

          {compact && (
            <p className="text-xs font-semibold" style={{ color: `rgb(${color})` }}>
              {tLabel}+
            </p>
          )}
        </div>
      )}

      {/* Peek button — top-right corner if already blurred but user wants a glimpse */}
      <button
        onClick={() => setRevealed(v => !v)}
        className="absolute top-2 right-2 p-1.5 rounded-full transition-all z-10"
        style={{
          background: "rgba(4,5,14,.75)",
          border: "1px solid rgba(255,255,255,.12)",
          backdropFilter: "blur(4px)",
        }}
        title={revealed ? "Hide content" : "Peek (upgrade to keep visible)"}
      >
        {revealed
          ? <EyeOff className="w-3.5 h-3.5 text-white/70" />
          : <Eye    className="w-3.5 h-3.5 text-white/50" />
        }
      </button>
    </div>
  );
}
