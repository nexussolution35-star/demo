import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import songAsset from "../assets/hey-wena.mp3.asset.json";
import gallery1 from "../assets/gallery-1.jpg.asset.json";
import gallery2 from "../assets/gallery-2.jpg.asset.json";
import gallery3 from "../assets/gallery-3.jpg.asset.json";
import gallery4 from "../assets/gallery-4.jpg.asset.json";
import gallery5 from "../assets/gallery-5.jpg.asset.json";
import gallery6 from "../assets/gallery-6.jpg.asset.json";
import gallery9 from "../assets/gallery-9.jpg.asset.json";
import gallery10 from "../assets/gallery-10.jpg.asset.json";

import portrait from "../assets/portrait.jpg.asset.json";
import surpriseVideo from "../assets/birthday-surprise.mp4.asset.json";

export const Route = createFileRoute("/")({
  component: LetterPage,
  head: () => ({
    meta: [
      { title: "A letter for Mokgethwa, from Thatego" },
      {
        name: "description",
        content: "A personal birthday letter for Mokgethwa. Tap to open.",
      },
      { property: "og:title", content: "A letter for Mokgethwa, from Thatego" },
      {
        property: "og:description",
        content: "A personal birthday letter for Mokgethwa. Tap to open.",
      },
    ],
  }),
});

type Step =
  | "cover"
  | "countdown"
  | "celebration"
  | "page1"
  | "page2"
  | "page3"
  | "page4"
  | "page5"
  | "page6"
  | "finalCountdown"
  | "final";

/**
 * Birthday moment: 14 July, 00:00 local time (this year). The countdown ticks
 * toward it and then simply sits at zero once it's passed — it never rolls
 * forward to next year, so opening or returning after midnight always shows
 * zero and reveals the letter.
 */
function getTargetDate() {
  const now = new Date();
  return new Date(now.getFullYear(), 6, 14, 0, 0, 0);
}

/**
 * The in-person surprise moment — 14 July at 3:45 PM (15:45).
 * That's the birthday countdown's midnight target + 15h45m, i.e. when
 * I'll actually get to see her in the afternoon. Rolls to next year once past.
 */
function getFinalSurpriseDate() {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), 6, 14, 15, 45, 0);
  if (now.getTime() < thisYear.getTime()) return thisYear;
  return new Date(now.getFullYear() + 1, 6, 14, 15, 45, 0);
}

function LetterPage() {
  const [step, setStep] = useState<Step>("cover");
  const [opening, setOpening] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicLoading, setMusicLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Warm up the song in the background as soon as the letter mounts so the
  // first tap on Play starts (almost) instantly instead of buffering cold.
  useEffect(() => {
    const el = audioRef.current;
    if (el) {
      try { el.load(); } catch { /* ignore */ }
    }
  }, []);

  const openGift = () => {
    if (opening) return;
    setOpening(true);
    timerRef.current = window.setTimeout(() => {
      // Always land on the countdown. Before midnight it ticks down; once the
      // birthday has arrived it sits at zero and reveals the button — live,
      // with no refresh needed, and the same whether or not she was watching
      // when it hit zero or is only now coming back to it.
      setStep("countdown");
    }, 850);
  };

  // Reset the gift-opening animation whenever we return to the cover.
  useEffect(() => {
    if (step === "cover") {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setOpening(false);
    }
  }, [step]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  // Pause the song on the letter and final farewell for focus / reverence.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if ((step === "page5" || step === "final") && musicOn) {
      el.pause();
      setMusicOn(false);
      setMusicLoading(false);
    }
  }, [step, musicOn]);

  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    if (musicOn || musicLoading) {
      el.pause();
      setMusicOn(false);
      setMusicLoading(false);
    } else {
      // Song shines from minute 1 onwards — start there the first time.
      if (el.currentTime < 60) {
        try { el.currentTime = 60; } catch { /* seek can fail before metadata loads */ }
      }
      // Show a spinner while the audio buffers; play() resolves once it
      // actually starts, so clear the spinner then (or on failure).
      setMusicLoading(true);
      el.play()
        .then(() => { setMusicOn(true); setMusicLoading(false); })
        .catch(() => { setMusicOn(false); setMusicLoading(false); });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <audio ref={audioRef} src={songAsset.url} loop preload="auto" />

      {step === "cover" && <CoverScreen opening={opening} onOpen={openGift} />}
      {step === "countdown" && (
        <CountdownScreen onReachZero={() => setStep("celebration")} />
      )}
      {step === "celebration" && (
        <CelebrationScreen onContinue={() => setStep("page1")} />
      )}
      {step === "page1" && (
        <PageOne onBack={() => setStep("cover")} onContinue={() => setStep("page2")} />
      )}
      {step === "page2" && (
        <PageTwoGallery onBack={() => setStep("page1")} onContinue={() => setStep("page3")} />
      )}
      {step === "page3" && (
        <PageThreeReasons onBack={() => setStep("page2")} onContinue={() => setStep("page4")} />
      )}
      {step === "page4" && (
        <PageFourSurprise onBack={() => setStep("page3")} onContinue={() => setStep("page5")} />
      )}
      {step === "page5" && (
        <PageFiveLetter onBack={() => setStep("page4")} onContinue={() => setStep("finalCountdown")} />
      )}
      {step === "finalCountdown" && (
        <FinalCountdownScreen onBack={() => setStep("page5")} onContinue={() => setStep("final")} />
      )}
      {step === "final" && <FinalScreen />}

      {/* Persistent easter eggs & music — hidden on cover, letter (for focus) and final */}
      {step !== "cover" && step !== "page5" && step !== "final" && (
        <>
          <FloatingHearts />
          <FloatingStars />
          <MusicButton on={musicOn} loading={musicLoading} onToggle={toggleMusic} />
        </>
      )}
    </div>
  );
}

/* ---------------- COVER ---------------- */

function CoverScreen({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="relative min-h-screen bg-[#fafaf7] text-neutral-800 animate-fade-in overflow-hidden">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
        {/* Downward arrow hint (all breakpoints) */}
        <div className="flex flex-col items-center mb-3 cover-nudge">
          <div className="font-serif italic font-bold text-3xl sm:text-4xl tracking-wide text-neutral-800">
            Tap to open
          </div>
          <svg width="60" height="72" viewBox="0 0 60 72" aria-hidden className="cover-arrow-down mt-1">
            {/* straight shaft pointing down at the gift */}
            <path
              d="M30 6 L30 50"
              fill="none"
              stroke="#e11d48"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* downward chevron head */}
            <path
              d="M15 37 L30 54 L45 37"
              fill="none"
              stroke="#e11d48"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="scale-[0.72] sm:scale-90 md:scale-100 origin-center">
            <button
              onClick={onOpen}
              className="group relative outline-none cursor-pointer cover-gift-breathe block"
              aria-label="Tap to open the gift"
            >
              <GiftBox opening={opening} />
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 text-center">
          <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
            To
          </div>
          <div className="mt-2 font-serif italic text-4xl text-neutral-700">
            Mokgethwa
          </div>
          <div className="mt-4 text-[11px] tracking-[0.25em] text-neutral-500">
            <span className="uppercase">From</span>{" "}
            <span className="italic font-serif normal-case text-neutral-700">
              Thatego
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cover-nudge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .cover-nudge{ animation: cover-nudge 2.4s ease-in-out infinite; }
        @keyframes cover-arrow-down-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        .cover-arrow-down{ animation: cover-arrow-down-bounce 1.6s ease-in-out infinite; }
        @keyframes cover-gift-breathe {
          0%,100% { transform: translateY(0); filter: drop-shadow(0 10px 20px rgba(236,72,153,0.15)); }
          50%     { transform: translateY(-6px); filter: drop-shadow(0 20px 30px rgba(236,72,153,0.35)); }
        }
        .cover-gift-breathe{ animation: cover-gift-breathe 3.2s ease-in-out infinite; }
      `}</style>

    </div>
  );
}

function GiftBox({ opening }: { opening: boolean }) {
  const ribbonV =
    "linear-gradient(90deg,#a8134a 0%,#d81b60 18%,#ec407a 42%,#f8bbd0 50%,#ec407a 58%,#d81b60 82%,#a8134a 100%)";
  const ribbonH =
    "linear-gradient(180deg,#a8134a 0%,#d81b60 18%,#ec407a 42%,#f8bbd0 50%,#ec407a 58%,#d81b60 82%,#a8134a 100%)";

  return (
    <div
      className="relative"
      style={{ width: 340, height: 280, perspective: 1000 }}
    >
      <div
        className="absolute inset-x-6 -bottom-2 h-8 rounded-full blur-xl"
        style={{ background: "rgba(236, 72, 153, 0.35)" }}
      />
      <div
        className="absolute inset-0 rounded-[14px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(236,72,153,0.45)] transition-transform duration-500"
        style={{
          background:
            "linear-gradient(135deg,#fff5ec 0%,#ffe8dc 60%,#ffd9cc 100%)",
          transform: opening ? "scale(0.96)" : "scale(1)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(236,72,153,0.35) 1.2px, transparent 1.6px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(200,80,120,0.15) 100%)",
          }}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 transition-all duration-[750ms] ease-[cubic-bezier(0.6,-0.05,0.35,1.1)]"
        style={{
          width: 54,
          left: "50%",
          marginLeft: -27,
          background: ribbonV,
          boxShadow: "0 0 12px rgba(216,27,96,0.35)",
          transform: opening ? "translateY(-140%) rotate(-6deg)" : "translateY(0)",
          opacity: opening ? 0 : 1,
        }}
      />
      <div
        className="absolute left-0 right-0 transition-all duration-[750ms] ease-[cubic-bezier(0.6,-0.05,0.35,1.1)]"
        style={{
          height: 54,
          top: "50%",
          marginTop: -27,
          background: ribbonH,
          boxShadow: "0 0 12px rgba(216,27,96,0.35)",
          transform: opening ? "scaleX(0.05)" : "scaleX(1)",
          transformOrigin: "center",
          opacity: opening ? 0 : 1,
        }}
      />
      <div
        className="absolute transition-all duration-[750ms] ease-[cubic-bezier(0.6,-0.05,0.35,1.1)]"
        style={{
          left: "50%",
          top: "50%",
          marginLeft: -90,
          marginTop: -55,
          transform: opening
            ? "translateY(-320%) scale(1.2) rotate(-25deg)"
            : "translateY(0) scale(1)",
          opacity: opening ? 0 : 1,
          filter: "drop-shadow(0 6px 8px rgba(157,21,72,0.35))",
        }}
      >
        <svg width="180" height="150" viewBox="0 0 180 150">
          <defs>
            <radialGradient id="loopL" cx="0.35" cy="0.4" r="0.8">
              <stop offset="0" stopColor="#f8bbd0" />
              <stop offset="0.35" stopColor="#ec407a" />
              <stop offset="1" stopColor="#a8134a" />
            </radialGradient>
            <radialGradient id="loopR" cx="0.65" cy="0.4" r="0.8">
              <stop offset="0" stopColor="#f8bbd0" />
              <stop offset="0.35" stopColor="#ec407a" />
              <stop offset="1" stopColor="#a8134a" />
            </radialGradient>
            <linearGradient id="tailG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c2185b" />
              <stop offset="1" stopColor="#7a0d38" />
            </linearGradient>
            <linearGradient id="knotG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ec407a" />
              <stop offset="0.5" stopColor="#f8bbd0" />
              <stop offset="1" stopColor="#c2185b" />
            </linearGradient>
          </defs>
          <path d="M78 70 L60 140 L90 118 Z" fill="url(#tailG)" />
          <path d="M102 70 L120 140 L90 118 Z" fill="url(#tailG)" />
          <path
            d="M90 62 C 55 30, 15 45, 20 70 C 25 92, 65 88, 90 72 Z"
            fill="url(#loopL)"
          />
          <path
            d="M90 62 C 125 30, 165 45, 160 70 C 155 92, 115 88, 90 72 Z"
            fill="url(#loopR)"
          />
          <path
            d="M35 56 C 55 48, 72 52, 82 62"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M145 56 C 125 48, 108 52, 98 62"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="78" y="55" width="24" height="26" rx="5" fill="url(#knotG)" />
          <rect
            x="82"
            y="65"
            width="16"
            height="4"
            rx="2"
            fill="rgba(255,255,255,0.9)"
          />
        </svg>
      </div>
      {opening && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 14;
            const dx = Math.cos(angle) * 140;
            const dy = Math.sin(angle) * 120;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                style={{
                  background: i % 2 ? "#f59e0b" : "#ec4899",
                  animation: `sparkle-out 0.8s ${i * 0.02}s ease-out forwards`,
                  ["--dx" as any]: `${dx}px`,
                  ["--dy" as any]: `${dy}px`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes sparkle-out {
              0%{transform:translate(-50%,-50%) scale(0.6);opacity:1}
              100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0);opacity:0}
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

/* ---------------- COUNTDOWN ---------------- */

function CountdownScreen({ onReachZero }: { onReachZero: () => void }) {
  const [now, setNow] = useState(Date.now());
  // Fixed target captured once on mount, so the countdown always runs toward a
  // single moment (14 July midnight) and simply stops at zero — it can never
  // loop or restart, even across refreshes.
  const target = useRef(getTargetDate().getTime());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 47);
    return () => window.clearInterval(id);
  }, []);

  const rawDiff = target.current - now;
  const reached = rawDiff <= 0;
  const diff = Math.max(0, rawDiff);

  const d = reached ? 0 : diff;
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);
  const ms = d % 1000;

  const playful = [
    "Some gifts aren't meant to be opened early.",
    "Patience... the best part hasn't happened yet.",
    "Almost. Almost. Almost.",
  ];
  const hint = playful[Math.floor((now / 4000) % playful.length)];

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white animate-fade-in"
      style={{
        background:
          "radial-gradient(ellipse at center, #3a1030 0%, #1c0818 55%, #0a0308 100%)",
      }}
    >
      <FireworksCanvas />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-[11px] tracking-[0.35em] text-amber-400 uppercase">
          Until Mokgethwa's Birthday
        </div>
        <h1
          className="mt-6 font-serif italic font-bold text-[42px] sm:text-[72px] md:text-[96px] leading-none bg-clip-text text-transparent text-center max-w-full whitespace-nowrap"
          style={{
            backgroundImage:
              "linear-gradient(180deg,#f9a8d4 0%,#f59e0b 55%,#ec4899 100%)",
            filter: "drop-shadow(0 0 40px rgba(236,72,153,0.35))",
          }}
        >
          Mokgethwa
        </h1>
        <div className="mt-10 grid grid-cols-2 sm:flex sm:items-stretch gap-3 justify-center max-w-xs sm:max-w-none w-full sm:w-auto">
          <TimeBox value={days} label="Days" />
          <TimeBox value={pad(hours)} label="Hours" />
          <TimeBox value={pad(mins)} label="Min" />
          <TimeBox value={pad(secs)} label="Sec" />
          <div className="col-span-2 flex justify-center sm:block">
            <div className="w-1/2 sm:w-auto">
              <TimeBox value={String(ms).padStart(3, "0")} label="Ms" />
            </div>
          </div>

        </div>


        {reached ? (
          <button
            onClick={onReachZero}
            className="mt-10 group inline-flex items-center gap-3 rounded-full px-7 py-4 text-base font-medium text-white shadow-[0_10px_40px_-10px_rgba(236,72,153,0.7)] transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            style={{
              background:
                "linear-gradient(135deg,#ec4899 0%,#f59e0b 55%,#ec4899 100%)",
            }}
          >
            <span>Click here to read my heart</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        ) : (
          <div className="mt-10 text-sm italic text-white/70 max-w-xs text-center transition-opacity duration-700">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function TimeBox({ value, label }: { value: number | string; label: string }) {
  return (
    <div
      className="min-w-[64px] w-full sm:w-auto px-3 py-3 sm:py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className="text-2xl font-medium tabular-nums">{value}</div>
      <div className="text-[9px] tracking-[0.25em] text-white/60 uppercase mt-0.5">
        {label}
      </div>
    </div>
  );
}

/* Fireworks — rockets launched from the bottom, then explode */
function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    type Rocket = {
      x: number; y: number; vx: number; vy: number;
      targetY: number; color: string; trail: { x: number; y: number }[];
    };
    type P = {
      x: number; y: number; vx: number; vy: number;
      life: number; max: number; color: string;
    };
    const rockets: Rocket[] = [];
    const particles: P[] = [];

    const colors = ["#f9a8d4", "#f59e0b", "#a855f7", "#22d3ee", "#fbbf24", "#ec4899"];
    const pick = () => colors[Math.floor(Math.random() * colors.length)];

    const launch = () => {
      const x = W * (0.15 + Math.random() * 0.7);
      const targetY = H * (0.2 + Math.random() * 0.3);
      rockets.push({
        x, y: H + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(9 + Math.random() * 3),
        targetY, color: pick(), trail: [],
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 55 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.1;
        const s = 1.5 + Math.random() * 4;
        particles.push({
          x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 0, max: 70 + Math.random() * 40, color,
        });
      }
    };

    let lastLaunch = 0;
    const tick = (t: number) => {
      ctx.fillStyle = "rgba(10,3,8,0.22)";
      ctx.fillRect(0, 0, W, H);
      if (t - lastLaunch > 650) {
        lastLaunch = t;
        launch();
        if (Math.random() > 0.4) setTimeout(launch, 150);
      }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();
        r.x += r.vx; r.y += r.vy; r.vy += 0.12;
        for (let j = 0; j < r.trail.length; j++) {
          const p = r.trail[j];
          ctx.globalAlpha = (j / r.trail.length) * 0.7;
          ctx.fillStyle = r.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2); ctx.fill();
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++; p.vy += 0.045; p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        const alpha = 1 - p.life / p.max;
        if (alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ---------------- MIDNIGHT CELEBRATION ---------------- */

function CelebrationScreen({ onContinue }: { onContinue: () => void }) {
  const [showNext, setShowNext] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => setShowNext(true), 3500);
    const t2 = window.setTimeout(onContinue, 7000);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [onContinue]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white animate-fade-in"
      style={{
        background:
          "radial-gradient(ellipse at center, #3a1030 0%, #1c0818 55%, #0a0308 100%)",
      }}
    >
      <FireworksCanvas />
      <ConfettiBurst />
      <PartyPopper side="left" />
      <PartyPopper side="right" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="text-[11px] tracking-[0.35em] text-amber-400 uppercase animate-fade-in">
          Your moment
        </div>
        <h1
          className="mt-6 font-serif italic text-5xl sm:text-7xl bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg,#f9a8d4 0%,#f59e0b 55%,#ec4899 100%)",
            filter: "drop-shadow(0 0 40px rgba(236,72,153,0.4))",
          }}
        >
          Happy Birthday
        </h1>
        <div className="mt-4 text-white/70 italic">the moment is here.</div>
        <div
          className="mt-10 text-sm italic text-white/60 transition-opacity duration-1000"
          style={{ opacity: showNext ? 1 : 0 }}
        >
          Take a breath, my love. There's more coming for you.
        </div>
      </div>
    </div>
  );
}


function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        dur: 3 + Math.random() * 2,
        rot: Math.random() * 360,
        color: ["#f472b6", "#fbbf24", "#a855f7", "#22d3ee", "#34d399", "#f87171"][
          i % 6
        ],
        size: 6 + Math.random() * 6,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-[-20px] block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${p.dur}s ${p.delay}s linear forwards`,
            borderRadius: 2,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- PAGE ONE ---------------- */

function PageOne({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <PageShell tint="rose">
      <div className="flex flex-col items-center text-center max-w-md">
        <div
          className="w-56 h-56 rounded-2xl border border-white shadow-lg overflow-hidden"
          aria-label="Mokgethwa"
        >
          <img src={gallery10.url} alt="Mokgethwa" className="w-full h-full object-cover" />
        </div>
        <h1 className="mt-8 font-serif italic text-4xl text-neutral-800">
          Happy Birthday, Mokgethwa <span className="text-rose-500">❤️</span>
        </h1>
        <div className="mt-2 text-xs tracking-[0.3em] uppercase text-neutral-500">
          From Thatego
        </div>
        <p className="mt-10 text-lg font-serif italic text-neutral-700 leading-relaxed">
          A year ago I prayed for peace.
        </p>
        <p className="mt-2 text-lg font-serif italic text-neutral-700 leading-relaxed">
          God answered with you.
        </p>
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} />
    </PageShell>
  );
}

/* ---------------- PAGE TWO — swipeable gallery ---------------- */

function PageTwoGallery({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const slides = [
    { src: gallery1.url, caption: "I'll forever be grateful to your parents for giving me this wonderful gift." },
    { src: gallery2.url, caption: "This is my favourite picture of you." },
    { src: gallery3.url, caption: "This is one of my favourite moments with you." },
    { src: gallery4.url, caption: "Thank you for reminding me of the important things in life, most especially not forgetting the huge role the Lord plays in our lives." },
    { src: gallery5.url, caption: "I love how seeing you smile brings me absolute joy." },
    { src: gallery6.url, caption: "Thank you for making it easy for me to express my feelings for you in our talking stage." },
    { src: gallery9.url, caption: "I could look at you all day and never get tired." },
    { src: portrait.url, caption: "Wishing you a year full of blessings, laughter, and everything your heart prays for." },
  ];

  const [i, setI] = useState(0);
  const [seenAll, setSeenAll] = useState(false);
  const next = () => setI((v) => {
    const nv = Math.min(v + 1, slides.length - 1);
    if (nv === slides.length - 1) setSeenAll(true);
    return nv;
  });
  const prev = () => setI((v) => Math.max(v - 1, 0));

  return (
    <PageShell tint="rose" title="My Favourite You">
      <div className="w-full max-w-md">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl border border-white bg-neutral-100">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === idx ? 1 : 0 }}
            >
              <img
                src={s.src}
                alt={s.caption}
                className="absolute inset-0 w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="relative z-10 h-full flex items-end">
                <div className="w-full p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
                  <p className="font-serif italic text-lg leading-snug">{s.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={i === 0}
            className="rounded-full px-4 py-2 bg-white/80 backdrop-blur text-sm text-neutral-700 shadow disabled:opacity-30"
          >← Prev</button>
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <span key={idx}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === idx ? "#ec4899" : "#e5e7eb", width: i === idx ? 20 : 8 }}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={i === slides.length - 1}
            className="rounded-full px-4 py-2 bg-white/80 backdrop-blur text-sm text-neutral-700 shadow disabled:opacity-30"
          >Next →</button>
        </div>
        {!seenAll && (
          <div className="mt-4 text-center text-xs text-neutral-500 italic">
            Swipe through every moment to continue…
          </div>
        )}
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} disabled={!seenAll} />
    </PageShell>
  );
}

/* ---------------- PAGE THREE — reasons cards ---------------- */

function PageThreeReasons({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const cards = [
    "Your kindness",
    "Your patience",
    "Your faith",
    "Your beautiful heart",
    "The way you make people feel loved",
    "Obviously also how beautiful & perfect you are.",
  ];
  const [i, setI] = useState(0);
  const done = i >= cards.length - 1;

  return (
    <PageShell tint="amber" title="Reasons I Thank God For You">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="relative w-full h-56">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur shadow-xl border border-white flex items-center justify-center px-8 text-center transition-all duration-700"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: `translateY(${i === idx ? 0 : 20}px) scale(${i === idx ? 1 : 0.98})`,
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <div>
                <div className="text-3xl">❤️</div>
                <div className="mt-3 font-serif italic text-2xl text-neutral-800">
                  {c}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!done ? (
          <button
            onClick={() => setI((v) => v + 1)}
            className="mt-8 rounded-full bg-white/90 px-6 py-2 text-sm text-neutral-700 shadow"
          >
            Next reason →
          </button>
        ) : (
          <div className="mt-8 text-sm text-neutral-500 italic">…and so many more.</div>
        )}
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} disabled={!done} />
    </PageShell>
  );
}

/* ---------------- PAGE FOUR — surprise video ---------------- */

function PageFourSurprise({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <PageShell tint="purple" title="A little surprise">
      <div className="w-full max-w-md flex flex-col items-center">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="rounded-full px-10 py-5 text-white text-lg font-medium shadow-xl btn-heartbeat"
            style={{
              background: "linear-gradient(90deg,#f59e0b 0%,#ec4899 60%,#a855f7 100%)",
              boxShadow: "0 20px 50px -10px rgba(236,72,153,0.45)",
            }}
          >
            🎁 Ready for a surprise?
          </button>
        ) : (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-white">
            <video
              className="w-full h-full"
              controls
              autoPlay
              onPlay={() => setStarted(true)}
              poster=""
              src={surpriseVideo.url}
            />
          </div>
        )}
        <div className="mt-4 text-xs text-neutral-500 italic">
          {playing && !started
            ? "Press play to unlock the next step…"
            : "A little something made just for you."}
        </div>
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} disabled={!started} />
    </PageShell>
  );
}

/* ---------------- PAGE FIVE — letter (typed in real time) ---------------- */

const LETTER_TEXT = `Hey baby.

I won't ask if you're good because I know you're literally over the moon right now, because the day you've been waiting for has arrived. I'm not only writing this to wish you a happy birthday, but also to remind you how much I love and appreciate having you in my life.

Before I found you, I didn't think I'd ever love or find love again, but then you arrived and proved me otherwise. I remember when I saw you on that day. I'd seen you a couple of times before, but that day was different. I just had to let you know how you made me feel.

I was afraid of saying it. I even had to throw signs, which you didn't really see, so I had to try my chances. Even though I didn't think you'd give me a chance, I still did, because I believe you made it easy for me to.

If someone was to tell me I'd be here writing a message to someone I'll be in love with, I'd literally say they were lying, but here I am doing just that.

So my love, this is just a short message from me to you to show you how much I appreciate and love you, and I'd love to thank you for making me believe in love again. I just hope you never doubt my love for you and how I love being in this with you.

Happy birthday, my love. Hope you enjoy your day as much as I'll try to make it special.

Love you always ❤️

Yours,
Thatego`;

function PageFiveLetter({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    let raf = 0;
    const speed = 45; // ms per char — comforting reading speed
    const tick = () => {
      i += 1;
      setShown(LETTER_TEXT.slice(0, i));
      if (i < LETTER_TEXT.length) raf = window.setTimeout(tick, speed) as unknown as number;
    };
    raf = window.setTimeout(tick, 400) as unknown as number;
    return () => window.clearTimeout(raf);
  }, []);
  const done = shown.length >= LETTER_TEXT.length;

  return (
    <PageShell tint="cream" title="A letter">
      <FloatingParticles />
      <div className="w-full max-w-lg text-neutral-700 font-serif leading-loose text-[17px] relative z-10 whitespace-pre-wrap">
        {shown}
        {!done && <span className="inline-block w-[2px] h-5 align-[-2px] bg-rose-500 ml-0.5 animate-pulse" />}
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} label="Turn the page" disabled={!done} />
    </PageShell>
  );
}

function FloatingParticles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        d: 6 + Math.random() * 6,
        s: 1 + Math.random() * 3,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.s,
            height: p.s,
            background: "rgba(236,72,153,0.35)",
            animation: `float-particle ${p.d}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50%     { transform: translateY(-20px) translateX(6px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- PAGE SIX — Our Future ---------------- */

function PageSixFuture({ onContinue }: { onContinue: () => void }) {
  const dreams = [
    "More prayers together.",
    "More church dates.",
    "More spontaneous adventures.",
    "More laughter.",
    "More birthdays together.",
    "More beautiful memories.",
  ];
  const [i, setI] = useState(0);
  const done = i >= dreams.length - 1;
  return (
    <PageShell tint="rose" title="Our Future ❤️">
      <div className="w-full max-w-md">
        <div className="relative h-40">
          {dreams.map((d, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-2xl bg-white/90 shadow-xl border border-white flex items-center justify-center px-6 text-center transition-all duration-700"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: `translateY(${i === idx ? 0 : 20}px)`,
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <div className="font-serif italic text-2xl text-neutral-800">{d}</div>
            </div>
          ))}
        </div>
        {!done ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setI((v) => v + 1)}
              className="rounded-full bg-white/90 px-6 py-2 text-sm text-neutral-700 shadow"
            >
              Next dream →
            </button>
          </div>
        ) : (
          <Timeline />
        )}
      </div>
      <ContinueButton onClick={onContinue} />
    </PageShell>
  );
}

function Timeline() {
  const items = [
    "We met.",
    "Our first church service.",
    "Our first photo.",
    "One of my favourite memories.",
    "Today.",
  ];
  return (
    <div className="mt-12">
      <div className="text-center text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
        Our timeline
      </div>
      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-pink-300 via-amber-300 to-purple-300" />
        {items.map((t, i) => (
          <div
            key={i}
            className="relative mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: `${i * 0.25}s`, animationFillMode: "forwards" }}
          >
            <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100" />
            <div className="font-serif italic text-neutral-700 text-lg">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FINAL COUNTDOWN — in-person reveal ---------------- */

function FinalCountdownScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [now, setNow] = useState(Date.now());
  const target = useRef(getFinalSurpriseDate().getTime());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const d = Math.max(0, target.current - now);
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  return (
    <PageShell tint="purple" title="One Last Surprise…">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex gap-3">
          <TimeBoxLight value={days} label="Days" />
          <TimeBoxLight value={pad(hours)} label="Hrs" />
          <TimeBoxLight value={pad(mins)} label="Min" />
          <TimeBoxLight value={pad(secs)} label="Sec" />
        </div>
        <div className="mt-8 font-serif italic text-2xl text-neutral-700 text-center">
          I'll be waiting for you ❤️
        </div>
      </div>
      <ContinueButton onClick={onContinue} onBack={onBack} label="Continue" />
    </PageShell>
  );
}

function TimeBoxLight({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="min-w-[64px] px-3 py-2 rounded-xl bg-white/90 border border-white shadow flex flex-col items-center">
      <div className="text-2xl font-medium tabular-nums text-neutral-800">{value}</div>
      <div className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase mt-0.5">
        {label}
      </div>
    </div>
  );
}

/* ---------------- FINAL SCREEN ---------------- */

function FinalScreen() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), 1600);
    const t2 = window.setTimeout(() => setPhase(2), 3400);
    const t3 = window.setTimeout(() => setPhase(3), 5200);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="space-y-6 max-w-md">
        <p
          className="font-serif italic text-2xl transition-opacity duration-1000"
          style={{ opacity: phase >= 0 ? 1 : 0 }}
        >
          Thank you for choosing me.
        </p>
        <p
          className="font-serif italic text-2xl transition-opacity duration-1000"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          A coded birthday from your boyfriend, to a very special lady.
        </p>
        <p
          className="font-serif italic text-2xl transition-opacity duration-1000"
          style={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          See you soon, Mokge. ❤️
        </p>
      </div>
      <button
        onClick={() => { if (typeof window !== "undefined") window.location.reload(); }}
        className="mt-14 rounded-full px-10 py-4 text-white font-medium shadow-xl transition"
        style={{
          background: "linear-gradient(90deg,#ec4899 0%,#a855f7 100%)",
          boxShadow: "0 20px 50px -10px rgba(236,72,153,0.5)",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 1s, transform 1s",
        }}
      >
        ❤️ Until then
      </button>
    </div>
  );
}

/* ---------------- SHARED PAGE SHELL ---------------- */

function PageShell({
  children,
  title,
  tint = "rose",
}: {
  children: React.ReactNode;
  title?: string;
  tint?: "rose" | "amber" | "purple" | "cream";
}) {
  const bg: Record<string, string> = {
    rose: "linear-gradient(135deg,#fef3f2 0%,#ffe4e6 30%,#fce7f3 55%,#e0f2fe 100%)",
    amber: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 40%,#fce7f3 100%)",
    purple: "linear-gradient(135deg,#faf5ff 0%,#fce7f3 50%,#e0e7ff 100%)",
    cream: "linear-gradient(135deg,#fffdf7 0%,#fef6e4 60%,#fdf2f8 100%)",
  };
  return (
    <div className="relative min-h-screen animate-fade-in overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: bg[tint] }} />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(244,114,182,0.35), transparent 45%), radial-gradient(circle at 80% 20%, rgba(251,191,36,0.3), transparent 40%), radial-gradient(circle at 70% 80%, rgba(168,85,247,0.25), transparent 45%)",
          filter: "blur(20px)",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-16">
        {title && (
          <h2 className="mb-10 font-serif italic text-3xl text-neutral-800 text-center">
            {title}
          </h2>
        )}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function ContinueButton({
  onClick,
  onBack,
  label = "Continue",
  disabled = false,
}: {
  onClick: () => void;
  onBack?: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-12 flex items-center gap-4">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-neutral-700 bg-white/80 backdrop-blur border border-white shadow btn-back-soft"
        >
          <span>←</span> Back
        </button>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-3 rounded-full px-8 py-3 text-white font-medium shadow-lg btn-heartbeat disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none"
        style={{
          background: "linear-gradient(90deg,#f9a8d4 0%,#c084fc 100%)",
          boxShadow: "0 15px 40px -10px rgba(192,132,252,0.6)",
        }}
      >
        {label} <span className="btn-arrow">→</span>
      </button>
      <style>{`
        @keyframes btn-heartbeat {
          0%,100% { transform: scale(1); box-shadow: 0 15px 40px -10px rgba(192,132,252,0.6); }
          20%     { transform: scale(1.045); box-shadow: 0 20px 55px -10px rgba(236,72,153,0.7); }
          40%     { transform: scale(0.985); }
          60%     { transform: scale(1.02); }
        }
        .btn-heartbeat:not(:disabled) { animation: btn-heartbeat 2.6s ease-in-out infinite; }
        .btn-heartbeat:not(:disabled):hover .btn-arrow { transform: translateX(4px); }
        .btn-arrow { transition: transform 0.3s ease; display: inline-block; }
        @keyframes btn-back-breath {
          0%,100% { transform: translateX(0); opacity: 0.9; }
          50%     { transform: translateX(-3px); opacity: 1; }
        }
        .btn-back-soft { animation: btn-back-breath 3.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ---------------- PARTY POPPER (unchanged) ---------------- */

function PartyPopper({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute pointer-events-none z-10 birthday-confetti-cone"
      data-flipped={!isLeft}
      style={{
        [isLeft ? "left" : "right"]: "1%",
        top: "36%",
        width: 260,
        height: 260,
        transform: isLeft ? undefined : "scaleX(-1)",
      } as React.CSSProperties}
    >
      <div className="cone-motion">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="40 80 320 310" focusable="false" width="100%" height="100%">
          <g className="bd-anim-cone" style={{ transformOrigin: "200px 50px" }}>
            <path className="bd-fill-0" d="M131.5,172.6L196,343c2.3,6.1,11,6.1,13.4,0l65.5-170.7L131.5,172.6z" />
            <path className="bd-fill-1" d="M131.5,172.6L196,343c2.3,6.1,11,6.1,13.4,0l6.7-17.5l-53.6-152.9L131.5,172.6z" />
            <path className="bd-fill-2" d="M274.2,184.2c-1.8,1.8-4.2,2.9-7,2.9l-129.5,0.4c-5.4,0-9.8-4.4-9.8-9.8c0-5.4,4.4-9.8,9.9-9.9l129.5-0.4c5.4,0,9.8,4.4,9.8,9.8C277,180,275.9,182.5,274.2,184.2z" />
            <polygon className="bd-fill-3" points="231.5,285.4 174.2,285.5 143.8,205.1 262.7,204.7" />
            <path className="bd-fill-4" d="M166.3,187.4l-28.6,0.1c-5.4,0-9.8-4.4-9.8-9.8c0-5.4,4.4-9.8,9.9-9.9l24.1-0.1c0,0-2.6,5-1.3,10.6C161.8,183.7,166.3,187.4,166.3,187.4z" />
            <ellipse className="bd-fill-2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -89.8523 231.0278)" cx="233.9" cy="224" rx="5.6" ry="5.6" />
            <path className="bd-fill-5" d="M143.8,205.1l5.4,14.3c6.8-2.1,14.4-0.5,19.7,4.8c7.7,7.7,7.6,20.1-0.1,27.8c-1.7,1.7-3.7,3-5.8,4l11.1,29.4l27.7,0l-28-80.5L143.8,205.1z" />
            <path className="bd-fill-2" d="M169,224.2c-5.3-5.3-13-6.9-19.7-4.8l13.9,36.7c2.1-1,4.1-2.3,5.8-4C176.6,244.4,176.6,231.9,169,224.2z" />
            <ellipse className="bd-fill-6" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -119.0946 221.1253)" cx="207.4" cy="254.3" rx="11.3" ry="11.2" />
          </g>
          <circle className="bd-fill-2 bd-anim-b" cx="195.2" cy="232.6" r="5.1" style={{ transformOrigin: "195.2px 232.6px" }} />
          <circle className="bd-fill-0 bd-anim-b" cx="230.8" cy="219.8" r="5.4" style={{ transformOrigin: "230.8px 219.8px" }} />
          <circle className="bd-fill-0 bd-anim-c" cx="178.9" cy="160.4" r="4.2" style={{ transformOrigin: "178.9px 156.2px" }} />
          <circle className="bd-fill-6 bd-anim-d" cx="132.8" cy="123.6" r="5.4" style={{ transformOrigin: "133px 118px" }} />
          <circle className="bd-fill-0 bd-anim-d" cx="151.9" cy="105.1" r="5.4" style={{ transformOrigin: "152px 100px" }} />
          <path className="bd-fill-0 bd-anim-d" style={{ transformOrigin: "127px 176px" }} d="M129.9,176.1l-5.7,1.3c-1.6,0.4-2.2,2.3-1.1,3.5l3.8,4.2c1.1,1.2,3.1,0.8,3.6-0.7l1.9-5.5C132.9,177.3,131.5,175.7,129.9,176.1z" />
          <path className="bd-fill-6 bd-anim-b" style={{ transformOrigin: "282.3px 170.6px" }} d="M284.5,170.7l-5.4,1.2c-1.5,0.3-2.1,2.2-1,3.3l3.6,3.9c1,1.1,2.9,0.8,3.4-0.7l1.8-5.2C287.4,171.9,286.1,170.4,284.5,170.7z" />
          <circle className="bd-fill-6 bd-anim-c" cx="206.7" cy="144.4" r="4.5" style={{ transformOrigin: "206.7px 140px" }} />
          <path className="bd-fill-2 bd-anim-c" style={{ transformOrigin: "174.8px 183.4px" }} d="M176.4,192.3h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2C179.3,191,178,192.3,176.4,192.3z" />
          <path className="bd-fill-2 bd-anim-b" style={{ transformOrigin: "262px 188.5px" }} d="M263.7,197.4h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2C266.5,196.1,265.2,197.4,263.7,197.4z" />
          <path className="bd-streamer" d="M179.7,102.4c0,0,6.6,15.3-2.3,25c-8.9,9.7-24.5,9.7-29.7,15.6c-5.2,5.9-0.7,18.6,3.7,28.2c4.5,9.7,2.2,23-10.4,28.2" />
          <path className="bd-streamer" d="M252.2,156.1c0,0-16.9-3.5-28.8,2.4c-11.9,5.9-14.9,17.8-16.4,29c-1.5,11.1-4.3,28.8-31.5,33.4" />
          <path className="bd-fill-0 bd-anim-a" style={{ transformOrigin: "276px 246px" }} d="M277.5,254.8h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2C280.4,253.5,279.1,254.8,277.5,254.8z" />
          <path className="bd-fill-3 bd-anim-c" style={{ transformOrigin: "213.5px 120.2px" }} d="M215.2,121.3L215.2,121.3c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3l0,0c-0.5,0.4-0.7,1.1-0.6,1.7v0c0.3,1.6-1.4,2.8-2.8,2l0,0c-0.6-0.3-1.2-0.3-1.8,0h0c-1.4,0.7-3.1-0.5-2.8-2v0c0.1-0.6-0.1-1.3-0.6-1.7l0,0c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1v0C212.5,119.8,214.5,119.8,215.2,121.3z" />
          <path className="bd-fill-3 bd-anim-b" style={{ transformOrigin: "222.8px 190.6px" }} d="M224.5,191.7L224.5,191.7c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3v0c-0.5,0.4-0.7,1.1-0.6,1.7l0,0c0.3,1.6-1.4,2.8-2.8,2h0c-0.6-0.3-1.2-0.3-1.8,0l0,0c-1.4,0.7-3.1-0.5-2.8-2l0,0c0.1-0.6-0.1-1.3-0.6-1.7v0c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1l0,0C221.7,190.2,223.8,190.2,224.5,191.7z" />
          <path className="bd-fill-3 bd-anim-a" style={{ transformOrigin: "310.9px 241px" }} d="M312.6,242.1L312.6,242.1c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3l0,0c-0.5,0.4-0.7,1.1-0.6,1.7v0c0.3,1.6-1.4,2.8-2.8,2l0,0c-0.6-0.3-1.2-0.3-1.8,0h0c-1.4,0.7-3.1-0.5-2.8-2v0c0.1-0.6-0.1-1.3-0.6-1.7l0,0c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1v0C309.9,240.6,311.9,240.6,312.6,242.1z" />
          <path className="bd-streamer" d="M290.7,215.4c0,0-14.4-3.4-22.6,2.7c-8.2,6.2-8.2,23.3-17.1,29.4c-8.9,6.2-19.8-2.7-32.2-4.1c-12.3-1.4-19.2,5.5-20.5,10.9" />
        </svg>
      </div>
      <style>{`
        .birthday-confetti-cone { display: block; }
        .birthday-confetti-cone .cone-motion { width: 100%; height: 100%; }
        .birthday-confetti-cone .bd-fill-0 { fill: #fbbf24; }
        .birthday-confetti-cone .bd-fill-1 { fill: #f59e0b; }
        .birthday-confetti-cone .bd-fill-2 { fill: #ec4899; }
        .birthday-confetti-cone .bd-fill-3 { fill: #d946ef; }
        .birthday-confetti-cone .bd-fill-4 { fill: #fef3c7; }
        .birthday-confetti-cone .bd-fill-5 { fill: #a855f7; }
        .birthday-confetti-cone .bd-fill-6 { fill: #22d3ee; }
        .birthday-confetti-cone .bd-streamer {
          fill: none; stroke: #fbbf24; stroke-width: 2.5;
          stroke-linecap: round; stroke-dasharray: 3 6;
          animation: bd-streamer-dance 3.2s ease-in-out infinite;
        }
        .birthday-confetti-cone .bd-anim-cone { animation: bd-cone-shake 2.4s ease-in-out infinite; }
        .birthday-confetti-cone .bd-anim-a { animation: bd-pop 1.8s ease-in-out infinite; }
        .birthday-confetti-cone .bd-anim-b { animation: bd-pop 1.8s ease-in-out infinite; animation-delay: 0.3s; }
        .birthday-confetti-cone .bd-anim-c { animation: bd-pop 1.8s ease-in-out infinite; animation-delay: 0.6s; }
        .birthday-confetti-cone .bd-anim-d { animation: bd-pop 1.8s ease-in-out infinite; animation-delay: 0.9s; }
        @keyframes bd-cone-shake {
          0%,100% { transform: rotate(0deg) translate(0,0); }
          25% { transform: rotate(-4deg) translate(-2px,2px); }
          50% { transform: rotate(0deg) translate(0,0); }
          75% { transform: rotate(4deg) translate(2px,-2px); }
        }
        @keyframes bd-pop {
          0%,100% { transform: scale(1) translateY(0); opacity: 1; }
          40% { transform: scale(1.35) translateY(-4px); opacity: 1; }
          70% { transform: scale(0.8) translateY(2px); opacity: 0.75; }
        }
        @keyframes bd-streamer-dance {
          0%,100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: -18; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- EASTER EGGS ---------------- */

const HEART_NOTES = [
  "You look beautiful.",
  "I still get nervous around you.",
  "I'm smiling while building this.",
  "I'll choose you every single time.",
  "You're my favourite prayer answered.",
];

function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; x: number; y: number; note?: string }[]
  >([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const id = ++idRef.current;
      setHearts((h) => [
        ...h,
        {
          id,
          x: 5 + Math.random() * 90,
          y: 20 + Math.random() * 60,
        },
      ]);
      window.setTimeout(() => {
        setHearts((h) => h.filter((x) => x.id !== id));
      }, 9000);
    };
    const iv = window.setInterval(spawn, 6500);
    spawn();
    return () => window.clearInterval(iv);
  }, []);

  const tap = (id: number) => {
    const note = HEART_NOTES[Math.floor(Math.random() * HEART_NOTES.length)];
    setHearts((h) => h.map((x) => (x.id === id ? { ...x, note } : x)));
    window.setTimeout(() => {
      setHearts((h) => h.filter((x) => x.id !== id));
    }, 3200);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {hearts.map((h) => (
        <button
          key={h.id}
          onClick={() => tap(h.id)}
          className="absolute pointer-events-auto text-2xl"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            animation: "heart-float 9s ease-in-out forwards",
          }}
        >
          {h.note ? (
            <span className="inline-block bg-white/95 shadow-lg rounded-full px-4 py-2 text-sm font-serif italic text-neutral-700 animate-fade-in">
              {h.note}
            </span>
          ) : (
            <span className="drop-shadow-md">❤️</span>
          )}
        </button>
      ))}
      <style>{`
        @keyframes heart-float {
          0% { transform: translateY(20px) scale(0.6); opacity: 0; }
          15% { transform: translateY(0) scale(1); opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-40px) scale(0.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const STAR_NOTES = ["Your laugh.", "Your hugs.", "Your faith.", "Your heart."];

function FloatingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: 3 + Math.random() * 4,
        delay: Math.random() * 6,
      })),
    [],
  );
  const [note, setNote] = useState<{ x: number; y: number; text: string } | null>(null);

  const tap = (x: number, y: number) => {
    setNote({
      x, y,
      text: STAR_NOTES[Math.floor(Math.random() * STAR_NOTES.length)],
    });
    window.setTimeout(() => setNote(null), 2600);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {stars.map((s) => (
        <button
          key={s.id}
          onClick={() => tap(s.x, s.y)}
          className="absolute pointer-events-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: 0.25,
            animation: `star-twinkle ${s.d}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
      {note && (
        <div
          className="absolute animate-fade-in bg-black/70 text-white text-xs italic px-3 py-1.5 rounded-full backdrop-blur"
          style={{ left: `${note.x}%`, top: `${note.y}%`, transform: "translate(-50%,-140%)" }}
        >
          {note.text}
        </div>
      )}
      <style>{`
        @keyframes star-twinkle {
          0%,100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

function MusicButton({
  on,
  loading,
  onToggle,
}: {
  on: boolean;
  loading?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={
        loading
          ? "Loading your favourite song"
          : on
            ? "Pause your favourite song"
            : "Play your favourite song"
      }
      className="fixed bottom-5 right-5 z-50 rounded-full bg-white/95 backdrop-blur pl-3 pr-4 py-2.5 text-sm text-neutral-700 shadow-lg border border-white flex items-center gap-2 hover:shadow-xl transition music-btn-float"
    >
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs"
        style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)" }}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : on ? (
          "⏸"
        ) : (
          "▶"
        )}
      </span>
      <span className="font-medium whitespace-nowrap">
        {loading ? "Loading…" : on ? "Pause" : "Play"}
      </span>
      <span className="text-neutral-500 text-xs italic whitespace-nowrap">
        {loading ? "one moment, warming it up" : "your favourite song, while you wait"}
      </span>

      <style>{`
        @keyframes music-btn-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }
        .music-btn-float { animation: music-btn-float 3s ease-in-out infinite; }
      `}</style>
    </button>
  );
}
