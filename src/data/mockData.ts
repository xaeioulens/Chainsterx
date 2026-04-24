export interface Post {
  id: string;
  userId: string;
  username: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  mediaType?: "image" | "video" | "url" | "file";
  mediaUrl?: string;
  fileName?: string;
  explicit?: boolean;
  likes: number;
  comments: number;
  liked: boolean;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  explicit?: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  username: string;
  handle: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export const conversations: Conversation[] = [
  {
    id: "c1",
    userId: "u1",
    username: "Maya Chen",
    handle: "@mayaonchain",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=0d0d1e",
    online: true,
    lastMessage: "Just sent you the NFT contract address 🔗",
    lastTime: "2m",
    unread: 3,
    messages: [
      { id: "m1", senderId: "u1", text: "Hey! Did you see the new drop on OpenSea?", timestamp: "10:12 AM" },
      { id: "m2", senderId: "me", text: "Yeah! The generative art collection looks insane", timestamp: "10:14 AM" },
      { id: "m3", senderId: "u1", text: "Right?! Gas was brutal though 😅", timestamp: "10:15 AM" },
      { id: "m4", senderId: "me", text: "Worth it. Already up 0.3 ETH", timestamp: "10:17 AM" },
      { id: "m5", senderId: "u1", text: "Just sent you the NFT contract address 🔗", timestamp: "10:20 AM" },
      { id: "m6", senderId: "u1", text: "Also sent you a private preview of my next piece 👀", timestamp: "10:21 AM" },
      { id: "m7", senderId: "u1", text: "", mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", explicit: true, timestamp: "10:21 AM" },
    ],
  },
  {
    id: "c2",
    userId: "u2",
    username: "Jordan Wei",
    handle: "@jw_defi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=0a0d1c",
    online: true,
    lastMessage: "L2 yields are looking crazy rn",
    lastTime: "18m",
    unread: 1,
    messages: [
      { id: "m1", senderId: "u2", text: "You still aping into Arbitrum?", timestamp: "9:30 AM" },
      { id: "m2", senderId: "me", text: "Every dip 😂 TVL is surging", timestamp: "9:32 AM" },
      { id: "m3", senderId: "u2", text: "L2 yields are looking crazy rn", timestamp: "9:45 AM" },
    ],
  },
  {
    id: "c3",
    userId: "u3",
    username: "Priya Nair",
    handle: "@priya_web3",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=0c0a1e",
    online: false,
    lastMessage: "Let me know when you launch the music NFT!",
    lastTime: "1h",
    unread: 0,
    messages: [
      { id: "m1", senderId: "me", text: "Working on something big in the music NFT space", timestamp: "Yesterday" },
      { id: "m2", senderId: "u3", text: "Ooh tell me more!", timestamp: "Yesterday" },
      { id: "m3", senderId: "me", text: "Royalties on-chain every resale 🔥", timestamp: "Yesterday" },
      { id: "m4", senderId: "u3", text: "Let me know when you launch the music NFT!", timestamp: "Yesterday" },
    ],
  },
  {
    id: "c4",
    userId: "u4",
    username: "Carlos Mendes",
    handle: "@cmendes_sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=080b1a",
    online: false,
    lastMessage: "SOL hitting those numbers again 🚀",
    lastTime: "3h",
    unread: 0,
    messages: [
      { id: "m1", senderId: "u4", text: "Solana TPS last night was insane", timestamp: "6:00 AM" },
      { id: "m2", senderId: "me", text: "65k TPS is no joke", timestamp: "6:05 AM" },
      { id: "m3", senderId: "u4", text: "SOL hitting those numbers again 🚀", timestamp: "7:00 AM" },
    ],
  },
  {
    id: "c5",
    userId: "u5",
    username: "Zoe Park",
    handle: "@zoebuilds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=0e0918",
    online: true,
    lastMessage: "Ship it! UX is the moat 💜",
    lastTime: "5h",
    unread: 0,
    messages: [
      { id: "m1", senderId: "me", text: "Finally abstracting seed phrases from my app", timestamp: "5:00 AM" },
      { id: "m2", senderId: "u5", text: "YESSS this is the way", timestamp: "5:02 AM" },
      { id: "m3", senderId: "me", text: "Going live next week 🤞", timestamp: "5:10 AM" },
      { id: "m4", senderId: "u5", text: "Ship it! UX is the moat 💜", timestamp: "5:15 AM" },
    ],
  },
];

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
}

export interface User {
  username: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  walletAddress: string;
  verified: boolean;
  gridImages: string[];
}

export const currentUser: User = {
  username: "Alex Rivera",
  handle: "@alexrivera",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=0a0a1a",
  bio: "Web3 explorer · Builder · Music is life 🎵 | Connecting chains, one block at a time ⛓️",
  followers: 12480,
  following: 892,
  posts: 241,
  walletAddress: "0x3F4b...9Ac1",
  verified: true,
  gridImages: [
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1644088379091-d574269d422f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1580287943255-5d5e0e4b7e6b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop",
  ],
};

export const feedPosts: Post[] = [
  {
    id: "1",
    userId: "u1",
    username: "Maya Chen",
    handle: "@mayaonchain",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=0d0d1e",
    timestamp: "2m ago",
    content: "Just minted my first generative art piece on-chain 🎨 The gas fees were wild but totally worth it. Who else is bullish on fully on-chain art?",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=320&fit=crop",
    explicit: true,
    likes: 284,
    comments: 47,
    liked: false,
    tags: ["NFT", "OnChainArt"],
  },
  {
    id: "2",
    userId: "u2",
    username: "Jordan Wei",
    handle: "@jw_defi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=0a0d1c",
    timestamp: "18m ago",
    content: "ETH just broke through $3,200 again. DeFi summer 2.0 vibes? The TVL numbers are looking really strong across L2s right now. 📈",
    likes: 512,
    comments: 93,
    liked: true,
    tags: ["ETH", "DeFi", "L2"],
  },
  {
    id: "3",
    userId: "u3",
    username: "Priya Nair",
    handle: "@priya_web3",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=0c0a1e",
    timestamp: "1h ago",
    content: "Been listening to music NFTs all morning — the idea that artists get a cut every time their song is resold is genuinely revolutionary. This changes everything for creators.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=320&fit=crop",
    explicit: true,
    likes: 198,
    comments: 31,
    liked: false,
    tags: ["MusicNFT", "Web3Music"],
  },
  {
    id: "4",
    userId: "u4",
    username: "Carlos Mendes",
    handle: "@cmendes_sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=080b1a",
    timestamp: "3h ago",
    content: "Solana's TPS during yesterday's NFT drop was insane. 65,000 transactions per second and fees were still near zero. The tech is there, now we just need the apps 🚀",
    likes: 743,
    comments: 118,
    liked: false,
    tags: ["Solana", "SOL"],
  },
  {
    id: "5",
    userId: "u5",
    username: "Zoe Park",
    handle: "@zoebuilds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=0e0918",
    timestamp: "5h ago",
    content: "Hot take: the best Web3 apps feel like Web2 apps. If your users need to understand gas, bridges, or seed phrases to get started — you've already lost them. UX is the final boss.",
    likes: 1247,
    comments: 203,
    liked: true,
    tags: ["Web3UX", "Builders"],
  },
];

export const playlist: Song[] = [
  {
    id: "s1",
    title: "Midnight Frequencies",
    artist: "Jordan Lee",
    album: "Digital Horizons",
    cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=80&h=80&fit=crop",
    duration: 214,
  },
  {
    id: "s2",
    title: "Neon Cascade",
    artist: "Aria Systems",
    album: "Synthwave Vol. 2",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
    duration: 187,
  },
  {
    id: "s3",
    title: "Block By Block",
    artist: "Chain Reaction",
    album: "Decentralized Beats",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop",
    duration: 243,
  },
  {
    id: "s4",
    title: "Zero Knowledge",
    artist: "Proof of Work",
    album: "Cryptographic",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=80&h=80&fit=crop",
    duration: 198,
  },
];

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
