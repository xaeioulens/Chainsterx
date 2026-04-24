import { createContext, useContext, useState, type ReactNode } from "react";

export type Tier = "free" | "pro" | "plus" | "vip";

export const TIER_ORDER: Record<Tier, number> = {
  free: 0,
  pro:  1,
  plus: 2,
  vip:  3,
};

export const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  pro:  "Pro",
  plus: "Plus",
  vip:  "VIP",
};

export const TIER_COLOR: Record<Tier, string> = {
  free: "59,130,246",
  pro:  "139,92,246",
  plus: "236,72,153",
  vip:  "234,179,8",
};

interface UserTierContextValue {
  tier: Tier;
  setTier: (t: Tier) => void;
  hasAccess: (min: Tier) => boolean;
  canViewFeedExplicit: boolean;
  canViewChatExplicit: boolean;
}

const UserTierContext = createContext<UserTierContextValue>({
  tier: "free",
  setTier: () => {},
  hasAccess: () => false,
  canViewFeedExplicit: false,
  canViewChatExplicit: false,
});

export function UserTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>("free");

  function hasAccess(min: Tier) {
    return TIER_ORDER[tier] >= TIER_ORDER[min];
  }

  return (
    <UserTierContext.Provider value={{
      tier,
      setTier,
      hasAccess,
      canViewFeedExplicit:  TIER_ORDER[tier] >= TIER_ORDER["pro"],
      canViewChatExplicit:  TIER_ORDER[tier] >= TIER_ORDER["plus"],
    }}>
      {children}
    </UserTierContext.Provider>
  );
}

export function useUserTier() {
  return useContext(UserTierContext);
}
