/* ─────────────────────────────────────────────────────────────────────────
 *  wallet.ts  –  Placeholder wallet-connection layer for Chainster
 *
 *  This file is intentionally SDK-agnostic.  Replace the body of
 *  connectWallet() (and the helpers below) with your real SDK calls:
 *
 *    Dynamic.xyz:
 *      import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
 *      const { setShowAuthFlow } = useDynamicContext();
 *      setShowAuthFlow(true);
 *
 *    WalletConnect / wagmi:
 *      import { useConnect } from "wagmi";
 *      const { connect, connectors } = useConnect();
 *      connect({ connector: connectors[0] });
 *
 * ─────────────────────────────────────────────────────────────────────────*/

export type WalletState =
  | { status: "idle" }
  | { status: "connecting" }
  | { status: "connected"; address: string; chainId: number; balance: string }
  | { status: "error"; message: string };

let _state: WalletState = { status: "idle" };

const _listeners = new Set<(s: WalletState) => void>();

function setState(next: WalletState) {
  _state = next;
  _listeners.forEach(fn => fn(next));
}

export function getWalletState(): WalletState {
  return _state;
}

export function subscribeWallet(fn: (s: WalletState) => void): () => void {
  _listeners.add(fn);
  fn(_state);
  return () => _listeners.delete(fn);
}

/**
 * connectWallet()
 *
 * Replace this with your real SDK integration (Dynamic, WalletConnect, etc.)
 * The function must resolve to a connected address string or throw.
 */
export async function connectWallet(): Promise<string> {
  if (_state.status === "connected") return _state.address;

  setState({ status: "connecting" });

  try {
    /* ── PLACEHOLDER: simulate a wallet modal opening ─────────────────── */
    await new Promise(res => setTimeout(res, 1400));

    // Mock a random EVM address
    const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
    const address = `0x${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}`;
    /* ── END PLACEHOLDER ─────────────────────────────────────────────── */

    setState({
      status: "connected",
      address,
      chainId: 1,
      balance: (Math.random() * 4 + 0.1).toFixed(4) + " ETH",
    });

    return address;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    setState({ status: "error", message });
    throw err;
  }
}

export async function disconnectWallet(): Promise<void> {
  /* Replace with your SDK's disconnect call */
  await new Promise(res => setTimeout(res, 400));
  setState({ status: "idle" });
}

export function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
