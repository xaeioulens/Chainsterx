import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  rabbyWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { arcTestnet } from "./arcChain";

/**
 * WalletConnect project ID.
 * Get one free at https://cloud.walletconnect.com
 * Set VITE_WALLETCONNECT_PROJECT_ID in your .env to override.
 */
const projectId =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string) ||
  "chainsterx-dev-placeholder";

export const wagmiConfig = getDefaultConfig({
  appName:   "Chainsterx",
  projectId,
  chains:    [arcTestnet],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        rabbyWallet,
        coinbaseWallet,
      ],
    },
  ],
  ssr: false,
});
