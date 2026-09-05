export type WatchIdentity = "AMIR" | "KIMIA";

export type WatchEvent =
  | { type: "PLAY"; time: number; playbackRate: number; sentAt: number; userId: string }
  | { type: "PAUSE"; time: number; playbackRate: number; sentAt: number; userId: string }
  | { type: "SEEK"; time: number; playing: boolean; playbackRate: number; sentAt: number; userId: string }
  | { type: "SYNC"; time: number; playing: boolean; playbackRate: number; sentAt: number; userId: string }
  | { type: "REQUEST_SYNC"; sentAt: number; userId: string }
  | { type: "SOURCE_CHANGE"; url: string; title: string | null; sentAt: number; userId: string }
  | { type: "SUBTITLE_CHANGE"; sentAt: number; userId: string }
  | { type: "REACTION"; reaction: WatchReaction; sentAt: number; userId: string }
  | { type: "MESSAGE"; message: WatchMessageView; sentAt: number; userId: string };

export type WatchReaction = "love" | "laugh" | "surprised" | "sad" | "scared" | "angry" | "awkward" | "mindblown";

export type WatchMessageView = {
  id: string;
  message: string;
  createdAt: string;
  user: { id: string; identityKey: WatchIdentity; nameFa: string; nameEn: string };
};

export type WatchSessionView = {
  id: string;
  videoUrl: string | null;
  title: string | null;
  subtitleContent: string | null;
  subtitleType: string | null;
  subtitleLabel: string | null;
  subtitleLanguage: string | null;
  subtitleFileName: string | null;
  playing: boolean;
  currentTime: number;
  playbackRate: number;
  revision: number;
  updatedAt: string;
};
