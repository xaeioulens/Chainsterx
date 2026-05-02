import { useMemo, useRef, useState } from "react";
import { Image, Video, Link2, Paperclip, Send, X, FileText } from "lucide-react";
import { feedPosts, currentUser, type Post } from "@/data/mockData";
import PostCard from "@/components/PostCard";
import { sanitizeUrl } from "@/lib/utils";

type MediaType = "image" | "video" | "url" | "file" | null;
type FeedFilter = "All" | "Following" | "Trending" | "NFT";

const FOLLOWING_IDS = new Set(["u1", "u2", "u3", "u5"]);
const NFT_TAGS = new Set(["nft", "onchainart", "musicnft", "web3music"]);

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
      case "Following":
        return posts.filter((post) => post.userId === "me" || FOLLOWING_IDS.has(post.userId));
      case "Trending":
        return posts.filter((post) => post.likes >= 300 || post.comments >= 80);
      case "NFT":
        return posts.filter((post) => post.tags.some((tag) => NFT_TAGS.has(tag.toLowerCase())));
      default:
        return posts;
    }
  }, [filter, posts]);

  async function readFileAsDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read selected file."));
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
        const previewUrl = await readFileAsDataUrl(file);
        setMediaPreview(previewUrl);
      }
    } catch {
      setMediaPreview(null);
      setFileName(null);
      setMediaType(null);
    }
    e.target.value = "";
  }

  function clearMedia() {
    setMediaPreview(null);
    setMediaType(null);
    setFileName(null);
    setLinkUrl("");
    setShowLink(false);
  }

  function toggleLink() {
    if (showLink) { clearMedia(); return; }
    clearMedia();
    setShowLink(true);
    setMediaType("url");
  }

  function submitPost() {
    if (!draft.trim() && !mediaPreview && !linkUrl) return;

    // Reject non-http(s) URLs before they enter state.
    const safeLink = mediaType === "url" ? sanitizeUrl(linkUrl) : null;
    if (mediaType === "url" && !safeLink) {
      // URL was provided but is unsafe — abort the post.
      return;
    }

    const tags = [...draft.matchAll(/#(\w+)/g)].map(m => m[1]);
    const newPost: Post = {
      id: Date.now().toString(),
      userId: "me",
      username: currentUser.username,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      timestamp: "just now",
      content: draft,
      likes: 0,
      comments: 0,
      liked: false,
      tags,
      ...(mediaType === "image" && mediaPreview ? { image: mediaPreview, mediaType: "image", mediaUrl: mediaPreview } : {}),
      ...(mediaType === "video" && mediaPreview ? { mediaType: "video", mediaUrl: mediaPreview } : {}),
      ...(mediaType === "url"  && safeLink       ? { mediaType: "url",   mediaUrl: safeLink } : {}),
      ...(mediaType === "file" && fileName       ? { mediaType: "file",  fileName } : {}),
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft("");
    clearMedia();
  }

  const hasMedia = !!(mediaPreview || (showLink && linkUrl) || (mediaType === "file" && fileName));

  return (
    <div className="space-y-4 cs-page-fade">
      {/* ── Compose box ─────────────────────────────────────── */}
      <div
        className="glass-card rounded-2xl p-4 transition-all"
        style={{ border: "1px solid rgba(59,130,246,.14)" }}
      >
        <div className="flex gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{ border: "1.5px solid rgba(59,130,246,.3)" }}
          />
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submitPost(); }}
              placeholder="What's on-chain today? Use #tags to categorize…"
              rows={2}
              className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none leading-relaxed"
            />

            {/* ── URL input ──────────────────────────────────── */}
            {showLink && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2 mt-1"
                style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.16)" }}
              >
                <Link2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
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

            {/* ── Image preview ──────────────────────────────── */}
            {mediaType === "image" && mediaPreview && (
              <div className="relative mt-2 mb-1 rounded-xl overflow-hidden inline-block">
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="max-h-48 w-auto rounded-xl object-cover"
                  style={{ border: "1px solid rgba(59,130,246,.2)" }}
                />
                <button
                  onClick={clearMedia}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ── Video preview ──────────────────────────────── */}
            {mediaType === "video" && mediaPreview && (
              <div className="relative mt-2 mb-1 rounded-xl overflow-hidden">
                <video
                  src={mediaPreview}
                  className="w-full max-h-48 rounded-xl object-cover"
                  controls
                  style={{ border: "1px solid rgba(139,92,246,.2)" }}
                />
                <button
                  onClick={clearMedia}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ── File chip ──────────────────────────────────── */}
            {mediaType === "file" && fileName && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2 mb-1 inline-flex"
                style={{ background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)" }}
              >
                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-foreground truncate max-w-[200px]">{fileName}</span>
                <button onClick={clearMedia} className="p-0.5 text-muted-foreground hover:text-red-400 transition-colors ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* ── Toolbar + counter + post button ────────────── */}
            <div
              className="flex items-center justify-between mt-2 pt-2"
              style={{ borderTop: "1px solid rgba(59,130,246,.08)" }}
            >
              <div className="flex items-center gap-0.5">
                {/* Image */}
                <button
                  onClick={() => pickFile("image", imgRef)}
                  title="Image"
                  className={`p-2 rounded-xl transition-all ${mediaType === "image" ? "text-blue-400 bg-blue-500/12" : "text-muted-foreground hover:text-blue-400 hover:bg-blue-500/8"}`}
                >
                  <Image className="w-4 h-4" />
                </button>
                {/* Video */}
                <button
                  onClick={() => pickFile("video", vidRef)}
                  title="Video"
                  className={`p-2 rounded-xl transition-all ${mediaType === "video" ? "text-purple-400 bg-purple-500/12" : "text-muted-foreground hover:text-purple-400 hover:bg-purple-500/8"}`}
                >
                  <Video className="w-4 h-4" />
                </button>
                {/* Link */}
                <button
                  onClick={toggleLink}
                  title="Link / URL"
                  className={`p-2 rounded-xl transition-all ${showLink ? "text-cyan-400 bg-cyan-500/12" : "text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/8"}`}
                >
                  <Link2 className="w-4 h-4" />
                </button>
                {/* File */}
                <button
                  onClick={() => pickFile("file", fileRef)}
                  title="File"
                  className={`p-2 rounded-xl transition-all ${mediaType === "file" ? "text-green-400 bg-green-500/12" : "text-muted-foreground hover:text-green-400 hover:bg-green-500/8"}`}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-mono transition-colors ${draft.length > 260 ? "text-red-400" : "text-muted-foreground"}`}>
                  {draft.length}/280
                </span>
                <button
                  onClick={submitPost}
                  disabled={(!draft.trim() && !hasMedia) || draft.length > 280}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                    boxShadow: (draft.trim() || hasMedia) ? "0 0 14px rgba(59,130,246,.4)" : "none",
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={imgRef}  type="file" accept="image/*"       className="hidden" onChange={e => handleFile(e, "image")} />
      <input ref={vidRef}  type="file" accept="video/*"       className="hidden" onChange={e => handleFile(e, "video")} />
      <input ref={fileRef} type="file"                        className="hidden" onChange={e => handleFile(e, "file")} />

      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            style={filter === f ? {
              background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
              boxShadow: "0 0 12px rgba(59,130,246,.35)",
            } : {
              background: "rgba(59,130,246,.06)",
              border: "1px solid rgba(59,130,246,.14)",
            }}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">{filteredPosts.length} posts</span>
      </div>

      {/* ── Post list ────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div
            className="glass-card rounded-2xl p-8 text-center"
            style={{ border: "1px solid rgba(59,130,246,.14)" }}
          >
            <p className="text-sm font-semibold text-foreground">Nothing in {filter} yet</p>
            <p className="text-xs text-muted-foreground mt-1">Try another filter or publish a new post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
