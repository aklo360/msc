import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TouchEvent,
} from 'react';

export function meta() {
  return [
    {title: 'Dark Room — Visual Treatment | Manhattan Mal & Mr Star City'},
    {
      name: 'description',
      content:
        'Official music video treatment for Dark Room by Manhattan Mal and Mr Star City.',
    },
  ];
}

const ASSET_BASE =
  typeof window !== 'undefined' && (window as {__DR_BASE__?: string}).__DR_BASE__
    ? String((window as {__DR_BASE__?: string}).__DR_BASE__).replace(/\/+$/, '')
    : '';

const image = (name: string) => `${ASSET_BASE}/darkroom/${name}.jpg`;

const DECK_CSS = `
.drRoot {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  background: #050505;
  color: #f4f1e9;
  font-family: 'ABC Diatype', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-feature-settings: 'salt' 1;
  overflow: hidden;
  overscroll-behavior: none;
}
.drStage {
  display: flex;
  min-width: 0;
  min-height: 0;
  align-items: center;
  justify-content: center;
  padding: clamp(10px, 2.2vh, 24px) clamp(10px, 2.2vw, 30px) 6px;
}
.drFrame {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  container-type: inline-size;
  overflow: hidden;
  background: #090909;
  box-shadow: 0 2.5rem 7rem rgba(0, 0, 0, 0.56);
  isolation: isolate;
}
.drPage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  animation: drPageIn 430ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
@keyframes drPageIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.drHit {
  position: absolute;
  z-index: 40;
  top: 0;
  bottom: 0;
  width: 11%;
  appearance: none;
  border: 0;
  background: transparent;
  color: transparent;
  cursor: pointer;
  padding: 0;
}
.drHit.prev { left: 0; }
.drHit.next { right: 0; }
.drHit:disabled { cursor: default; }
.drHit:focus-visible { outline: 1px solid rgba(255,255,255,0.72); outline-offset: -4px; }
.drChrome {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  width: min(100% - 32px, 1480px);
  margin: 0 auto;
  padding: 10px 0 15px;
}
.drProgress { height: 1px; background: rgba(255,255,255,0.16); overflow: hidden; }
.drProgressFill { height: 100%; background: rgba(255,255,255,0.8); transition: width 360ms ease; }
.drFolio {
  min-width: 7.5rem;
  color: rgba(255,255,255,0.52);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
}
.drFolio strong { color: #fff; font-weight: 500; }
.drStill { display: block; width: 100%; height: 100%; object-fit: cover; }
.drPaper { background: #eeeae1; color: #11100e; }
.drBlack { background: #080808; color: #f4f1e9; }
.drRed { background: #35100f; color: #f4f1e9; }
.drKicker {
  margin: 0;
  font-size: 0.8cqw;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}
.drRule { width: 100%; height: 1px; background: currentColor; opacity: 0.26; }
.drTitle {
  margin: 0;
  font-family: 'StarCity', 'ABC Diatype', sans-serif;
  font-feature-settings: 'dlig' 1;
  font-size: 6.8cqw;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 0.86;
}
.drHeadline {
  margin: 0;
  font-size: 4.65cqw;
  font-weight: 450;
  letter-spacing: -0.052em;
  line-height: 0.96;
}
.drBodyCopy {
  margin: 0;
  font-size: 1.28cqw;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.34;
}
.drCaption {
  margin: 0;
  font-size: 0.88cqw;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.25;
}
.drNumber {
  font-size: 0.9cqw;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

/* 01 — cover */
.drCover { position: absolute; inset: 0; background: #000; }
.drCover .drStill { object-position: 50% 52%; filter: brightness(0.72) contrast(1.06) saturate(0.78); }
.drCoverShade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.76), rgba(0,0,0,0.06) 58%, rgba(0,0,0,0.25)); }
.drCoverTitle { position: absolute; left: 5.2cqw; bottom: 5cqw; width: 49cqw; }
.drCoverTitle .drTitle { font-size: 8.6cqw; }

/* 02 — premise */
.drPremise { display: grid; grid-template-columns: 53% 47%; height: 100%; }
.drPremiseCopy { display: flex; flex-direction: column; padding: 4.6cqw 4.5cqw 4.2cqw; }
.drPremiseCopy .drHeadline { max-width: 39cqw; margin-top: auto; }
.drPremiseCopy .drBodyCopy { max-width: 35cqw; margin-top: 2.6cqw; }
.drPremiseImage { position: relative; overflow: hidden; }
.drPremiseImage .drStill { object-position: 51% 50%; }
.drPremiseImage::after { content: ''; position: absolute; inset: 0; box-shadow: inset 1.5cqw 0 3cqw rgba(0,0,0,0.08); }

/* 03 — visual grammar */
.drGrammar { display: grid; grid-template-rows: auto 1fr; gap: 2.2cqw; height: 100%; padding: 3.7cqw 4.2cqw 3.4cqw; }
.drGrammarHead { display: grid; grid-template-columns: 1fr 1.45fr; align-items: end; gap: 4cqw; }
.drGrammarHead .drHeadline { font-size: 3.75cqw; }
.drGrammarHead .drBodyCopy { max-width: 45cqw; color: rgba(244,241,233,0.68); }
.drGrammarGrid { display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 0.7cqw; min-height: 0; }
.drGrammarPanel { position: relative; min-width: 0; overflow: hidden; }
.drGrammarPanel .drStill { filter: saturate(0.83) contrast(1.04); }
.drGrammarPanel:nth-child(1) .drStill { object-position: 64% 50%; }
.drGrammarPanel:nth-child(2) .drStill { object-position: 50% 48%; }
.drGrammarPanel:nth-child(3) .drStill { object-position: 50% 44%; }
.drGrammarLabel { position: absolute; left: 1.2cqw; right: 1.2cqw; bottom: 1.1cqw; display: flex; justify-content: space-between; align-items: end; gap: 1cqw; color: #fff; text-shadow: 0 1px 12px #000; }
.drGrammarLabel b { font-size: 1.05cqw; font-weight: 500; }

/* 04 — penthouse */
.drPenthouse { display: grid; grid-template-columns: 67% 33%; height: 100%; }
.drPenthouseHero { position: relative; overflow: hidden; }
.drPenthouseHero .drStill { object-position: 57% 50%; }
.drPenthouseHero .drKicker { position: absolute; left: 3cqw; top: 3cqw; color: #fff; text-shadow: 0 1px 12px rgba(0,0,0,0.8); }
.drPenthouseSide { display: grid; grid-template-rows: 48% 52%; min-width: 0; }
.drPenthouseSideImage { min-height: 0; overflow: hidden; border-left: 0.7cqw solid #eeeae1; border-bottom: 0.7cqw solid #eeeae1; }
.drPenthouseSideImage .drStill { object-position: 50% 50%; }
.drPenthouseCopy { display: flex; flex-direction: column; justify-content: space-between; padding: 2.5cqw 2.6cqw 2.8cqw; }
.drPenthouseCopy .drHeadline { font-size: 3.15cqw; }
.drPenthouseCopy .drCaption { max-width: 22cqw; }

/* 05 — portal */
.drPortal { display: grid; grid-template-columns: 38% 62%; height: 100%; }
.drPortalPortrait { position: relative; overflow: hidden; background: #18120e; }
.drPortalPortrait .drStill { object-position: 50% 55%; }
.drPortalCopy { display: flex; flex-direction: column; padding: 4.2cqw 4.4cqw 3.7cqw; }
.drPortalCopy .drHeadline { max-width: 47cqw; margin: auto 0 2.5cqw; font-size: 4.05cqw; }
.drPortalCopy .drBodyCopy { max-width: 44cqw; color: rgba(244,241,233,0.72); }
.drPortalStrip { position: absolute; right: 3.2cqw; top: 3.4cqw; width: 20cqw; height: 11.4cqw; border: 0.55cqw solid #eeeae1; box-shadow: 0 1.2cqw 3.5cqw rgba(0,0,0,0.46); overflow: hidden; transform: rotate(-1.6deg); }
.drPortalStrip .drStill { object-position: 72% 50%; }

/* 06 — void */
.drVoid { position: absolute; inset: 0; background: #000; }
.drVoid .drStill { object-fit: contain; object-position: center; }
.drVoidMark { position: absolute; left: 4.2cqw; top: 3.8cqw; width: 23cqw; }
.drVoidMark .drHeadline { font-size: 3.4cqw; }
.drVoidNote { position: absolute; right: 4.2cqw; bottom: 3.6cqw; width: 21cqw; text-align: right; color: rgba(255,255,255,0.66); }

/* 07 — night */
.drNight { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65cqw; height: 100%; background: #080808; }
.drNightPanel { position: relative; min-width: 0; overflow: hidden; }
.drNightPanel .drStill { filter: saturate(0.84) contrast(1.05); }
.drNightPanel:first-child .drStill { object-position: 57% 50%; }
.drNightPanel:last-child .drStill { object-position: 50% 50%; }
.drNightShade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.76)); }
.drNightText { position: absolute; left: 3cqw; right: 3cqw; bottom: 2.8cqw; color: #fff; }
.drNightText .drHeadline { margin-top: 0.9cqw; font-size: 3.2cqw; }

/* 08 — sensory / evidence */
.drEvidence { display: grid; grid-template-columns: 39% 61%; height: 100%; background: #1d0908; }
.drEvidencePipe { position: relative; overflow: hidden; }
.drEvidencePipe .drStill { object-position: 49% 50%; }
.drEvidencePipe::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 60%, rgba(29,9,8,0.65)); }
.drEvidenceRoom { position: relative; overflow: hidden; }
.drEvidenceRoom .drStill { object-position: 50% 50%; filter: saturate(0.78) contrast(1.08) brightness(0.8); }
.drEvidenceRoom::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.54)); }
.drEvidenceTitle { position: absolute; z-index: 2; left: 3.4cqw; bottom: 3.3cqw; max-width: 43cqw; }
.drEvidenceTitle .drHeadline { font-size: 4.15cqw; }
.drEvidenceTitle .drCaption { margin-top: 1.3cqw; max-width: 37cqw; color: rgba(255,255,255,0.7); }

/* 09 — production */
.drProduction { display: grid; grid-template-rows: auto 1fr auto; height: 100%; padding: 3.5cqw 4.1cqw 3.4cqw; }
.drProductionHead { display: grid; grid-template-columns: 1fr 1.3fr; align-items: end; gap: 4cqw; padding-bottom: 2.1cqw; }
.drProductionHead .drHeadline { font-size: 3.85cqw; }
.drProductionHead .drBodyCopy { color: rgba(17,16,14,0.6); }
.drProductionGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5cqw; padding: 2.1cqw 0 1.7cqw; border-top: 1px solid rgba(17,16,14,0.24); border-bottom: 1px solid rgba(17,16,14,0.24); }
.drProductionColumn { min-width: 0; }
.drProductionColumn h3 { margin: 0 0 1.25cqw; font-size: 1.05cqw; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; }
.drProductionColumn ul { list-style: none; margin: 0; padding: 0; }
.drProductionColumn li { position: relative; margin: 0 0 0.55cqw; padding-left: 1.1cqw; font-size: 0.92cqw; line-height: 1.22; }
.drProductionColumn li::before { content: '—'; position: absolute; left: 0; color: rgba(17,16,14,0.42); }
.drProductionFoot { display: flex; justify-content: space-between; align-items: end; gap: 3cqw; padding-top: 1.8cqw; }
.drProductionFoot .drCaption { max-width: 60cqw; color: rgba(17,16,14,0.62); }

/* 10 — final */
.drFinal { position: absolute; inset: 0; display: grid; grid-template-columns: 46% 54%; background: #020303; }
.drFinalImage { position: relative; overflow: hidden; }
.drFinalImage .drStill { object-fit: cover; object-position: 50% 56%; filter: saturate(0.7) contrast(1.1); }
.drFinalImage::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 60%, #020303 100%); }
.drFinalCopy { display: flex; flex-direction: column; justify-content: center; padding: 4cqw 5cqw 4cqw 2.5cqw; }
.drFinalCopy .drHeadline { font-size: 5.2cqw; }
.drFinalCopy .drKicker { margin-top: 2.1cqw; color: rgba(255,255,255,0.5); }

@media (max-width: 700px) {
  .drStage { padding-inline: 6px; }
  .drChrome { width: calc(100% - 20px); padding-bottom: 10px; }
  .drFolio { min-width: 5.7rem; font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .drPage { animation: none; }
  .drProgressFill { transition: none; }
}
`;

type StillProps = {
  name: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
};

function Still({name, alt, className = '', style}: StillProps) {
  return (
    <img
      className={`drStill ${className}`}
      src={image(name)}
      alt={alt}
      draggable={false}
      style={style}
    />
  );
}

function CoverSlide() {
  return (
    <section className="drCover" aria-label="Dark Room cover">
      <Still
        name="darkroom"
        alt="Photographic prints hanging in a red-lit darkroom"
      />
      <div className="drCoverShade" />
      <div className="drCoverTitle">
        <h1 className="drTitle">DARK ROOM</h1>
      </div>
    </section>
  );
}

function PremiseSlide() {
  return (
    <section className="drPremise drPaper" aria-label="Synopsis">
      <div className="drPremiseCopy">
        <p className="drKicker">The premise</p>
        <h2 className="drHeadline">Success, haunted by survival.</h2>
        <p className="drBodyCopy">
          Mal begins in a clean, expensive Manhattan present. As the song
          turns, flashes of the past invade the space—memory refusing to stay
          buried.
        </p>
      </div>
      <div className="drPremiseImage">
        <Still
          name="foyer"
          alt="Mal standing in a pristine white and gold foyer beside a plastic-covered couch"
        />
      </div>
    </section>
  );
}

function GrammarSlide() {
  return (
    <section className="drGrammar drBlack" aria-label="Visual language">
      <div className="drGrammarHead">
        <div>
          <p className="drKicker">Visual language</p>
          <h2 className="drHeadline">Three worlds. One memory.</h2>
        </div>
        <p className="drBodyCopy">
          Pristine luxury collides with a lived-in trap-house past and a pure
          black performance void. The darkroom binds them together as evidence.
        </p>
      </div>
      <div className="drGrammarGrid">
        <div className="drGrammarPanel">
          <Still name="terrace" alt="Mal on a Manhattan penthouse terrace" />
          <div className="drGrammarLabel">
            <b>The present</b><span className="drNumber">01</span>
          </div>
        </div>
        <div className="drGrammarPanel">
          <Still name="trap-serve" alt="Mal seated in a worn trap-house room" />
          <div className="drGrammarLabel">
            <b>The past</b><span className="drNumber">02</span>
          </div>
        </div>
        <div className="drGrammarPanel">
          <Still name="void" alt="Mal under one hanging light in a black void" />
          <div className="drGrammarLabel">
            <b>The dark room</b><span className="drNumber">03</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PenthouseSlide() {
  return (
    <section className="drPenthouse drPaper" aria-label="Penthouse present">
      <div className="drPenthouseHero">
        <Still name="terrace" alt="Mal smoking a cigar on a Manhattan terrace at sunrise" />
        <p className="drKicker">Penthouse · Present</p>
      </div>
      <div className="drPenthouseSide">
        <div className="drPenthouseSideImage">
          <Still name="robes-duo" alt="Mal and Star seated together in matching silk robes" />
        </div>
        <div className="drPenthouseCopy">
          <h2 className="drHeadline">Luxury as ritual.</h2>
          <div>
            <div className="drRule" style={{marginBottom: '1.25cqw'}} />
            <p className="drCaption">
              Silk. Cigar. Mimosa. Watch. Shoes. Gun. The morning is composed
              with the precision of a routine that never stopped being about
              survival.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalSlide() {
  return (
    <section className="drPortal drRed" aria-label="Memory portal">
      <div className="drPortalPortrait">
        <Still name="portal" alt="Mal seated on a plastic-covered couch beneath family photographs" />
      </div>
      <div className="drPortalCopy">
        <p className="drKicker">The portal</p>
        <h2 className="drHeadline">The past does not cut in. It replaces the room.</h2>
        <p className="drBodyCopy">
          The couch and coffee table become the connection point. Polished
          surfaces decay, the condo falls into black, and Mal is back inside
          the memory.
        </p>
        <div className="drPortalStrip">
          <Still name="trap-serve" alt="The worn trap-house room that replaces the condo" />
        </div>
      </div>
    </section>
  );
}

function VoidSlide() {
  return (
    <section className="drVoid" aria-label="Dark room void">
      <Still name="void" alt="Extreme fisheye view of Mal isolated beneath one hanging bulb" />
      <div className="drVoidMark">
        <p className="drKicker" style={{marginBottom: '1.1cqw'}}>Performance world</p>
        <h2 className="drHeadline">One bulb.<br />Pure black.</h2>
      </div>
      <p className="drCaption drVoidNote">
        An extreme circular fisheye makes the concrete floor feel like a planet
        suspended in darkness.
      </p>
    </section>
  );
}

function NightSlide() {
  return (
    <section className="drNight" aria-label="Club and Manhattan Bridge worlds">
      <div className="drNightPanel">
        <Still name="club" alt="Mal and Star performing in an opulent club" />
        <div className="drNightShade" />
        <div className="drNightText">
          <p className="drKicker">Interior · Club</p>
          <h2 className="drHeadline">Opulence.</h2>
        </div>
      </div>
      <div className="drNightPanel">
        <Still name="bridge" alt="Mal and Star at the Manhattan Bridge approach" />
        <div className="drNightShade" />
        <div className="drNightText">
          <p className="drKicker">Exterior · LES / Chinatown</p>
          <h2 className="drHeadline">Winter light.</h2>
        </div>
      </div>
    </section>
  );
}

function EvidenceSlide() {
  return (
    <section className="drEvidence" aria-label="Sensory montage and darkroom transitions">
      <div className="drEvidencePipe">
        <Still name="pipe" alt="A glass pipe glowing red over a lighter flame" />
      </div>
      <div className="drEvidenceRoom">
        <Still name="darkroom" alt="Film stills developing on clotheslines in a red-lit darkroom" />
        <div className="drEvidenceTitle">
          <p className="drKicker" style={{marginBottom: '1cqw'}}>Transition language</p>
          <h2 className="drHeadline">Heat. Smoke. Evidence.</h2>
          <p className="drCaption">
            Freeze the scene. Pull back to the clothesline. Drift across the
            photographs. Push through the next frame without a hard cut.
          </p>
        </div>
      </div>
    </section>
  );
}

const productionColumns = [
  {
    title: 'Camera',
    items: [
      'ARRI Alexa Mini LF cinema body',
      'Prime lens set + dedicated macro',
      '8mm circular fisheye for the void',
      'High-speed body for fizz and inserts',
      'Gimbal limited to penthouse moves',
      'Overhead menace arm / hi-hat rig',
    ],
  },
  {
    title: 'Light',
    items: [
      'Practical Edison bulbs + dimmers',
      'Single hard source for the void',
      'HMI / daylight shape for luxury',
      'Tungsten warmth for trap and club',
      'Red safelight + gels for darkroom',
      'China balls, flags, diffusion, neg fill',
    ],
  },
  {
    title: 'Sets + grip',
    items: [
      'Condo terrace, foyer, bedroom',
      'Trap-house room + bedroom set',
      'Black void + abstract club dressing',
      'Manhattan Bridge exterior',
      'Darkroom clotheslines, trays, prints',
      'C-stands, sandbags, apple boxes',
    ],
  },
];

function ProductionSlide() {
  return (
    <section className="drProduction drPaper" aria-label="Production approach">
      <div className="drProductionHead">
        <div>
          <p className="drKicker">Production approach</p>
          <h2 className="drHeadline">Make it physical.</h2>
        </div>
        <p className="drBodyCopy">
          Kubrickian control. Hype Williams scale. Requiem-style sensory
          inserts. Every real set earns the VFX transition.
        </p>
      </div>
      <div className="drProductionGrid">
        {productionColumns.map((column) => (
          <div className="drProductionColumn" key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="drProductionFoot">
        <p className="drCaption">
          Medium-format stills anchor the Polaroid evidence language. Water and
          rain beats are created in AI/VFX, not as an on-set rain rig.
        </p>
        <span className="drNumber">RT 02:45</span>
      </div>
    </section>
  );
}

function FinalSlide() {
  return (
    <section className="drFinal" aria-label="Closing statement">
      <div className="drFinalImage">
        <Still name="bulb" alt="A glowing Edison bulb suspended in darkness" />
      </div>
      <div className="drFinalCopy">
        <h2 className="drHeadline">Memories refuse to stay buried.</h2>
        <p className="drKicker">Dark Room</p>
      </div>
    </section>
  );
}

type Slide = {
  title: string;
  content: ReactNode;
};

const SLIDES: Slide[] = [
  {title: 'Cover', content: <CoverSlide />},
  {title: 'Premise', content: <PremiseSlide />},
  {title: 'Visual language', content: <GrammarSlide />},
  {title: 'Penthouse', content: <PenthouseSlide />},
  {title: 'Memory portal', content: <PortalSlide />},
  {title: 'Dark room void', content: <VoidSlide />},
  {title: 'Night worlds', content: <NightSlide />},
  {title: 'Sensory montage', content: <EvidenceSlide />},
  {title: 'Production', content: <ProductionSlide />},
  {title: 'Final image', content: <FinalSlide />},
];

function initialSlide() {
  if (typeof window === 'undefined') return 0;
  const requested = Number(new URLSearchParams(window.location.search).get('slide'));
  if (!Number.isFinite(requested)) return 0;
  return Math.min(SLIDES.length - 1, Math.max(0, Math.round(requested) - 1));
}

function updateDeepLink(index: number) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('slide', String(index + 1));
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function DarkRoomDeck() {
  const [current, setCurrent] = useState(initialSlide);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback((next: number) => {
    const bounded = Math.min(SLIDES.length - 1, Math.max(0, next));
    setCurrent(bounded);
    updateDeepLink(bounded);
  }, []);

  const previous = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        next();
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        previous();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goTo(SLIDES.length - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, next, previous]);

  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart.current;
    const distance = end - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) < 42) return;
    if (distance < 0) next();
    else previous();
  };

  const slide = SLIDES[current];
  const progress = ((current + 1) / SLIDES.length) * 100;

  return (
    <main className="drRoot" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style dangerouslySetInnerHTML={{__html: DECK_CSS}} />
      <div className="drStage">
        <div className="drFrame" aria-live="polite">
          <div className="drPage" key={current}>
            {slide.content}
          </div>
          <button
            className="drHit prev"
            type="button"
            aria-label="Previous slide"
            onClick={previous}
            disabled={current === 0}
          />
          <button
            className="drHit next"
            type="button"
            aria-label="Next slide"
            onClick={next}
            disabled={current === SLIDES.length - 1}
          />
        </div>
      </div>
      <nav className="drChrome" aria-label="Deck progress">
        <div className="drProgress" aria-hidden="true">
          <div className="drProgressFill" style={{width: `${progress}%`}} />
        </div>
        <div className="drFolio">
          <strong>{String(current + 1).padStart(2, '0')}</strong>
          {' / '}{String(SLIDES.length).padStart(2, '0')} · {slide.title}
        </div>
      </nav>
    </main>
  );
}
