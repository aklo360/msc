import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export function meta() {
  return [
    {title: 'Dark Room — Visual Treatment | Manhattan Mal & Mr Star City'},
    {
      name: 'description',
      content:
        'Official music video treatment / trailer previz for Dark Room by Manhattan Mal and Mr Star City.',
    },
  ];
}

/* ------------------------------------------------------------------ */
/* MSC brand tokens (Pedro design system)                              */
/* ------------------------------------------------------------------ */

const ACCENTS = {
  art: '#FF9E70',
  music: '#FFD770',
  projects: '#92D073',
  shop: '#73B9D0',
  bless: '#D073A5',
  red: '#F46060',
} as const;

type WorldKey = 'penthouse' | 'trap' | 'void' | 'club' | 'bridge' | 'darkroom';

const WORLDS: Record<WorldKey, {accent: string; label: string; tone: 'light' | 'dark'}> = {
  penthouse: {accent: ACCENTS.art, label: 'Penthouse — present', tone: 'light'},
  trap: {accent: ACCENTS.red, label: 'Trap house — past', tone: 'dark'},
  void: {accent: ACCENTS.music, label: 'Dark room — void', tone: 'dark'},
  club: {accent: ACCENTS.bless, label: 'Club — opulence', tone: 'dark'},
  bridge: {accent: ACCENTS.projects, label: 'LES · Manhattan Bridge', tone: 'dark'},
  darkroom: {accent: ACCENTS.shop, label: 'Darkroom — VFX', tone: 'dark'},
};

/* The iconic reel — one hero still per iconic moment, in treatment order.
   tc = start second (drives PLAY-mode audio sync). polaroid renders the shot
   as a developing print on the darkroom backdrop. */
type Shot = {
  id: string;
  tc: number;
  world: WorldKey;
  lyric: string;
  ken: 'push' | 'pan-l' | 'pan-r' | 'tilt';
  polaroid?: boolean;
};

const SHOTS: Shot[] = [
  {id: 'terrace', tc: 0, world: 'penthouse', lyric: 'I feel like I’m running in place', ken: 'push'},
  {id: 'foyer', tc: 22, world: 'penthouse', lyric: 'Smiling, but I did some dark things to get to this cake', ken: 'pan-l'},
  {id: 'trap-serve', tc: 25, world: 'trap', lyric: 'In my dark room, just left the club, it’s back to my dark room', ken: 'push'},
  {id: 'void', tc: 39, world: 'void', lyric: 'Hit the lights, cockroaches running on the floor', ken: 'push'},
  {id: 'club', tc: 79, world: 'club', lyric: 'Met Marley in the club, smoking on a cig', ken: 'push'},
  {id: 'robes-duo', tc: 90, world: 'penthouse', lyric: 'This the shit we dreamt about, growing up as kids', ken: 'pan-l'},
  {id: 'bridge', tc: 96, world: 'bridge', lyric: 'LES + Chinatown — the base of the Manhattan Bridge', ken: 'push'},
  {id: 'pipe', tc: 116, world: 'trap', lyric: 'Smelt the skin when her stem was burning her lips', ken: 'push'},
  {id: 'darkroom', tc: 123, world: 'darkroom', lyric: 'Praying the feds don’t got a dark room with photos developed', ken: 'pan-r'},
];

const RUNTIME = 165; // 2:45 in seconds

// Asset base. The MSC route serves images at /darkroom/*. The standalone
// aklo.studio export sets window.__DR_BASE__ = '/darkroomtreatment' before the
// bundle runs, so the whole deck is self-contained under one folder.
const ASSET_BASE =
  typeof window !== 'undefined' && (window as {__DR_BASE__?: string}).__DR_BASE__
    ? String((window as {__DR_BASE__?: string}).__DR_BASE__).replace(/\/+$/, '')
    : '';

/* ------------------------------------------------------------------ */
/* Deck stylesheet — 16:9 frame, cqw-proportional type, seam engine    */
/* ------------------------------------------------------------------ */

const DECK_CSS = `
.drRoot {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  background: #000;
  color: #fff;
  font-family: 'ABC Diatype', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-feature-settings: 'salt' 1;
  overflow: hidden;
}
.drStage {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  min-height: 0;
  padding: 14px 6px 6px;
}
.drFrameWrap { display: flex; align-items: center; justify-content: center; height: 100%; min-width: 0; min-height: 0; }
.drFrame {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  container-type: inline-size;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
  box-shadow: 0 30px 110px rgba(0, 0, 0, 0.66);
}
.drArrow {
  appearance: none; border: 0; background: transparent;
  color: rgba(255, 255, 255, 0.5); font-size: 30px; font-weight: 200; line-height: 1;
  height: 84px; cursor: pointer; transition: color 0.15s ease; padding: 0;
}
.drArrow:hover:not(:disabled) { color: #fff; }
.drArrow:disabled { color: rgba(255, 255, 255, 0.14); cursor: default; }

/* ---------------- transport ---------------- */
.drTransport {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 16px 0; max-width: 1180px; margin: 0 auto; width: 100%;
}
.drPlay {
  appearance: none; border: 0; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  background: #fff; color: #000; border-radius: 20px; padding: 8px 15px;
  font-family: inherit; font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.03em; line-height: 1; white-space: nowrap;
  transition: transform 0.12s ease, background 0.15s ease;
}
.drPlay:hover { transform: translateY(-1px); }
.drPlay .tri { font-size: 10px; }
.drProg { flex: 1; height: 3px; border-radius: 3px; background: rgba(255,255,255,0.14); overflow: hidden; }
.drProgFill { height: 100%; background: #fff; width: 0%; transition: width 0.2s linear; }
.drProgTc { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); font-variant-numeric: tabular-nums; }

.drRail {
  display: flex; align-items: center; justify-content: flex-start; gap: 5px;
  padding: 9px 14px 14px; overflow-x: auto; scrollbar-width: none;
}
.drRail::-webkit-scrollbar { display: none; }
.drRailInner { display: flex; gap: 5px; margin: 0 auto; align-items: center; }
.drDot {
  appearance: none; border: 0; display: inline-flex; align-items: center; gap: 7px;
  border-radius: 20px; padding: 8px 12px; background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55); font-family: inherit; font-size: 11px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.02em; line-height: 1; white-space: nowrap;
  cursor: pointer; transition: background 0.15s ease, color 0.15s ease;
}
.drDot:hover { background: rgba(255, 255, 255, 0.16); color: #fff; }
.drDot.on { background: #fff; color: #000; }
.drDot .num { opacity: 0.55; }
.drDot.on .num { opacity: 0.4; }
.drDotTitle { display: none; }
@media (min-width: 900px) { .drDotTitle { display: inline; } }
@media (max-width: 640px) {
  .drStage { grid-template-columns: 6px minmax(0, 1fr) 6px; }
  .drArrow { visibility: hidden; width: 0; overflow: hidden; }
}

/* ---------------- transition layers + seam ---------------- */
.drLayer { position: absolute; inset: 0; }
.drLayerIn { animation: drIn 560ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.drLayerOut { animation: drOut 520ms ease both; z-index: 1; }
@keyframes drIn { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: scale(1); } }
@keyframes drOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.965); } }

.drSeam { position: absolute; inset: 0; z-index: 5; pointer-events: none; animation: drSeam 640ms ease-out both; }
.drSeam .wash {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 60% at 50% 42%, rgba(220,32,32,0.55) 0%, rgba(120,12,12,0.7) 45%, rgba(20,0,0,0.94) 100%);
}
.drSeam .line { position: absolute; left: -4%; right: -4%; height: 1px; background: rgba(255,190,190,0.5); }
.drSeam .line.a { top: 26%; }
.drSeam .line.b { top: 68%; }
.drSeam .pola {
  position: absolute; top: 50%; left: 50%; width: 15cqw; height: 17.5cqw;
  transform: translate(-50%, -50%) rotate(-4deg);
  background: #f6f4ee; border-radius: 2px; padding: 0.8cqw 0.8cqw 2.6cqw;
  box-shadow: 0 2cqw 5cqw rgba(0,0,0,0.6);
}
.drSeam .pola i { display: block; width: 100%; height: 100%; background: linear-gradient(160deg, #2a0d0d, #060202); }
@keyframes drSeam { 0% { opacity: 0; } 30% { opacity: 0.96; } 60% { opacity: 0.9; } 100% { opacity: 0; } }

/* ---------------- slide base ---------------- */
.drSlide { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 3.1cqw 3.4cqw; overflow: hidden; }
.drSlide.light { background: #EDEDED; color: #000; }
.drSlide.dark { background: #000; color: #fff; }

.drHead { display: flex; align-items: center; justify-content: space-between; gap: 1.4cqw; margin-bottom: 2.1cqw; flex: none; }
.drHeadLeft { display: flex; align-items: center; gap: 0.7cqw; }
.drHeadMeta { display: flex; align-items: center; gap: 0.9cqw; font-size: 0.92cqw; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; }
.light .drHeadMeta { color: rgba(0, 0, 0, 0.45); }
.dark .drHeadMeta { color: rgba(255, 255, 255, 0.45); }
.drHeadRule { width: 3.2cqw; height: 1px; }
.light .drHeadRule { background: rgba(0, 0, 0, 0.25); }
.dark .drHeadRule { background: rgba(255, 255, 255, 0.25); }

.drBody { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.drDisplay { font-family: 'StarCity', 'ABC Diatype', sans-serif; font-weight: 700; font-feature-settings: 'dlig' 1; line-height: 0.9; margin: 0; }
.drPill {
  display: inline-flex; align-items: center; border-radius: 2cqw; padding: 0.62cqw 0.95cqw;
  font-size: 0.88cqw; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1; white-space: nowrap;
}
.drPill.inkOnWhite { background: #fff; color: #000; }
.drPill.whiteOnInk { background: #000; color: #fff; }
.drPill.ghostDark { border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.85); }
.drPill.ghostLight { border: 1px solid rgba(0,0,0,0.3); color: rgba(0,0,0,0.75); }
.drEyebrow { font-size: 1.02cqw; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 1.1cqw; }
.drLede { font-weight: 400; margin: 0; }

/* ---------------- reel shot ---------------- */
.drShot { position: absolute; inset: 0; overflow: hidden; background: #000; }
.drShotImg {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transform-origin: center; will-change: transform;
}
.drShot.ken-push .drShotImg { animation: drKenPush 15s ease-out both; }
.drShot.ken-pan-l .drShotImg { animation: drKenPanL 15s ease-out both; }
.drShot.ken-pan-r .drShotImg { animation: drKenPanR 15s ease-out both; }
.drShot.ken-tilt .drShotImg { animation: drKenTilt 15s ease-out both; }
@keyframes drKenPush { from { transform: scale(1.001); } to { transform: scale(1.1); } }
@keyframes drKenPanL { from { transform: scale(1.1) translateX(2.5%); } to { transform: scale(1.1) translateX(-2.5%); } }
@keyframes drKenPanR { from { transform: scale(1.1) translateX(-2.5%); } to { transform: scale(1.1) translateX(2.5%); } }
@keyframes drKenTilt { from { transform: scale(1.1) translateY(2.5%); } to { transform: scale(1.1) translateY(-2.5%); } }

/* subtle cinematic matte + vignette */
.drShotMatte { position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.78) 100%),
    radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%);
}
.drShotCap { position: absolute; left: 3.2cqw; right: 3.2cqw; bottom: 2.6cqw; z-index: 2; }
.drShotMeta { display: flex; align-items: center; gap: 0.8cqw; margin-bottom: 0.9cqw; }
.drShotWorld {
  display: inline-flex; align-items: center; gap: 0.6cqw; border-radius: 2cqw; padding: 0.55cqw 0.9cqw;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
  font-size: 0.86cqw; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #fff; line-height: 1;
}
.drShotWorld .d { width: 0.7cqw; height: 0.7cqw; border-radius: 50%; }
.drShotTc { font-size: 0.86cqw; font-weight: 600; color: rgba(255,255,255,0.65); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; }
.drShotLyric {
  margin: 0; font-family: 'StarCity', 'ABC Diatype', sans-serif; font-weight: 500; font-feature-settings: 'dlig' 1;
  font-size: 2.5cqw; line-height: 1.04; color: #fff; max-width: 74cqw; text-shadow: 0 0.2cqw 1.6cqw rgba(0,0,0,0.7);
}
.drShotHead { position: absolute; top: 2.6cqw; left: 3.2cqw; right: 3.2cqw; z-index: 2;
  display: flex; align-items: center; justify-content: space-between; }
.drShotIdx { font-size: 0.86cqw; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.6); }

/* portal-as-polaroid presentation */
.drShot.pola { background: #100404; display: flex; align-items: center; justify-content: center; }
.drShot.pola .drShotBg { position: absolute; inset: 0;
  background: radial-gradient(60% 60% at 50% 44%, rgba(150,20,20,0.5) 0%, rgba(40,4,4,0.9) 70%, #0b0202 100%); }
.drPolaCard { position: relative; z-index: 2; background: #f6f4ee; border-radius: 3px;
  padding: 1.1cqw 1.1cqw 4.4cqw; box-shadow: 0 3cqw 7cqw rgba(0,0,0,0.65); transform: rotate(-3deg); width: 34cqw; max-width: 60%; }
.drPolaCard img { display: block; width: 100%; aspect-ratio: 4/5; object-fit: cover; }
.drPolaCard .cap { position: absolute; left: 1.2cqw; right: 1.2cqw; bottom: 1.1cqw;
  font-family: 'ABC Diatype', sans-serif; font-size: 1.05cqw; line-height: 1.1; color: #1a1a1a; font-weight: 500; }
.drShot.pola .drShotCap { text-align: left; }

@media (prefers-reduced-motion: reduce) {
  .drLayerIn, .drLayerOut, .drSeam, .drShot .drShotImg { animation: none !important; }
  .drSeam { display: none; }
}
`;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Head({index, label, tone}: {index: number; label: string; tone: 'light' | 'dark'}) {
  return (
    <header className="drHead">
      <div className="drHeadLeft">
        <span className={`drPill ${tone === 'light' ? 'whiteOnInk' : 'inkOnWhite'}`}>MSC</span>
        <span className={`drPill ${tone === 'light' ? 'ghostLight' : 'ghostDark'}`}>
          Dark Room — Visual Treatment
        </span>
      </div>
      <div className="drHeadMeta">
        <span>{label}</span>
        <span className="drHeadRule" />
        <span>
          {String(index + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
        </span>
      </div>
    </header>
  );
}

function Slide({tone, children}: {tone: 'light' | 'dark'; children: ReactNode}) {
  return <article className={`drSlide ${tone}`}>{children}</article>;
}

/* ------------------------------------------------------------------ */
/* Reel shot — the flowing iconic still                                */
/* ------------------------------------------------------------------ */

function ReelShot({shot, position}: {shot: Shot; position: number}) {
  const world = WORLDS[shot.world];
  const src = `${ASSET_BASE}/darkroom/${shot.id}.jpg`;

  if (shot.polaroid) {
    return (
      <div className="drShot pola">
        <div className="drShotBg" aria-hidden />
        <div className="drShotHead">
          <span className="drShotIdx">Reel · {String(position).padStart(2, '0')}</span>
          <span className="drShotTc">{fmt(shot.tc)}</span>
        </div>
        <div className="drPolaCard">
          <img alt={shot.lyric} src={src} />
          <span className="cap">“{shot.lyric}”</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`drShot ken-${shot.ken}`}>
      <img alt={shot.lyric} className="drShotImg" src={src} />
      <div className="drShotMatte" aria-hidden />
      <div className="drShotHead">
        <span className="drShotIdx">Reel · {String(position).padStart(2, '0')}</span>
        <span className="drShotTc">{fmt(shot.tc)}</span>
      </div>
      <div className="drShotCap">
        <div className="drShotMeta">
          <span className="drShotWorld">{world.label}</span>
        </div>
        <p className="drShotLyric">“{shot.lyric}”</p>
      </div>
    </div>
  );
}

function SeamOverlay() {
  return (
    <div className="drSeam" aria-hidden>
      <div className="wash" />
      <div className="line a" />
      <div className="line b" />
      <div className="pola">
        <i />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Cover                                                          */
/* ------------------------------------------------------------------ */

function CoverSlide() {
  return (
    <Slide tone="dark">
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${ASSET_BASE}/darkroom/darkroom.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          filter: 'saturate(1.1)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 60% at 50% 40%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.72) 62%, rgba(0,0,0,0.94) 100%)',
        }}
      />
      <img
        aria-hidden
        alt=""
        src={`${ASSET_BASE}/darkroom/bulb.jpg`}
        style={{
          position: 'absolute',
          top: '-3cqw',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '38cqw',
          width: 'auto',
          zIndex: 1,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      <header className="drHead" style={{position: 'relative', zIndex: 2}}>
        <div className="drHeadLeft">
          <span className="drPill ghostDark">Official Music Video Treatment</span>
        </div>
        <div className="drHeadMeta">
          <span>v1.0</span>
          <span className="drHeadRule" />
          <span>RT 2:45</span>
        </div>
      </header>

      <div className="drBody" style={{position: 'relative', zIndex: 2}} />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <h1 className="drDisplay" style={{fontSize: '13cqw', letterSpacing: '0.01em', margin: 0}}>
          DARK ROOM
        </h1>
        <p
          style={{
            margin: '2cqw 0 0',
            fontSize: '1.35cqw',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Manhattan Mal&ensp;&times;&ensp;Mr Star City
        </p>
      </div>

      <footer style={{flex: 'none', position: 'relative', zIndex: 2}}>
        <div style={{height: '1px', background: 'rgba(255,255,255,0.16)'}} />
      </footer>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Synopsis                                                       */
/* ------------------------------------------------------------------ */

function SynopsisSlide({index}: {index: number}) {
  return (
    <Slide tone="dark">
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(88% 108% at 50% 36%, rgba(128,20,20,0.62) 0%, rgba(48,8,8,0.92) 55%, #0a0202 100%)',
        }}
      />
      <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0}}>
        <Head index={index} label="Synopsis" tone="dark" />
        <div className="drBody" style={{justifyContent: 'center'}}>
          <div style={{display: 'grid', gridTemplateColumns: '0.94fr 1.06fr', gap: '3.6cqw', alignItems: 'center'}}>
            <div>
              <p className="drEyebrow" style={{color: 'rgba(255,255,255,0.5)'}}>
                Synopsis
              </p>
              <h2 className="drDisplay" style={{color: '#fff', lineHeight: 0.9}}>
                <span style={{display: 'block', fontSize: '4.4cqw'}}>Success,</span>
                <span style={{display: 'block', fontSize: '3.5cqw'}}>haunted by</span>
                <span style={{display: 'block', fontSize: '3.5cqw'}}>survival.</span>
              </h2>
            </div>
            <div
              style={{
                background: '#f4f1ea',
                borderRadius: '0.4cqw',
                padding: '1.4cqw 1.4cqw 3.4cqw',
                transform: 'rotate(0.8deg)',
                boxShadow: '0 3cqw 7cqw rgba(0,0,0,0.62)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(155deg, #200808, #070202 72%)',
                  borderRadius: '0.15cqw',
                  padding: '2.4cqw 2.6cqw',
                  display: 'grid',
                  gap: '1.15cqw',
                }}
              >
                <p className="drLede" style={{fontSize: '1.24cqw', lineHeight: 1.36, color: 'rgba(255,255,255,0.88)'}}>
                  Mal begins in a clean, expensive present — a luxury condo above
                  Manhattan. As the song turns, flashes of the past invade the
                  space: a dirty trap-house room overlays the pristine interior as
                  memories refuse to stay buried.
                </p>
                <p className="drLede" style={{fontSize: '1.24cqw', lineHeight: 1.36, color: 'rgba(255,255,255,0.88)'}}>
                  The video moves between three worlds — glossy present colliding
                  with trap-house past, a fisheye one-bulb black-room performance,
                  and an LES &amp; Chinatown street scene at the base of the
                  Manhattan Bridge with Mal and Star.
                </p>
                <p className="drLede" style={{fontSize: '1.24cqw', lineHeight: 1.36, color: 'rgba(255,255,255,0.88)'}}>
                  Polaroid freeze-frames stitch it together: the camera zooms out
                  of frozen moments into a VFX darkroom of photos developing on a
                  clothesline — then dives back into the next scene.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Scene system                                                   */
/* ------------------------------------------------------------------ */

const SCENES = [
  {n: '01', name: 'Penthouse Present', img: 'terrace', kind: 'Real'},
  {n: '02', name: 'Trap House Past', img: 'trap-serve', kind: 'Real'},
  {n: '03', name: 'Dark Room Void', img: 'void', kind: 'Real'},
  {n: '04', name: 'Manhattan Bridge Base', img: 'bridge', kind: 'Real'},
  {n: '05', name: 'Virtual Dark Room', img: 'darkroom', kind: 'AI'},
];

function SystemSlide({index}: {index: number}) {
  return (
    <Slide tone="dark">
      <Head index={index} label="Scenes" tone="dark" />
      <div className="drBody" style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '1.6cqw', marginBottom: '2cqw'}}>
          <h2 className="drDisplay" style={{fontSize: '4.2cqw'}}>
            Five scenes.
          </h2>
          <span
            style={{
              fontSize: '1.15cqw',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Four real · one virtual
          </span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1cqw'}}>
          {SCENES.map((s) => (
            <div
              key={s.n}
              style={{position: 'relative', aspectRatio: '3 / 4', borderRadius: '0.6cqw', overflow: 'hidden', background: '#111'}}
            >
              <img
                alt={s.name}
                src={`${ASSET_BASE}/darkroom/${s.img}.jpg`}
                style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.9) 100%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '0.8cqw',
                  left: '0.8cqw',
                  borderRadius: '2cqw',
                  padding: '0.45cqw 0.75cqw',
                  fontSize: '0.72cqw',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  background: s.kind === 'AI' ? 'transparent' : '#fff',
                  color: s.kind === 'AI' ? '#fff' : '#000',
                  border: s.kind === 'AI' ? '1px solid rgba(255,255,255,0.65)' : 'none',
                }}
              >
                {s.kind === 'AI' ? 'AI / VFX' : 'Real'}
              </span>
              <div style={{position: 'absolute', left: '0.95cqw', right: '0.95cqw', bottom: '0.9cqw'}}>
                <div className="drDisplay" style={{fontSize: '1.9cqw', color: 'rgba(255,255,255,0.45)', lineHeight: 1}}>
                  {s.n}
                </div>
                <div style={{marginTop: '0.35cqw', fontSize: '1.18cqw', fontWeight: 600, color: '#fff', lineHeight: 1.08}}>
                  {s.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* Structure / production                                              */
/* ------------------------------------------------------------------ */

const TIMELINE = [
  {label: 'Penthouse morning', from: 0, to: 25, accent: ACCENTS.art},
  {label: 'Hook — portal opens', from: 25, to: 36, accent: ACCENTS.red},
  {label: 'Void + trap past', from: 36, to: 56, accent: ACCENTS.music},
  {label: 'LES winter street', from: 56, to: 67, accent: ACCENTS.projects},
  {label: 'Hook — condo contrast', from: 67, to: 79, accent: ACCENTS.art},
  {label: 'Star · club · luxury', from: 79, to: 100, accent: ACCENTS.bless},
  {label: 'Trap ↔ luxury intercut', from: 100, to: 123, accent: ACCENTS.red},
  {label: 'Darkroom Polaroids', from: 123, to: 145, accent: ACCENTS.shop},
  {label: 'Final hooks → fade', from: 145, to: 165, accent: ACCENTS.music},
];

const PRODUCTION = [
  {
    head: 'Locations / Sets',
    items: [
      'Luxury condo — terrace, bedroom, foyer',
      'Trap-house room + bedroom set',
      'Black void stage w/ hanging bulb',
      'Abstract club dressing of the void',
      'LES + Chinatown @ Manhattan Bridge base',
      'Darkroom set — clotheslines, trays, prints',
    ],
  },
  {
    head: 'Wardrobe / Props',
    items: [
      'MSC silk robes ×2 (signature art)',
      'Watch, shoes, gun, cigar, mimosa',
      'Scales, baggies, cash, sticky glass',
      'Champagne bottles + bottle service',
      'Gold Rollies + Rap Mt Rushmore ring',
      'Glass pipe, clothespins, Polaroids',
    ],
  },
  {
    head: 'Camera Kit',
    items: [
      'Cinema body — ARRI Alexa Mini LF',
      'Prime lens set + macro lens',
      '8mm circular fisheye (overhead void)',
      'High-speed body for slow-mo',
      'Overhead menace arm / hi-hat rig',
      'Gimbal for penthouse moves, matte box, NDs',
    ],
  },
  {
    head: 'Lighting Kit',
    items: [
      'Practical Edison bulbs + dimmers',
      'Hard source for the void spotlight',
      'HMIs / daylight for luxury interiors',
      'Tungsten for the warm night look',
      'Red safelight + gels for the darkroom',
      'China balls, flags, diffusion, neg fill',
    ],
  },
  {
    head: 'Grip / Electric / Other',
    items: [
      'C-stands, sandbags, apple boxes',
      'Haze / atmosphere machine',
      'Generator + power distro',
      'Medium-format film camera (prints)',
      'Monitors, media, batteries, walkies',
    ],
  },
];

function ProductionSlide({index}: {index: number}) {
  return (
    <Slide tone="light">
      <Head index={index} label="Breakdown" tone="light" />
      <div className="drBody" style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.1cqw', justifyContent: 'center', alignContent: 'center'}}>
          {PRODUCTION.map((col) => (
            <div
              key={col.head}
              style={{background: '#fff', borderRadius: '1cqw', padding: '1.2cqw 1.3cqw', flex: '0 1 28.5cqw', boxSizing: 'border-box'}}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '0.55cqw', marginBottom: '0.8cqw'}}>
                <span style={{width: '0.75cqw', height: '0.75cqw', borderRadius: '50%', background: '#000'}} />
                <h3 style={{margin: 0, fontSize: '1.08cqw', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em'}}>
                  {col.head}
                </h3>
              </div>
              <ul style={{margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.42cqw'}}>
                {col.items.map((it) => (
                  <li key={it} style={{fontSize: '0.9cqw', lineHeight: 1.25, color: 'rgba(0,0,0,0.72)', display: 'flex', gap: '0.5cqw'}}>
                    <span style={{color: 'rgba(0,0,0,0.3)'}}>—</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* End card                                                            */
/* ------------------------------------------------------------------ */

function EndSlide() {
  return (
    <Slide tone="dark">
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-40cqw',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80cqw',
          height: '80cqw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      <header className="drHead" style={{position: 'relative', zIndex: 2}}>
        <div className="drHeadLeft">
          <span className="drPill inkOnWhite">MSC</span>
        </div>
        <div className="drHeadMeta">
          <span>End</span>
        </div>
      </header>
      <div className="drBody" style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 2}}>
        <h2 className="drDisplay" style={{fontSize: '11cqw', lineHeight: 0.95, margin: 0}}>
          Thank you
        </h2>
      </div>
      <footer style={{flex: 'none', position: 'relative', zIndex: 2}}>
        <div style={{height: '1px', background: 'rgba(255,255,255,0.16)'}} />
      </footer>
    </Slide>
  );
}

/* ------------------------------------------------------------------ */
/* Deck assembly                                                       */
/* ------------------------------------------------------------------ */

type SlideDef = {
  title: string;
  kind: 'chapter' | 'reel';
  accent?: string;
  shot?: Shot;
  render: (i: number) => ReactNode;
};

const REEL_START = 3;

const SLIDES: SlideDef[] = [
  {title: 'Cover', kind: 'chapter', render: () => <CoverSlide />},
  {title: 'Synopsis', kind: 'chapter', render: (i) => <SynopsisSlide index={i} />},
  {title: 'Scenes', kind: 'chapter', render: (i) => <SystemSlide index={i} />},
  ...SHOTS.map((shot, k) => ({
    title: WORLDS[shot.world].label.split(' — ')[0],
    kind: 'reel' as const,
    accent: WORLDS[shot.world].accent,
    shot,
    render: () => <ReelShot shot={shot} position={k + 1} />,
  })),
  {title: 'Breakdown', kind: 'chapter', render: (i) => <ProductionSlide index={i} />},
  {title: 'End', kind: 'chapter', render: () => <EndSlide />},
];

const SLIDE_COUNT = SLIDES.length;
const REEL_END = REEL_START + SHOTS.length - 1;

function slideForTime(t: number) {
  let k = 0;
  for (let i = 0; i < SHOTS.length; i += 1) {
    if (t >= SHOTS[i].tc) k = i;
  }
  return REEL_START + k;
}

export default function DarkRoomDeck() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [frameWidth, setFrameWidth] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const seamKey = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setFrameWidth(Math.max(0, Math.floor(Math.min(rect.width, (rect.height * 16) / 9))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const n = Math.max(0, Math.min(SLIDE_COUNT - 1, next));
      if (n !== cur) {
        seamKey.current += 1;
        setPrev(cur);
      }
      return n;
    });
  }, []);

  // clear the outgoing layer after the seam finishes
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 640);
    return () => clearTimeout(t);
  }, [prev, index]);

  // deep links + hash sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = Number(params.get('slide') ?? window.location.hash.replace('#', ''));
    if (Number.isInteger(fromUrl) && fromUrl >= 1 && fromUrl <= SLIDE_COUNT) {
      setIndex(fromUrl - 1);
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`);
  }, [index]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Home') {
        go(0);
      } else if (e.key === 'End') {
        go(SLIDE_COUNT - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        go(index + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  return (
    <div className="drRoot">
      <style dangerouslySetInnerHTML={{__html: DECK_CSS}} />

      <div className="drStage">
        <button aria-label="Previous slide" className="drArrow" disabled={index === 0} onClick={() => go(index - 1)} type="button">
          ‹
        </button>
        <div className="drFrameWrap" ref={wrapRef}>
          <div
            className="drFrame"
            style={frameWidth ? {width: `${frameWidth}px`} : undefined}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 48) {
                go(index + (dx < 0 ? 1 : -1));
              }
              touchX.current = null;
            }}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
          >
            {prev !== null && (
              <div className="drLayer drLayerOut" key={`out-${prev}-${seamKey.current}`}>
                {SLIDES[prev].render(prev)}
              </div>
            )}
            <div className="drLayer drLayerIn" key={`in-${index}-${seamKey.current}`}>
              {SLIDES[index].render(index)}
            </div>
            {prev !== null && <SeamOverlay key={`seam-${seamKey.current}`} />}
          </div>
        </div>
        <button aria-label="Next slide" className="drArrow" disabled={index === SLIDE_COUNT - 1} onClick={() => go(index + 1)} type="button">
          ›
        </button>
      </div>

      <nav aria-label="Slides" className="drRail">
        <div className="drRailInner">
          {SLIDES.map((s, i) => (
            <button
              className={`drDot${i === index ? ' on' : ''}`}
              key={`${s.title}-${i}`}
              onClick={() => go(i)}
              type="button"
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="drDotTitle">{s.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
