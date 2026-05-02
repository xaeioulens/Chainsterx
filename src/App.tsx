import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserTierProvider } from "@/context/UserTierContext";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { conversations as mockConversations, type Conversation } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import Profile from "@/components/Profile";
import Messages from "@/components/Messages";
import MenuDrawer from "@/components/MenuDrawer";

const queryClient = new QueryClient();

function AppShell() {
  const [tab, setTab] = useState("feed");
  const [menuOpen, setMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const unreadCount = conversations.reduce((total, convo) => total + convo.unread, 0);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="cs-bg">
        <div className="cs-orb-1" />
        <div className="cs-orb-2" />
        <div className="cs-orb-3" />
      </div>

      <div className="relative z-10">
        <Navbar
          activeTab={tab}
          onTabChange={setTab}
          unreadCount={unreadCount}
          onMenuOpen={() => setMenuOpen(true)}
        />

        <main
          className="max-w-2xl mx-auto px-4"
          style={{ paddingTop: 76, paddingBottom: 96 }}
        >
          {tab === "feed"     && <Feed />}
          {tab === "profile"  && <Profile />}
          {tab === "messages" && (
            <Messages
              conversations={conversations}
              onConversationsChange={setConversations}
            />
          )}
        </main>

        <MenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={t => { setTab(t); setMenuOpen(false); }}
        />
      </div>
    </div>
  );
}

const arcTheme = darkTheme({
  accentColor:          "#3b82f6",
  accentColorForeground: "#ffffff",
  borderRadius:         "large",
  fontStack:            "system",
  overlayBlur:          "large",
});

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={arcTheme} initialChain={5042002}>
          <TooltipProvider>
            <UserTierProvider>
              <AppShell />
            </UserTierProvider>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
