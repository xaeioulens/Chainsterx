import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, FileText, ExternalLink, Play } from "lucide-react";
import { type Post, formatCount } from "@/data/mockData";
import TierGate from "@/components/TierGate";
import { sanitizeUrl } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post: initial }: PostCardProps) {
  const [post, setPost] = useState(initial);
  const [saved, setSaved] = useState(false);

  function toggleLike() {
    setPost(p => ({
      ...p,
      liked: !p.liked,
      likes: p.liked ? p.likes - 1 : p.likes + 1,
    }));
  }

  const mediaUrl = post.mediaUrl ?? post.image;

  return (
    <article
      className="glass-card rounded-2xl overflow-hidden cs-card-hover"
      style={{ animationDuration: ".25s" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="relative flex-shrink-0">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "1.5px solid rgba(59,130,246,.3)" }}
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
            style={{ borderColor: "rgba(6,8,18,.9)", boxShadow: "0 0 5px #4ade80" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{post.username}</p>
          <p className="text-xs text-muted-foreground">{post.handle} · {post.timestamp}</p>
        </div>
        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{post.content}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.tags.map(tag => (
                <span key={tag} className="tag-pill">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Image ─────────────────────────────────────────── */}
      {(post.mediaType === "image" || (!post.mediaType && post.image)) && mediaUrl && (
        <div className="px-4 pb-3">
          {post.explicit ? (
            <TierGate minTier="pro" label="Explicit content — Pro subscribers only">
              <img
                src={mediaUrl}
                alt="Post"
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: 280 }}
              />
            </TierGate>
          ) : (
            <img
              src={mediaUrl}
              alt="Post"
              className="w-full rounded-xl object-cover transition-transform hover:scale-[1.01]"
              style={{ maxHeight: 280, border: "1px solid rgba(59,130,246,.12)" }}
            />
          )}
        </div>
      )}

      {/* ── Video ─────────────────────────────────────────── */}
      {post.mediaType === "video" && mediaUrl && (
        <div className="px-4 pb-3">
          {post.explicit ? (
            <TierGate minTier="pro" label="Explicit content — Pro subscribers only">
              <video src={mediaUrl} className="w-full rounded-xl" style={{ maxHeight: 300, background: "#000" }} controls preload="metadata" />
            </TierGate>
          ) : (
            <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,.2)" }}>
              <video src={mediaUrl} className="w-full rounded-xl" style={{ maxHeight: 300, background: "#000" }} controls preload="metadata" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-1" style={{ background: "rgba(139,92,246,.7)", backdropFilter: "blur(4px)" }}>
                <Play className="w-2.5 h-2.5 fill-white" /> Video
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── URL link preview ──────────────────────────────── */}
      {post.mediaType === "url" && post.mediaUrl && sanitizeUrl(post.mediaUrl) && (
        <div className="px-4 pb-3">
          <a
            href={sanitizeUrl(post.mediaUrl)!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
            style={{
              background: "rgba(6,182,212,.06)",
              border: "1px solid rgba(6,182,212,.18)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(6,182,212,.15)" }}
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Link</p>
              <p className="text-sm text-cyan-400 truncate group-hover:underline">{post.mediaUrl}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </a>
        </div>
      )}

      {/* ── File attachment ───────────────────────────────── */}
      {post.mediaType === "file" && post.fileName && (
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.16)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,.15)" }}
            >
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">File attachment</p>
              <p className="text-sm text-foreground truncate font-medium">{post.fileName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-1 px-4 py-2.5 border-t"
        style={{ borderColor: "rgba(59,130,246,.08)" }}
      >
        {/* Like */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
            post.liked ? "text-pink-400" : "text-muted-foreground hover:text-pink-400 hover:bg-pink-500/8"
          }`}
        >
          <Heart
            className="w-4 h-4 transition-all"
            style={post.liked ? { fill: "#f472b6", filter: "drop-shadow(0 0 5px rgba(244,114,182,.7))" } : {}}
          />
          <span className="text-xs">{formatCount(post.likes)}</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-blue-400 hover:bg-blue-500/8 transition-all">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{formatCount(post.comments)}</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-purple-400 hover:bg-purple-500/8 transition-all">
          <Share2 className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Save */}
        <button
          onClick={() => setSaved(v => !v)}
          className={`p-2 rounded-xl transition-all ${
            saved ? "text-blue-400" : "text-muted-foreground hover:text-blue-400 hover:bg-blue-500/8"
          }`}
        >
          <Bookmark className="w-4 h-4" style={saved ? { fill: "currentColor" } : {}} />
        </button>
      </div>
    </article>
  );
}
