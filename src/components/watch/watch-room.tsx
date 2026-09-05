"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import {
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaPlayerInstance,
} from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/icons";
import type {
  WatchEvent,
  WatchIdentity,
  WatchMessageView,
  WatchReaction,
  WatchSessionView,
} from "@/lib/watch-events";
import { useApp } from "@/providers/app-provider";

type WatchUser = {
  id: string;
  identityKey: WatchIdentity;
  nameFa: string;
  nameEn: string;
  coupleId: string;
};

type PresenceMember = {
  userId: string;
  identityKey: WatchIdentity;
  nameFa: string;
  nameEn: string;
  onlineAt: string;
};

type FloatingReaction = { id: string; reaction: WatchReaction; mine: boolean };

const reactionGlyph: Record<WatchReaction, string> = {
  love: "❤️",
  laugh: "😂",
  surprised: "😮",
  sad: "😢",
  scared: "😱",
  angry: "😤",
  awkward: "😬",
  mindblown: "🤯",
};

const reactionLabels: Record<WatchReaction, { fa: string; en: string }> = {
  love: { fa: "عاشقش شدم", en: "Love it" },
  laugh: { fa: "خنده‌دار", en: "Funny" },
  surprised: { fa: "غافلگیر شدم", en: "Surprised" },
  sad: { fa: "غمگین", en: "Sad" },
  scared: { fa: "ترسیدم", en: "Scared" },
  angry: { fa: "عصبانی", en: "Angry" },
  awkward: { fa: "وای نه", en: "Awkward" },
  mindblown: { fa: "ترکوند", en: "Mind blown" },
};

const sourceType = (url: string) => url.split("?")[0]?.toLowerCase().endsWith(".m3u8")
  ? "application/x-mpegurl"
  : undefined;

const watchTimeFormatters = {
  fa: new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Tehran",
  }),
  en: new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Tehran",
  }),
};

export function WatchRoom({
  initialSession,
  initialMessages,
  currentUser,
  realtimeConfigured,
}: {
  initialSession: WatchSessionView;
  initialMessages: WatchMessageView[];
  currentUser: WatchUser;
  realtimeConfigured: boolean;
}) {
  const { locale, theme, toast } = useApp();
  const isFa = locale === "fa";
  const reduced = useReducedMotion();
  const playerRef = useRef<MediaPlayerInstance>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const applyingRemote = useRef(false);
  const controller = useRef(false);
  const currentTime = useRef(initialSession.currentTime);
  const playing = useRef(initialSession.playing);
  const playbackRate = useRef(initialSession.playbackRate);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedSource = useRef<string | null>(null);
  const messageEnd = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const fullscreenRef = useRef(false);
  const fullscreenChatOpenRef = useRef(false);

  const [session, setSession] = useState(initialSession);
  const [messages, setMessages] = useState(initialMessages);
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [connection, setConnection] = useState<"connecting" | "online" | "offline" | "unconfigured">(
    realtimeConfigured ? "connecting" : "unconfigured",
  );
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [sourceOpen, setSourceOpen] = useState(!initialSession.videoUrl);
  const [notice, setNotice] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [subtitleOpen, setSubtitleOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenChatOpen, setFullscreenChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageNotice, setMessageNotice] = useState<WatchMessageView | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const userName = isFa ? currentUser.nameFa : currentUser.nameEn;
  const partnerName = isFa
    ? currentUser.identityKey === "AMIR" ? "کیمیا" : "امیر"
    : currentUser.identityKey === "AMIR" ? "Kimia" : "Amir";

  const persistState = useCallback(async () => {
    if (!session.videoUrl) return;
    await fetch("/api/watch/state", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentTime: Math.max(0, currentTime.current),
        playing: playing.current,
        playbackRate: playbackRate.current,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [session.videoUrl]);

  const broadcast = useCallback(async (event: WatchEvent) => {
    await channelRef.current?.send({ type: "broadcast", event: "watch_event", payload: event });
  }, []);

  const releaseRemoteLock = useCallback(() => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(() => { applyingRemote.current = false; }, 450);
  }, []);

  const applyPlayback = useCallback(async (event: Extract<WatchEvent, { type: "PLAY" | "PAUSE" | "SEEK" | "SYNC" }>) => {
    const player = playerRef.current;
    if (!player || event.userId === currentUser.id) return;
    applyingRemote.current = true;
    controller.current = false;
    const expected = event.time + ((event.type === "PLAY" || ("playing" in event && event.playing))
      ? Math.max(0, Date.now() - event.sentAt) / 1000 * event.playbackRate
      : 0);
    const drift = expected - player.currentTime;

    if (event.type === "SYNC" && Math.abs(drift) >= 0.4 && Math.abs(drift) <= 1.5 && !reduced) {
      player.playbackRate = event.playbackRate * (drift > 0 ? 1.05 : 0.95);
      if (correctionTimer.current) clearTimeout(correctionTimer.current);
      correctionTimer.current = setTimeout(() => {
        if (playerRef.current) playerRef.current.playbackRate = event.playbackRate;
      }, 2800);
    } else if (event.type !== "SYNC" || Math.abs(drift) > 1.5) {
      player.currentTime = Math.max(0, expected);
      player.playbackRate = event.playbackRate;
    }

    const shouldPlay = event.type === "PLAY" || ("playing" in event && event.playing);
    try {
      if (shouldPlay) await player.play();
      else await player.pause();
      setNotice(null);
    } catch {
      setNotice(isFa ? `برای پیوستن به پخش ${partnerName}، یک‌بار روی پخش بزن.` : `Press play once to join ${partnerName}'s playback.`);
    } finally {
      releaseRemoteLock();
    }
  }, [currentUser.id, isFa, partnerName, reduced, releaseRemoteLock]);

  const addReaction = useCallback((reaction: WatchReaction, mine: boolean) => {
    const id = crypto.randomUUID();
    setReactions((items) => [...items.slice(-5), { id, reaction, mine }]);
    window.setTimeout(() => setReactions((items) => items.filter((item) => item.id !== id)), 2200);
  }, []);

  const playMessageSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext;
      const context = audioContext.current ?? new AudioContextClass();
      audioContext.current = context;
      if (context.state === "suspended") void context.resume();
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
      gain.connect(context.destination);
      [660, 880].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start(context.currentTime + index * 0.09);
        oscillator.stop(context.currentTime + 0.24 + index * 0.09);
      });
    } catch { /* Audio is an enhancement and may be blocked by the browser. */ }
  }, [soundEnabled]);

  const handleRemoteEvent = useCallback((event: WatchEvent) => {
    if (!event || event.userId === currentUser.id) return;
    if (["PLAY", "PAUSE", "SEEK", "SYNC"].includes(event.type)) {
      void applyPlayback(event as Extract<WatchEvent, { type: "PLAY" | "PAUSE" | "SEEK" | "SYNC" }>);
      return;
    }
    if (event.type === "REQUEST_SYNC" && controller.current && playerRef.current) {
      void broadcast({
        type: "SYNC",
        time: playerRef.current.currentTime,
        playing: !playerRef.current.paused,
        playbackRate: playerRef.current.playbackRate,
        sentAt: Date.now(),
        userId: currentUser.id,
      });
    }
    if (event.type === "SOURCE_CHANGE") {
      applyingRemote.current = true;
      controller.current = false;
      initializedSource.current = null;
      setSession((value) => ({ ...value, videoUrl: event.url, title: event.title, currentTime: 0, playing: false, subtitleContent: null, subtitleType: null, subtitleLabel: null, subtitleLanguage: null, subtitleFileName: null }));
      setSourceOpen(false);
      setMediaError(null);
      releaseRemoteLock();
    }
    if (event.type === "SUBTITLE_CHANGE") {
      void fetch("/api/watch/subtitle", { cache: "no-store" })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then(({ subtitle }) => setSession((value) => ({ ...value, ...subtitle })))
        .catch(() => undefined);
    }
    if (event.type === "REACTION") addReaction(event.reaction, false);
    if (event.type === "MESSAGE") {
      setMessages((items) => items.some((item) => item.id === event.message.id) ? items : [...items, event.message].slice(-100));
      playMessageSound();
      if (fullscreenRef.current && !fullscreenChatOpenRef.current) {
        setUnreadCount((count) => count + 1);
        setMessageNotice(event.message);
      }
    }
  }, [addReaction, applyPlayback, broadcast, currentUser.id, playMessageSound, releaseRemoteLock]);

  useEffect(() => {
    if (!realtimeConfigured) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    let active = true;
    let tokenRefreshTimer: ReturnType<typeof setInterval> | null = null;

    async function refreshRealtimeToken() {
      const tokenResponse = await fetch("/api/watch/realtime-token", { cache: "no-store" });
      if (!tokenResponse.ok) throw new Error("token");
      const { token } = await tokenResponse.json() as { token: string };
      supabase.realtime.setAuth(token);
    }

    async function connect() {
      await refreshRealtimeToken();
      tokenRefreshTimer = setInterval(() => {
        void refreshRealtimeToken().catch(() => active && setConnection("offline"));
      }, 4 * 60 * 1000);
      const channel = supabase.channel(`watch:${currentUser.coupleId}`, {
        config: { private: true, broadcast: { self: false, ack: true }, presence: { key: currentUser.id } },
      });
      channelRef.current = channel;
      channel
        .on("broadcast", { event: "watch_event" }, ({ payload }) => handleRemoteEvent(payload as WatchEvent))
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState<PresenceMember>();
          setMembers(Object.values(state).flat().filter((member) => member.userId !== currentUser.id));
        })
        .subscribe(async (status) => {
          if (!active) return;
          if (status === "SUBSCRIBED") {
            setConnection("online");
            await channel.track({
              userId: currentUser.id,
              identityKey: currentUser.identityKey,
              nameFa: currentUser.nameFa,
              nameEn: currentUser.nameEn,
              onlineAt: new Date().toISOString(),
            });
            await broadcast({ type: "REQUEST_SYNC", sentAt: Date.now(), userId: currentUser.id });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setConnection("offline");
          }
        });
    }

    connect().catch(() => active && setConnection("offline"));
    return () => {
      active = false;
      if (tokenRefreshTimer) clearInterval(tokenRefreshTimer);
      if (channelRef.current) void supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    };
  }, [broadcast, currentUser, handleRemoteEvent, realtimeConfigured]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!controller.current || !playerRef.current || document.visibilityState !== "visible") return;
      void broadcast({
        type: "SYNC",
        time: playerRef.current.currentTime,
        playing: !playerRef.current.paused,
        playbackRate: playerRef.current.playbackRate,
        sentAt: Date.now(),
        userId: currentUser.id,
      });
      void persistState();
    }, 12_000);
    return () => window.clearInterval(timer);
  }, [broadcast, currentUser.id, persistState]);

  useEffect(() => () => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    if (correctionTimer.current) clearTimeout(correctionTimer.current);
  }, []);

  useEffect(() => {
    if (!messageNotice) return;
    const timer = window.setTimeout(() => setMessageNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [messageNotice]);

  useEffect(() => {
    const unlock = () => {
      if (!audioContext.current) audioContext.current = new AudioContext();
      if (audioContext.current.state === "suspended") void audioContext.current.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [messages, reduced]);

  const localEvent = useCallback((type: "PLAY" | "PAUSE" | "SEEK", time?: number) => {
    if (applyingRemote.current || !playerRef.current) return;
    controller.current = true;
    const player = playerRef.current;
    const event = type === "SEEK"
      ? { type, time: time ?? player.currentTime, playing: !player.paused, playbackRate: player.playbackRate, sentAt: Date.now(), userId: currentUser.id } as const
      : { type, time: player.currentTime, playbackRate: player.playbackRate, sentAt: Date.now(), userId: currentUser.id } as const;
    void broadcast(event);
    void persistState();
  }, [broadcast, currentUser.id, persistState]);

  const partnerOnline = members.length > 0;
  const connectionText = useMemo(() => {
    if (connection === "unconfigured") return isFa ? "همگام‌سازی هنوز پیکربندی نشده" : "Sync is not configured yet";
    if (connection === "offline") return isFa ? "ارتباط لحظه‌ای قطع است" : "Realtime is offline";
    if (connection === "connecting") return isFa ? "در حال وصل کردن دو صندلی…" : "Connecting both seats…";
    return partnerOnline
      ? isFa ? `${partnerName} اینجاست` : `${partnerName} is here`
      : isFa ? `منتظر ${partnerName}` : `Waiting for ${partnerName}`;
  }, [connection, isFa, partnerName, partnerOnline]);

  async function changeSource(url: string, title: string) {
    const response = await fetch("/api/watch/source", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, title: title || null }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "source");
    setSession(result.session);
    initializedSource.current = null;
    setSourceOpen(false);
    setMediaError(null);
    controller.current = true;
    await broadcast({ type: "SOURCE_CHANGE", url, title: title || null, sentAt: Date.now(), userId: currentUser.id });
  }

  async function changeSubtitle(form: FormData | null) {
    const response = await fetch("/api/watch/subtitle", { method: form ? "POST" : "DELETE", body: form ?? undefined });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "subtitle");
    setSession((value) => ({ ...value, ...result.subtitle }));
    setSubtitleOpen(false);
    await broadcast({ type: "SUBTITLE_CHANGE", sentAt: Date.now(), userId: currentUser.id });
  }

  function toggleFullscreenChat() {
    const next = !fullscreenChatOpenRef.current;
    fullscreenChatOpenRef.current = next;
    setFullscreenChatOpen(next);
    if (next) {
      setUnreadCount(0);
      setMessageNotice(null);
    }
  }

  async function sendMessage(text: string) {
    const response = await fetch("/api/watch/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "message");
    const message = result.message as WatchMessageView;
    setMessages((items) => [...items, message].slice(-100));
    await broadcast({ type: "MESSAGE", message, sentAt: Date.now(), userId: currentUser.id });
  }

  function sendReaction(reaction: WatchReaction) {
    addReaction(reaction, true);
    void broadcast({ type: "REACTION", reaction, sentAt: 0, userId: currentUser.id });
  }

  return (
    <motion.div
      className="page-container watch-page"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52 }}
    >
      <header className="watch-header">
        <div className="stack-sm">
          <p className="eyebrow">{isFa ? "سینمای کوچک ما" : "Our little cinema"}</p>
          <h1 className="display-type">{isFa ? "با هم تماشا کنیم" : "Watch together"}</h1>
          <p className="text-muted">{isFa ? "دو صندلی، یک تصویر، و حرف‌هایی که وسط فیلم یادمان می‌آید." : "Two seats, one picture, and everything we whisper during it."}</p>
        </div>
        <div className={`watch-presence watch-presence--${connection}`} role="status">
          <span aria-hidden="true" />
          <strong>{connectionText}</strong>
        </div>
      </header>

      <div className="watch-layout">
        <section className="watch-cinema" aria-label={isFa ? "پخش‌کننده‌ی مشترک" : "Shared player"}>
          <div className="watch-marquee" aria-hidden="true"><span /><span /><span /></div>
          {session.videoUrl ? (
            <div className="watch-screen">
              <MediaPlayer
                ref={playerRef}
                title={session.title ?? (isFa ? "فیلم ما" : "Our movie")}
                src={sourceType(session.videoUrl) ? { src: session.videoUrl, type: sourceType(session.videoUrl)! } : session.videoUrl}
                playsInline
                preload="metadata"
                onFullscreenChange={(isFullscreen) => {
                  fullscreenRef.current = isFullscreen;
                  setFullscreen(isFullscreen);
                  if (!isFullscreen) {
                    fullscreenChatOpenRef.current = false;
                    setFullscreenChatOpen(false);
                    setMessageNotice(null);
                  }
                }}
                onCanPlay={() => {
                  if (!playerRef.current || initializedSource.current === session.videoUrl) return;
                  playerRef.current.currentTime = session.currentTime;
                  playerRef.current.playbackRate = session.playbackRate;
                  initializedSource.current = session.videoUrl;
                }}
                onPlay={() => { playing.current = true; localEvent("PLAY"); }}
                onPause={() => { playing.current = false; localEvent("PAUSE"); }}
                onSeeked={(time) => { currentTime.current = time; localEvent("SEEK", time); }}
                onTimeUpdate={({ currentTime: time }) => { currentTime.current = time; }}
                onRateChange={(rate) => {
                  if (!applyingRemote.current) playbackRate.current = rate;
                }}
                onError={() => setMediaError(isFa ? "این لینک در مرورگر پخش نشد. احتمالاً فرمت، CORS یا زمان انقضای لینک مشکل دارد." : "This link could not play in the browser. Check its format, CORS policy, or expiry time.")}
              >
                <MediaProvider>
                  {session.subtitleContent && session.subtitleType && (
                    <Track
                      key={`${session.subtitleFileName}-${session.revision}`}
                      content={session.subtitleContent}
                      type={session.subtitleType === "srt" ? "srt" : "vtt"}
                      kind="subtitles"
                      label={session.subtitleLabel ?? "Subtitles"}
                      lang={session.subtitleLanguage ?? "fa"}
                      default
                    />
                  )}
                </MediaProvider>
                <DefaultVideoLayout
                  icons={defaultLayoutIcons}
                  slots={{
                    smallLayout: { beforeFullscreenButton: fullscreen ? (
                      <button className="vds-button watch-control-button" type="button" onClick={toggleFullscreenChat} aria-label={isFa ? "باز کردن گفت‌وگو" : "Open chat"} aria-pressed={fullscreenChatOpen}>
                        <Icon name="chat" />
                        {unreadCount > 0 && <span className="watch-control-badge">{Math.min(unreadCount, 9)}</span>}
                      </button>
                    ) : null },
                    largeLayout: { beforeFullscreenButton: fullscreen ? (
                      <button className="vds-button watch-control-button" type="button" onClick={toggleFullscreenChat} aria-label={isFa ? "باز کردن گفت‌وگو" : "Open chat"} aria-pressed={fullscreenChatOpen}>
                        <Icon name="chat" />
                        {unreadCount > 0 && <span className="watch-control-badge">{Math.min(unreadCount, 9)}</span>}
                      </button>
                    ) : null },
                  }}
                />
                <AnimatePresence>
                  {fullscreen && (
                    <div className="fullscreen-reactions">
                      {(Object.keys(reactionGlyph) as WatchReaction[]).map((reaction) => (
                        <button key={reaction} type="button" onClick={() => sendReaction(reaction)} title={reactionLabels[reaction][isFa ? "fa" : "en"]} aria-label={reactionLabels[reaction][isFa ? "fa" : "en"]}>{reactionGlyph[reaction]}</button>
                      ))}
                    </div>
                  )}
                  {fullscreen && fullscreenChatOpen && (
                    <motion.div className="fullscreen-chat-shell" initial={{ opacity: 0, x: isFa ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isFa ? -24 : 24 }} transition={{ duration: reduced ? 0.05 : 0.24 }}>
                      <WatchChat isFa={isFa} theme={theme} messages={messages} currentUser={currentUser} userName={userName} partnerName={partnerName} messageEnd={messageEnd} onSend={sendMessage} onError={(message) => toast(message)} mode="overlay" soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled((value) => !value)} onClose={toggleFullscreenChat} />
                    </motion.div>
                  )}
                  {fullscreen && messageNotice && !fullscreenChatOpen && (
                    <motion.button className="fullscreen-message-toast" type="button" onClick={toggleFullscreenChat} initial={{ opacity: 0, y: 16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} aria-live="polite">
                      <Icon name="chat" /><span><strong>{isFa ? messageNotice.user.nameFa : messageNotice.user.nameEn}</strong><small>{messageNotice.message}</small></span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </MediaPlayer>
              <AnimatePresence>
                {reactions.map((item, index) => (
                  <motion.span
                    key={item.id}
                    className={`floating-reaction ${item.mine ? "is-mine" : ""}`}
                    style={{ insetInlineStart: `${20 + (index % 4) * 17}%` }}
                    initial={{ opacity: 0, y: 24, scale: 0.7, rotate: -8 }}
                    animate={{ opacity: 1, y: -100 - index * 10, scale: 1.15, rotate: 6 }}
                    exit={{ opacity: 0, y: -150 }}
                    transition={{ duration: reduced ? 0.1 : 1.9, ease: [0.16, 1, 0.3, 1] }}
                  >{reactionGlyph[item.reaction]}</motion.span>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <button className="watch-empty-screen" type="button" onClick={() => setSourceOpen(true)}>
              <span className="watch-empty-screen__play" aria-hidden="true">▶</span>
              <strong>{isFa ? "اولین فیلم این صندلی‌ها را انتخاب کن" : "Choose the first film for these seats"}</strong>
              <small>{isFa ? "لینک مستقیم MP4 یا HLS بهتر جواب می‌دهد." : "A direct MP4 or HLS link works best."}</small>
            </button>
          )}

          <div className="watch-title-strip">
            <div>
              <small>{isFa ? "الان روی پرده" : "Now showing"}</small>
              <strong>{session.title || (isFa ? "هنوز چیزی انتخاب نشده" : "Nothing selected yet")}</strong>
            </div>
            <div className="watch-title-actions">
              <button className="button button--secondary" type="button" onClick={() => setSubtitleOpen((value) => !value)}><Icon name="subtitles" />{session.subtitleFileName ? (isFa ? "عوض کردن زیرنویس" : "Change subtitles") : (isFa ? "افزودن زیرنویس" : "Add subtitles")}</button>
              <button className="button button--secondary" type="button" onClick={() => setSourceOpen((value) => !value)}><Icon name="edit" />{isFa ? "عوض کردن فیلم" : "Change film"}</button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {sourceOpen && <SourceForm isFa={isFa} initialTitle={session.title ?? ""} onSubmit={changeSource} onClose={session.videoUrl ? () => setSourceOpen(false) : undefined} />}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {subtitleOpen && <SubtitleForm isFa={isFa} currentFile={session.subtitleFileName} onSubmit={changeSubtitle} onClose={() => setSubtitleOpen(false)} />}
          </AnimatePresence>

          {(notice || mediaError) && <div className="watch-notice" role="alert"><span aria-hidden="true">!</span><p>{mediaError ?? notice}</p></div>}

          <div className="reaction-tray" aria-label={isFa ? "واکنش‌ها" : "Reactions"}>
            {(Object.keys(reactionGlyph) as WatchReaction[]).map((reaction) => (
              <button key={reaction} type="button" onClick={() => sendReaction(reaction)} aria-label={`${isFa ? "واکنش" : "React"}: ${reaction}`}>
                {reactionGlyph[reaction]}
              </button>
            ))}
          </div>
        </section>

        <WatchChat
          isFa={isFa}
          theme={theme}
          messages={messages}
          currentUser={currentUser}
          userName={userName}
          partnerName={partnerName}
          messageEnd={messageEnd}
          onSend={sendMessage}
          onError={(message) => toast(message)}
          mode="page"
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((value) => !value)}
        />
      </div>
    </motion.div>
  );
}

function SourceForm({ isFa, initialTitle, onSubmit, onClose }: { isFa: boolean; initialTitle: string; onSubmit: (url: string, title: string) => Promise<void>; onClose?: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await onSubmit(String(form.get("url") ?? ""), String(form.get("title") ?? ""));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this source.");
    } finally {
      setPending(false);
    }
  }

  return (
    <motion.form className="watch-source-form stack-md" onSubmit={submit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="watch-source-form__heading">
        <div><p className="eyebrow">{isFa ? "فیلم تازه" : "New source"}</p><h2>{isFa ? "چه چیزی ببینیم؟" : "What are we watching?"}</h2></div>
        {onClose && <button className="button button--icon button--quiet" type="button" onClick={onClose} aria-label={isFa ? "بستن" : "Close"}><Icon name="close" /></button>}
      </div>
      <div>
        <label className="field-label" htmlFor="watch-title">{isFa ? "اسم فیلم یا قسمت" : "Movie or episode title"}</label>
        <input className="text-field" id="watch-title" name="title" defaultValue={initialTitle} maxLength={160} placeholder={isFa ? "مثلاً The Mentalist — قسمت ۱۴" : "For example, The Mentalist — episode 14"} />
      </div>
      <div>
        <label className="field-label" htmlFor="watch-url">{isFa ? "لینک مستقیم ویدئو" : "Direct video URL"}</label>
        <input className="text-field" id="watch-url" name="url" type="url" dir="ltr" required placeholder="https://…/video.mp4" />
        <small className="watch-source-help">{isFa ? "Vidstack فایل را تبدیل نمی‌کند؛ MP4 و HLS مطمئن‌تر از MKV هستند." : "Vidstack does not convert files; MP4 and HLS are more reliable than MKV."}</small>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--primary" type="submit" disabled={pending}>{pending ? (isFa ? "در حال گذاشتن روی پرده…" : "Putting it on screen…") : (isFa ? "گذاشتن روی پرده‌ی ما" : "Put it on our screen")}</button>
    </motion.form>
  );
}

function SubtitleForm({ isFa, currentFile, onSubmit, onClose }: { isFa: boolean; currentFile: string | null; onSubmit: (form: FormData | null) => Promise<void>; onClose: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try { await onSubmit(new FormData(event.currentTarget)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save subtitles."); }
    finally { setPending(false); }
  }

  async function remove() {
    setPending(true);
    setError("");
    try { await onSubmit(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not remove subtitles."); }
    finally { setPending(false); }
  }

  return (
    <motion.form className="watch-source-form watch-subtitle-form stack-md" onSubmit={submit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="watch-source-form__heading">
        <div><p className="eyebrow">{isFa ? "زیرنویس مشترک" : "Shared subtitles"}</p><h2>{isFa ? "زیرنویس فیلم" : "Movie subtitles"}</h2></div>
        <button className="button button--icon button--quiet" type="button" onClick={onClose} aria-label={isFa ? "بستن" : "Close"}><Icon name="close" /></button>
      </div>
      <p className="watch-source-help">{isFa ? "فایل SRT یا VTT را بفرست؛ برای هر دوی شما روی همین فیلم فعال می‌شود." : "Upload an SRT or VTT file; it will appear for both of you on this movie."}</p>
      {currentFile && <div className="subtitle-current"><Icon name="subtitles" /><span><small>{isFa ? "فایل فعلی" : "Current file"}</small><strong dir="auto">{currentFile}</strong></span></div>}
      <div>
        <label className="field-label" htmlFor="watch-subtitle-file">{isFa ? "فایل زیرنویس" : "Subtitle file"}</label>
        <input className="text-field" id="watch-subtitle-file" name="file" type="file" accept=".srt,.vtt,text/vtt,application/x-subrip" required />
      </div>
      <div className="watch-subtitle-fields">
        <div><label className="field-label" htmlFor="watch-subtitle-label">{isFa ? "نام" : "Label"}</label><input className="text-field" id="watch-subtitle-label" name="label" defaultValue={isFa ? "فارسی" : "English"} maxLength={80} /></div>
        <div><label className="field-label" htmlFor="watch-subtitle-language">{isFa ? "زبان" : "Language"}</label><select className="text-field" id="watch-subtitle-language" name="language" defaultValue={isFa ? "fa" : "en"}><option value="fa">فارسی</option><option value="en">English</option></select></div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="subtitle-actions">
        <button className="button button--primary" type="submit" disabled={pending}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : (isFa ? "فعال کردن زیرنویس" : "Use subtitles")}</button>
        {currentFile && <button className="button button--quiet" type="button" disabled={pending} onClick={remove}>{isFa ? "حذف زیرنویس" : "Remove subtitles"}</button>}
      </div>
    </motion.form>
  );
}

function WatchChat({ isFa, theme, messages, currentUser, userName, partnerName, messageEnd, onSend, onError, mode, soundEnabled, onToggleSound, onClose }: {
  isFa: boolean;
  theme: string;
  messages: WatchMessageView[];
  currentUser: WatchUser;
  userName: string;
  partnerName: string;
  messageEnd: React.RefObject<HTMLDivElement | null>;
  onSend: (text: string) => Promise<void>;
  onError: (message: string) => void;
  mode: "page" | "overlay";
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose?: () => void;
}) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value || pending) return;
    setPending(true);
    try {
      await onSend(value);
      setText("");
    } catch {
      onError(isFa ? "پیام نرفت؛ دوباره امتحان کن." : "The message did not send. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className={`watch-chat watch-chat--${theme} watch-chat--${mode}`} aria-label={isFa ? "حرف‌های وسط فیلم" : "Movie chat"}>
      <header><div><p className="eyebrow">{isFa ? "حرف‌های وسط فیلم" : "Between the scenes"}</p><h2>{isFa ? `${userName} و ${partnerName}` : `${userName} & ${partnerName}`}</h2></div><div className="watch-chat-tools"><button type="button" onClick={onToggleSound} aria-label={soundEnabled ? (isFa ? "بی‌صدا کردن پیام‌ها" : "Mute message sounds") : (isFa ? "روشن کردن صدای پیام‌ها" : "Enable message sounds")} aria-pressed={soundEnabled}><Icon name={soundEnabled ? "sound" : "muted"} /></button>{onClose && <button type="button" onClick={onClose} aria-label={isFa ? "بستن گفت‌وگو" : "Close chat"}><Icon name="close" /></button>}</div></header>
      <div className="watch-messages" aria-live="polite">
        {!messages.length && <div className="watch-chat-empty"><span aria-hidden="true">“</span><p>{isFa ? "اولین چیزی که وسط فیلم می‌گویی اینجا می‌ماند." : "The first thing you whisper during the movie will stay here."}</p></div>}
        {messages.map((message) => {
          const mine = message.user.id === currentUser.id;
          const name = isFa ? message.user.nameFa : message.user.nameEn;
          return <article key={message.id} className={`watch-message ${mine ? "is-mine" : ""}`}><small>{name}</small><p>{message.message}</p><time dateTime={message.createdAt}>{watchTimeFormatters[isFa ? "fa" : "en"].format(new Date(message.createdAt))}</time></article>;
        })}
        <div ref={messageEnd} />
      </div>
      <form className="watch-chat-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`watch-message-${mode}`}>{isFa ? "پیام" : "Message"}</label>
        <textarea id={`watch-message-${mode}`} value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} rows={2} placeholder={isFa ? "یه چیزی بگو…" : "Say something…"} />
        <button type="submit" disabled={pending || !text.trim()} aria-label={isFa ? "فرستادن پیام" : "Send message"}><Icon name="send" /></button>
      </form>
    </aside>
  );
}
