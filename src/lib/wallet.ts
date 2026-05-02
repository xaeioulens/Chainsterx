/**
 * wallet.ts — thin re-export layer over wagmi hooks.
 *
 * Components that previously used the placeholder connectWallet() /
 * subscribeWallet() API now import from here. The real connection UI
 * is handled by RainbowKit's <ConnectButton> / useConnectModal().
 */

export { useAccount, useBalance, useDisconnect } from "wagmi";
export { useConnectModal } from "@rainbow-me/rainbowkit";

/** Shorten a hex address to 0x1234…abcd */
export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}
