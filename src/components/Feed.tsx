import { useMemo, useRef, useState } from "react";
import { Image, Video, Link2, Paperclip, Send, X, FileText, TrendingUp, Users, Sparkles, Hash } from "lucide-react";
import { feedPosts, currentUser, type Post } from "@/data/mockData";
import PostCard from "@/components/PostCard";
import { sanitizeUrl } from "@/lib/utils";

type MediaType = "image" | "video" | "url" | "file" | null;
type FeedFilter = "All" | "Following" | "Trending" | "NFT";

const FOLLOWING_IDS = new Set(["u1", "u2", "u3", "u5"]);
const NFT_TAGS = new Set(["nft", "onchainart", "musicnft", "web3music"]);

const FILTER_META: Record<FeedFilter, { icon: React.ElementType; color: string }> = {
  All:       { icon: Sparkles, color: "59,130,246" },
  Following: { icon: Users,    color: "139,92,246" },
  Trending:  { icon: TrendingUp, color: "236,72,153" },
  NFT:       { icon: Hash,     color: "234,179,8" },
};

export default function Feed() {
  const [posts, setPosts]           = useState<Post[]>(feedPosts);
  const [draft, setDraft]           = useState("");
  const [filter, setFilter]         = useState<FeedFilter>("All");
  const [mediaType, setMediaType]   = useState<MediaType>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [fileName, setFileName]     = useState<string | null>(null);
  const [linkUrl, setLinkUrl]       = useState("");
  const [showLink, setShowLink]     = useState(false);

  const imgRef  = useRef<HTMLInputElement>(null);
  const vidRef  = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filters: FeedFilter[] = ["All", "Following", "Trending", "NFT"];

  const filteredPosts = useMemo(() => {
    switch (filter) {
      case "Following": return posts.filter(p => p.userId === "me" || FOLLOWING_IDS.has(p.userId));
      case "Trending":  return posts.filter(p => p.likes >= 300 || p.comments >= 80);
      case "NFT":       return posts.filter(p => p.tags.some(t => NFT_TAGS.has(t.toLowerCase())));
      default:          return posts;
    }
  }, [filter, posts]);

  async function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }

  function pickFile(type: "image" | "video" | "file", ref: React.RefObject<HTMLInputElement | null>) {
    clearMedia();
    ref.current?.click();
    setMediaType(type);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "file") {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaType(type);
    setFileName(file.name);
    try {
      if (type === "image" || type === "video") {
        setMediaPreview(await readFileAsDataUrl(file));
      }
    } catch {
      setMediaPreview(null); setFileName(null); setMediaType(null);
    }
    e.target.value = "";
  }

  function clearMedia() {
    setMediaPreview(null); setMediaType(null); setFileName(null);
    setLinkUrl(""); setShowLink(false);
  }

  function toggleLink() {
    if (showLink) { clearMedia(); return; }
    clearMedia(); setShowLink(true); setMediaType("url");
  }

  function submitPost() {
    if (!draft.trim() && !mediaPreview && !linkUrl) return;
    const safeLink = mediaType === "url" ? sanitizeUrl(linkUrl) : null;
    if (mediaType === "url" && !safeLink) return;
    const tags = [...draft.matchAll(/#(\w+)/g)].map(m => m[1]);
    const newPost: Post = {
      id: Date.now().toString(),
      userId: "me",
      username: currentUser.username,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      timestamp: "just now",
      content: draft,
      likes: 0, comments: 0, liked: false, tags,
      ...(mediaType === "image" && mediaPreview ? { image: mediaPreview, mediaType: "image", mediaUrl: mediaPreview } : {}),
      ...(mediaType === "video" && mediaPreview ? { mediaType: "video", mediaUrl: mediaPreview } : {}),
      ...(mediaType === "url"  && safeLink       ? { mediaType: "url",   mediaUrl: safeLink } : {}),
      ...(mediaType === "file" && fileName       ? { mediaType: "file",  fileName } : {}),
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft(""); clearMedia();
  }

  const hasMedia = !!(mediaPreview || (showLink && linkUrl) || (mediaType === "file" && fileName));
  const overLimit = draft.length > 280;
  const charPct = Math.min((draft.length / 280) * 100, 100);

  return (
    <div className="space-y-5 cs-page-fade">

      {/* ── Compose box ─────────────────────────────────────── */}
      <div className="glass-card rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,.16)" }}>
        {/* Top bar */}
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
            style={{ border: "2px solid rgba(59,130,246,.3)" }}
          />
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submitPost(); }}
              placeholder="What's on-chain today? Use #tags…"
              rows={2}
              className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none leading-relaxed"
            />

            {/* URL input */}
            {showLink && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2 mt-1" style={{ background: "rgba(6,182,212,.06)", border: "1px solid rgba(6,182,212,.18)" }}>
                <Link2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="Paste a URL…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                  autoFocus
                />
              </div>
            )}

            {/* Image preview */}
            {mediaType === "image" && mediaPreview && (
              <div className="relative mt-2 mb-1 rounded-xl overflow-hidden inline-block">
                <img src={mediaPreview} alt="Preview" className="max-h-48 w-auto rounded-xl object-cover" style={{ border: "1px solid rgba(59,130,246,.2)" }} />
                <button onClick={clearMedia} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Video preview */}
            {mediaType === "video" && mediaPreview && (
              <div className="relative mt-2 mb-1 rounded-xl overflow-hidden">
                <video src={mediaPreview} className="w-full max-h-48 rounded-xl object-cover" controls style={{ border: "1px solid rgba(139,92,246,.2)" }} />
                <button onClick={clearMedia} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* File chip */}
            {mediaType === "file" && fileName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2 mb-1 inline-flex" style={{ background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)" }}>
                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-foreground truncate max-w-[200px]">{fileName}</span>
                <button onClick={clearMedia} className="p-0.5 text-muted-foreground hover:text-red-400 transition-colors ml-1"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(59,130,246,.08)" }}>
          <div className="flex items-center gap-0.5">
            {[
              { type: "image" as const, icon: Image,     ref: imgRef,  color: "59,130,246",  title: "Image" },
              { type: "video" as const, icon: Video,     ref: vidRef,  color: "139,92,246",  title: "Video" },
              { type: "file"  as const, icon: Paperclip, ref: fileRef, color: "74,222,128",  title: "File" },
            ].map(({ type, icon: Icon, ref, color, title }) => (
              <button
                key={type}
                onClick={() => pickFile(type, ref)}
                title={title}
                className="p-2 rounded-xl transition-all"
                style={mediaType === type
                  ? { color: `rgb(${color})`, background: `rgba(${color},.12)` }
                  : { color: "hsl(var(--muted-foreground))" }}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button
              onClick={toggleLink}
              title="Link"
              className="p-2 rounded-xl transition-all"
              style={showLink
                ? { color: "rgb(6,182,212)", background: "rgba(6,182,212,.12)" }
                : { color: "hsl(var(--muted-foreground))" }}
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Circular char counter */}
            <div className="relative w-6 h-6 flex-shrink-0">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(59,130,246,.12)" strokeWidth="2.5" />
                <circle
                  cx="12" cy="12" r="9" fill="none"
                  stroke={overLimit ? "rgb(248,113,113)" : "var(--neon-blue)"}
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 9}`}
                  strokeDashoffset={`${2 * Math.PI * 9 * (1 - charPct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset .2s, stroke .2s" }}
                />
              </svg>
              {draft.length > 240 && (
                <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${overLimit ? "text-red-400" : "text-muted-foreground"}`}>
                  {280 - draft.length}
                </span>
              )}
            </div>

            <button
              onClick={submitPost}
              disabled={(!draft.trim() && !hasMedia) || overLimit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                boxShadow: (draft.trim() || hasMedia) && !overLimit ? "0 0 16px rgba(59,130,246,.45)" : "none",
              }}
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={imgRef}  type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, "image")} />
      <input ref={vidRef}  type="file" accept="video/*" className="hidden" onChange={e => handleFile(e, "video")} />
      <input ref={fileRef} type="file"                  className="hidden" onChange={e => handleFile(e, "file")} />

      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => {
          const { icon: Icon, color } = FILTER_META[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={active ? {
                background: `linear-gradient(135deg, rgba(${color},.25), rgba(${color},.12))`,
                border: `1px solid rgba(${color},.4)`,
                color: `rgb(${color})`,
                boxShadow: `0 0 12px rgba(${color},.2)`,
              } : {
                background: "rgba(59,130,246,.05)",
                border: "1px solid rgba(59,130,246,.12)",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {f}
            </button>
          );
        })}
        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0 pr-1">{filteredPosts.length} posts</span>
      </div>

      {/* ── Post list ────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
        {filteredPosts.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center" style={{ border: "1px solid rgba(59,130,246,.12)" }}>
            <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">Nothing in {filter} yet</p>
            <p className="text-xs text-muted-foreground mt-1">Try another filter or publish a new post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
