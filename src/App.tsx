import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/context/MusicContext";
import { UserTierProvider } from "@/context/UserTierContext";
import { conversations as mockConversations, type Conversation } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
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
      {/* ── Animated Web3 background ─────────────────────── */}
      <div className="cs-bg">
        <div className="cs-orb-1" />
        <div className="cs-orb-2" />
        <div className="cs-orb-3" />
      </div>

      {/* ── App content ──────────────────────────────────── */}
      <div className="relative z-10">
        {/* Fixed top: navbar (60px) + music player (~56px compact) */}
        <Navbar
          activeTab={tab}
          onTabChange={setTab}
          unreadCount={unreadCount}
          onMenuOpen={() => setMenuOpen(true)}
        />
        <MusicPlayer />

        {/* Main scrollable area */}
        <main
          className="max-w-2xl mx-auto px-4"
          style={{ paddingTop: 134, paddingBottom: 96 }}
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

        {/* Slide-in menu drawer */}
        <MenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={t => { setTab(t); setMenuOpen(false); }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserTierProvider>
          <MusicProvider>
            <AppShell />
          </MusicProvider>
        </UserTierProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
