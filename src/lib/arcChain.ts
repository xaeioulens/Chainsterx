import { defineChain } from "viem";

/**
 * ARC Testnet
 * Chain ID: 5042002 (0x4CEF52)
 * Native gas token: USDC (18 decimals)
 * Docs: https://docs.arc.network/arc/references/connect-to-arc
 */
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http:      ["https://rpc.testnet.arc.network"],
      webSocket: ["wss://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url:  "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});
