import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import {
  ArrowLeft, Send, Video, VideoOff, Phone, PhoneOff,
  Search, MoreHorizontal, Mic, MicOff, Smile,
} from "lucide-react";
import { type Conversation, type ChatMessage } from "@/data/mockData";
import TierGate from "@/components/TierGate";

interface MessagesProps {
  conversations: Conversation[];
  onConversationsChange: Dispatch<SetStateAction<Conversation[]>>;
}

export default function Messages({ conversations, onConversationsChange }: MessagesProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [inCall, setInCall] = useState(false);
  const [callMuted, setCallMuted] = useState(false);
  const [callVideoOff, setCallVideoOff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = conversations.find(c => c.id === activeId) ?? null;
  const filtered = conversations.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, active?.messages.length]);

  function openChat(id: string) {
    setActiveId(id);
    onConversationsChange(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setInCall(false);
  }

  function sendMessage() {
    if (!input.trim() || !activeId) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onConversationsChange(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastTime: "just now" }
        : c
    ));
    setInput("");
  }

  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

  /* ── CALL OVERLAY ──────────────────────────────────────────── */
  if (inCall && active) {
    return (
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-between py-16 px-6"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,130,246,.15) 0%, rgba(4,5,14,.98) 60%)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Animated call rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/20"
              style={{
                width: 80 + i * 80,
                height: 80 + i * 80,
                animation: `callRing 2s ${i * 0.4}s ease-out infinite`,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10">
          <p className="text-sm text-blue-400/70 font-medium tracking-widest uppercase mb-1">Video Call</p>
          <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
        </div>

        <div className="flex flex-col items-center gap-4 z-10">
          <div
            className="w-28 h-28 rounded-full overflow-hidden"
            style={{
              border: "3px solid rgba(59,130,246,.5)",
              boxShadow: "0 0 0 6px rgba(59,130,246,.1), 0 0 40px rgba(59,130,246,.3)",
            }}
          >
            <img src={active.avatar} alt={active.username} className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{active.username}</h2>
            <p className="text-sm text-muted-foreground">{active.handle}</p>
            <div className="flex items-center gap-1.5 justify-center mt-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Connecting…</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10">
          <button
            onClick={() => setCallMuted(v => !v)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: callMuted ? "rgba(239,68,68,.15)" : "rgba(59,130,246,.12)",
              border: `1px solid ${callMuted ? "rgba(239,68,68,.3)" : "rgba(59,130,246,.25)"}`,
            }}
          >
            {callMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-blue-400" />}
          </button>

          <button
            onClick={() => setInCall(false)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 0 20px rgba(239,68,68,.5)",
            }}
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setCallVideoOff(v => !v)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: callVideoOff ? "rgba(239,68,68,.15)" : "rgba(59,130,246,.12)",
              border: `1px solid ${callVideoOff ? "rgba(239,68,68,.3)" : "rgba(59,130,246,.25)"}`,
            }}
          >
            {callVideoOff ? <VideoOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5 text-blue-400" />}
          </button>
        </div>
      </div>
    );
  }

  /* ── CHAT WINDOW ───────────────────────────────────────────── */
  if (active) {
    return (
      <div className="cs-page-fade flex flex-col" style={{ height: "calc(100vh - 134px)" }}>
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-1 pb-3 mb-1"
          style={{ borderBottom: "1px solid rgba(59,130,246,.10)" }}
        >
          <button
            onClick={() => setActiveId(null)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0">
            <img
              src={active.avatar}
              alt={active.username}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid rgba(59,130,246,.3)" }}
            />
            {active.online && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full"
                style={{ border: "2px solid rgba(4,5,14,.95)", boxShadow: "0 0 6px #4ade80" }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">{active.username}</p>
            <p className="text-xs text-muted-foreground">
              {active.online ? (
                <span className="text-green-400">Online</span>
              ) : "Offline"}
              {" · "}{active.handle}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setInCall(true)}
              className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                boxShadow: "0 0 12px rgba(59,130,246,.35)",
              }}
              title="Video call"
            >
              <Video className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setInCall(true)}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              title="Voice call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2 scrollbar-hide">
          {active.messages.map((msg, i) => {
            const isMe = msg.senderId === "me";
            const showAvatar = !isMe && (i === 0 || active.messages[i - 1].senderId !== msg.senderId);
            return (
              <div
                key={msg.id}
                className={`flex gap-2 items-end ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMe && (
                  <div className="w-7 flex-shrink-0">
                    {showAvatar && (
                      <img src={active.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                    )}
                  </div>
                )}
                <div className={`max-w-[72%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                  {msg.mediaUrl ? (
                    <div className="w-[220px]">
                      {msg.explicit ? (
                        <TierGate minTier="plus" label="Private content — Plus members only">
                          <img src={msg.mediaUrl} alt="Media" className="w-full rounded-2xl object-cover" style={{ maxHeight: 220 }} />
                        </TierGate>
                      ) : (
                        <img src={msg.mediaUrl} alt="Media" className="w-full rounded-2xl object-cover" style={{ maxHeight: 220, border: "1px solid rgba(59,130,246,.2)" }} />
                      )}
                      {msg.text && <p className="text-xs text-muted-foreground mt-1 px-1">{msg.text}</p>}
                    </div>
                  ) : (
                    <div
                      className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={isMe ? {
                        background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                        color: "#fff",
                        borderBottomRightRadius: "6px",
                        boxShadow: "0 2px 12px rgba(59,130,246,.3)",
                      } : {
                        background: "rgba(59,130,246,.08)",
                        border: "1px solid rgba(59,130,246,.14)",
                        color: "hsl(var(--foreground))",
                        borderBottomLeftRadius: "6px",
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                  <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="pt-3 mt-1"
          style={{ borderTop: "1px solid rgba(59,130,246,.10)" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.14)" }}
          >
            <button className="p-1.5 text-muted-foreground hover:text-blue-400 transition-colors flex-shrink-0">
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Message…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-2 rounded-xl transition-all disabled:opacity-30 flex-shrink-0"
              style={input.trim() ? {
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                boxShadow: "0 0 10px rgba(59,130,246,.35)",
              } : { background: "rgba(59,130,246,.08)" }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── CONVERSATION LIST ─────────────────────────────────────── */
  return (
    <div className="cs-page-fade space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text">Messages</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            boxShadow: "0 0 12px rgba(59,130,246,.35)",
          }}
        >
          + New
        </button>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
        style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.12)" }}
      >
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
        />
      </div>

      {/* Online now */}
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-2.5 px-1">Online Now</p>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide px-1">
          {conversations.filter(c => c.online).map(c => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="relative">
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="w-12 h-12 rounded-full object-cover transition-all group-hover:scale-105"
                  style={{ border: "2px solid rgba(59,130,246,.3)" }}
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full"
                  style={{ border: "2px solid rgba(4,5,14,.95)", boxShadow: "0 0 6px #4ade80" }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground truncate max-w-[52px] group-hover:text-foreground transition-colors">
                {c.username.split(" ")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-2.5 px-1">Recent</p>
        <div className="space-y-1">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all group"
              style={{ background: "rgba(59,130,246,.0)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,.07)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,.0)";
              }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="w-11 h-11 rounded-full object-cover"
                  style={{ border: "1.5px solid rgba(59,130,246,.25)" }}
                />
                {c.online && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full"
                    style={{ border: "2px solid rgba(4,5,14,.95)", boxShadow: "0 0 5px #4ade80" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={`text-sm font-semibold truncate ${c.unread > 0 ? "text-foreground" : "text-foreground/80"}`}>
                    {c.username}
                  </p>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">{c.lastTime}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs truncate ${c.unread > 0 ? "text-foreground/70" : "text-muted-foreground"}`}>
                    {c.lastMessage}
                  </p>
                  {c.unread > 0 && (
                    <span
                      className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))" }}
                    >
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div
              className="rounded-2xl px-4 py-7 text-center"
              style={{ background: "rgba(59,130,246,.04)", border: "1px solid rgba(59,130,246,.12)" }}
            >
              <p className="text-sm font-medium text-foreground">No conversations found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different name or handle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
