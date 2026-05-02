/**
 * WalletButton — floating connect/status button.
 * Delegates all connection logic to RainbowKit's ConnectButton.
 */
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
  return (
    <div className="fixed right-4 bottom-24 sm:bottom-6 z-50">
      <ConnectButton
        accountStatus="address"
        chainStatus="icon"
        showBalance={true}
      />
    </div>
  );
}
