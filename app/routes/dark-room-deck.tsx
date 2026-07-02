import {useEffect, useState, type CSSProperties, type ReactNode} from 'react';

export function meta() {
  return [
    {title: 'Dark Room Visual Deck | Mr.StarCity'},
    {
      name: 'description',
      content:
        'A visual treatment deck for Dark Room by Manhattan Mal and Mr Star City.',
    },
  ];
}

type Accent = 'music' | 'art' | 'projects' | 'shop' | 'bless' | 'red';

type ScenePage = {
  accent: Accent;
  eyebrow: string;
  title: string;
  summary: string;
  visual: string;
  details: string[];
  imageNeeds: string[];
};

const accents: Record<Accent, string> = {
  art: '#FF9E70',
  bless: '#D073A5',
  music: '#FFD770',
  projects: '#92D073',
  red: '#F46060',
  shop: '#73B9D0',
};

const scenePages: ScenePage[] = [
  {
    accent: 'music',
    eyebrow: 'Scene 01',
    title: 'Penthouse Present',
    summary:
      'Mal wakes above the city in a clean luxury world: terrace sunrise, MSC silk robe, cigar, mimosa, untouched French omelette, watch, shoes, gun, and foyer stillness.',
    visual: 'Penthouse terrace sunrise placeholder',
    details: [
      'Present-day Manhattan luxury should feel controlled, polished, and almost too perfect.',
      'The morning ritual is private: Mal performs to himself before he performs to camera.',
      'The foyer becomes the first pressure point where the pristine present cracks open.',
    ],
    imageNeeds: ['Terrace skyline', 'Silk robe detail', 'Omelette still life'],
  },
  {
    accent: 'art',
    eyebrow: 'Scene 02',
    title: 'Trap-House Past',
    summary:
      'The couch and coffee table become the portal: plastic-covered luxury furniture decays into a dirty room with scales, baggies, cash, ash, stained glass, fiends, and door checks.',
    visual: 'Trap-house couch and table placeholder',
    details: [
      'The past should overlay the condo instead of feeling like a separate flashback location.',
      'Hands, peepholes, cash, liquor, and street movement keep the room feeling transactional.',
      'The daylight/window beat gets swallowed by the room before the light flick hits.',
    ],
    imageNeeds: ['Couch portal', 'Scales and table mess', 'Peephole fisheye'],
  },
  {
    accent: 'shop',
    eyebrow: 'Scene 03',
    title: 'Dark-Room Void',
    summary:
      'A black room, one hanging bulb, and a high fisheye Hype Williams-style performance setup give the whole video its graphic center.',
    visual: 'Black void one-bulb fisheye placeholder',
    details: [
      'The bulb flick exposes the room; cockroaches scatter on the floor.',
      'This is the performance engine: props, extras, and montage details transform around Mal and Star.',
      'The setup should feel repeatable enough for match cuts, object swaps, and time-lapse changes.',
    ],
    imageNeeds: ['One hanging bulb', 'High fisheye angle', 'Black void texture'],
  },
  {
    accent: 'bless',
    eyebrow: 'Scene 04',
    title: 'Star, Club, Bridge',
    summary:
      'Star enters through an abstract club set with bottle service, clean looks, girls, champagne, rollies, pedicure/massage luxury, and a Williamsburg Bridge sunset performance image.',
    visual: 'Club opulence and bridge sunset placeholder',
    details: [
      'The club should feel like the same dark-room void dressed in opulence.',
      'The luxury moments should be fun without breaking the haunted survival frame.',
      'Williamsburg Bridge stays as a clean outdoor performance image, not a train or photo-lab story.',
    ],
    imageNeeds: ['Bottle service', 'Gold rollies', 'Bridge sunset performance'],
  },
];

function getSceneId(pageIndex: number) {
  return pageIndex === 4
    ? 'penthouse'
    : pageIndex === 5
      ? 'trap-house'
      : pageIndex === 6
        ? 'dark-room'
        : 'star';
}

const deckNav = [
  'Cover',
  'Thesis',
  'System',
  'Penthouse',
  'Trap House',
  'Dark Room',
  'Star',
  'VFX',
  'End',
];

const placeholderCells = Array.from({length: 12}, (_, index) => `cell-${index}`);

function DisplayTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`font-[family-name:var(--font-display)] font-bold leading-[0.92] ${className}`}
      style={{fontFeatureSettings: "'dlig' 1"}}
    >
      {children}
    </h1>
  );
}

function Pill({
  children,
  className = '',
  tone = 'white',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'black' | 'white';
}) {
  return (
    <span
      className={`inline-flex max-w-full min-w-0 rounded-[20px] px-[10px] py-[8px] text-left text-[12px] font-medium uppercase leading-none md:text-[14px] ${
        tone === 'black'
          ? 'bg-[var(--color-black)] text-[var(--color-white)]'
          : 'bg-[var(--color-white)] text-[var(--color-black)]'
      } ${className}`}
    >
      {children}
    </span>
  );
}

function PageShell({
  accent,
  children,
  id,
  index,
}: {
  accent: Accent;
  children: ReactNode;
  id: string;
  index: number;
}) {
  return (
    <section
      id={id}
      className="relative min-h-screen overflow-x-hidden border-b border-white/10 bg-[var(--color-black)] px-[20px] py-[32px] pb-[96px] text-[var(--color-white)] md:px-[60px] md:py-[48px] md:pb-[108px]"
      style={{'--deck-accent': accents[accent]} as CSSProperties}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-[12px] w-full"
        style={{backgroundColor: 'var(--deck-accent)'}}
      />
      <div className="pointer-events-none absolute inset-y-[12px] right-0 hidden w-[12px] md:block" style={{backgroundColor: 'var(--deck-accent)'}} />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-128px)] max-w-[1728px] flex-col md:min-h-[calc(100svh-156px)]">
        <header className="mb-[28px] flex items-start justify-between gap-[20px] md:mb-[40px]">
          <a
            className="rounded-[20px] bg-white px-[10px] py-[8px] text-[12px] font-medium uppercase leading-none text-black md:text-[14px]"
            href="#cover"
          >
            Dark Room
          </a>
          <div className="flex items-center gap-[10px] text-[12px] font-medium uppercase text-white/70 md:text-[14px]">
            <span>{String(index).padStart(2, '0')}</span>
            <span className="h-px w-[42px] bg-white/25" />
            <span className="hidden sm:inline">Visual Deck</span>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

function PlaceholderFrame({
  accent,
  label,
  variant = 'wide',
}: {
  accent: Accent;
  label: string;
  variant?: 'wide' | 'poster' | 'square';
}) {
  const sizeClass =
    variant === 'poster'
      ? 'aspect-[9/12]'
      : variant === 'square'
        ? 'aspect-square'
        : 'aspect-[16/10]';

  return (
    <div
      className={`${sizeClass} relative min-w-0 max-w-full overflow-hidden rounded-[8px] border border-white/15 bg-[#121212] shadow-[0_24px_80px_rgba(0,0,0,0.38)]`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.52))',
        }}
      />
      <div className="absolute inset-[18px] grid grid-cols-4 grid-rows-3 gap-[10px] opacity-55">
        {placeholderCells.map((cell) => (
          <span
            key={cell}
            className="rounded-[4px] border border-white/12 bg-white/5"
          />
        ))}
      </div>
      <div
        className="absolute bottom-[18px] left-[18px] right-[18px] rounded-[8px] border border-white/15 bg-black/45 p-[16px] backdrop-blur-md"
      >
        <span
          className="mb-[10px] block h-[8px] w-[72px] rounded-full"
          style={{backgroundColor: accents[accent]}}
        />
        <p className="break-words text-[13px] font-medium uppercase leading-[1.15] text-white md:text-[15px]">
          {label}
        </p>
      </div>
    </div>
  );
}

function DetailList({items}: {items: string[]}) {
  return (
    <div className="grid gap-[10px]">
      {items.map((item, index) => (
        <div
          className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-[12px] rounded-[8px] border border-black/10 bg-white p-[14px] text-black"
          key={item}
        >
          <strong className="text-[13px] font-medium uppercase leading-[1.1] text-black/50">
            {String(index + 1).padStart(2, '0')}
          </strong>
          <p className="text-[15px] leading-[1.25] md:text-[18px]">{item}</p>
        </div>
      ))}
    </div>
  );
}

function DeckIndex() {
  return (
    <nav className="fixed bottom-[18px] left-1/2 z-50 flex max-w-[calc(100vw-40px)] -translate-x-1/2 gap-[6px] overflow-x-auto rounded-[24px] border border-white/12 bg-black/72 p-[6px] text-white shadow-[0_18px_50px_rgba(0,0,0,0.44)] backdrop-blur-xl">
      {deckNav.map((item, index) => (
        <a
          className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[18px] px-[10px] text-[11px] font-medium uppercase leading-none text-white/75 transition hover:bg-white hover:text-black md:gap-[8px] md:px-[12px]"
          href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
          key={item}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="hidden md:inline">{item}</span>
        </a>
      ))}
    </nav>
  );
}

function CoverPage() {
  return (
    <PageShell accent="music" id="cover" index={1}>
      <div className="grid flex-1 content-center items-center gap-[28px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 max-w-[980px]">
          <div className="mb-[24px] flex flex-wrap gap-[10px]">
            <Pill className="basis-full sm:basis-auto">
              Official music video treatment
            </Pill>
            <Pill>v1.0</Pill>
            <Pill>2:45 runtime</Pill>
          </div>
          <DisplayTitle className="text-[44px] md:text-[104px] lg:text-[124px] xl:text-[136px]">
            <span className="block">Dark</span>
            <span className="block">Room</span>
          </DisplayTitle>
          <p className="mt-[14px] max-w-[780px] text-[17px] leading-[1.16] text-white/72 md:mt-[20px] md:text-[28px]">
            Manhattan Mal and Mr Star City move through luxury, memory, and a black performance void where survival keeps developing into evidence.
          </p>
        </div>
        <div className="grid min-w-0 gap-[12px]">
          <PlaceholderFrame
            accent="music"
            label="Cover image placeholder: Mal on a sunrise penthouse terrace"
          />
          <div className="grid min-w-0 grid-cols-1 gap-[10px] sm:grid-cols-3">
            <PlaceholderFrame accent="art" label="Condo" variant="square" />
            <PlaceholderFrame accent="shop" label="Dark room" variant="square" />
            <PlaceholderFrame accent="bless" label="Bridge" variant="square" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ThesisPage() {
  return (
    <PageShell accent="red" id="thesis" index={2}>
      <div className="grid flex-1 content-center gap-[32px] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-[14px] text-[14px] font-medium uppercase text-white/60 md:text-[16px]">
            Core thesis
          </p>
          <DisplayTitle className="text-[56px] md:text-[92px]">
            Success haunted by survival.
          </DisplayTitle>
        </div>
        <div className="grid gap-[16px]">
          <div className="rounded-[8px] bg-white p-[20px] text-black md:p-[28px]">
            <p className="text-[22px] leading-[1.14] md:text-[34px]">
              Mal begins in a clean, expensive present-day world in a Manhattan luxury condo. As the song turns, the space is transformed by flashes of the dirty trap-house room he came from.
            </p>
          </div>
          <div className="grid gap-[10px] md:grid-cols-3">
            {[
              ['01', 'Luxury present', 'Rooftop, bedroom ritual, foyer stillness.'],
              ['02', 'Trap-house past', 'Couch, table, fiends, rain, door checks.'],
              ['03', 'Dark-room image', 'Bulb, fisheye, Polaroids, VFX evidence.'],
            ].map(([number, title, body], index) => (
              <article
                className="rounded-[8px] border border-white/12 bg-white/8 p-[16px]"
                key={title}
                style={{borderTopColor: Object.values(accents)[index]}}
              >
                <strong className="text-[13px] font-medium text-white/48">{number}</strong>
                <h2 className="mt-[12px] text-[22px] font-medium leading-[1.05]">
                  {title}
                </h2>
                <p className="mt-[12px] text-[15px] leading-[1.28] text-white/68">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function SystemPage() {
  return (
    <PageShell accent="projects" id="system" index={3}>
      <div className="grid flex-1 gap-[28px] lg:grid-cols-[0.7fr_1.3fr]">
        <div className="self-center">
          <p className="mb-[14px] text-[14px] font-medium uppercase text-white/60 md:text-[16px]">
            Visual structure
          </p>
          <DisplayTitle className="text-[54px] md:text-[92px]">
            Three scenes, one memory system.
          </DisplayTitle>
          <p className="mt-[20px] text-[18px] leading-[1.22] text-white/64 md:text-[24px]">
            The deck treats each location as a surface of the same haunted image, not separate storylines.
          </p>
        </div>
        <div className="grid gap-[14px] self-center">
          {[
            ['Penthouse present', 'Clean wealth image', 'Robe, cigar, mimosa, watch, shoes, gun, foyer.'],
            ['Trap-house past', 'Memory image', 'Couch, table, scales, baggies, fiends, street survival.'],
            ['Dark-room void', 'Performance image', 'One bulb, fisheye, montage swaps, Polaroid evidence.'],
          ].map(([title, tag, body], index) => (
            <article
              className="grid gap-[14px] rounded-[8px] border border-black/10 bg-white p-[18px] text-black md:grid-cols-[160px_minmax(0,1fr)_180px] md:p-[22px]"
              key={title}
            >
              <strong className="text-[44px] font-medium leading-none text-black/18">
                {String(index + 1).padStart(2, '0')}
              </strong>
              <div>
                <h2 className="text-[30px] font-medium leading-[1] md:text-[42px]">
                  {title}
                </h2>
                <p className="mt-[10px] text-[16px] leading-[1.25] text-black/64 md:text-[19px]">
                  {body}
                </p>
              </div>
              <span className="self-start rounded-[20px] bg-black px-[10px] py-[8px] text-[12px] font-medium uppercase text-white md:justify-self-end">
                {tag}
              </span>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ScenePageView({
  page,
  pageIndex,
}: {
  page: ScenePage;
  pageIndex: number;
}) {
  const id = getSceneId(pageIndex);

  return (
    <PageShell accent={page.accent} id={id} index={pageIndex}>
      <div className="grid flex-1 gap-[28px] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between gap-[22px]">
          <div>
            <p className="mb-[14px] text-[14px] font-medium uppercase text-white/60 md:text-[16px]">
              {page.eyebrow}
            </p>
            <DisplayTitle className="text-[54px] md:text-[92px]">
              {page.title}
            </DisplayTitle>
            <p className="mt-[18px] max-w-[820px] text-[18px] leading-[1.2] text-white/68 md:text-[26px]">
              {page.summary}
            </p>
          </div>
          <div>
            <p className="mb-[10px] text-[12px] font-medium uppercase text-white/48">
              Image placeholders needed
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {page.imageNeeds.map((need) => (
                <Pill key={need}>{need}</Pill>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-[14px] self-center">
          <PlaceholderFrame accent={page.accent} label={page.visual} />
          <DetailList items={page.details} />
        </div>
      </div>
    </PageShell>
  );
}

function VfxPage() {
  return (
    <PageShell accent="shop" id="vfx" index={8}>
      <div className="grid flex-1 gap-[30px] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="self-center">
          <p className="mb-[14px] text-[14px] font-medium uppercase text-white/60 md:text-[16px]">
            Signature language
          </p>
          <DisplayTitle className="text-[52px] md:text-[88px]">
            Polaroids become portals.
          </DisplayTitle>
          <p className="mt-[18px] text-[18px] leading-[1.22] text-white/68 md:text-[26px]">
            Freeze frames snap into photographs, the camera zooms out to a VFX darkroom, then pans across other Polaroids developing on a clothesline before diving back into scenes from the video.
          </p>
        </div>
        <div className="relative self-center rounded-[8px] border border-white/12 bg-white/8 p-[18px] md:p-[26px]">
          <div className="mb-[18px] h-px bg-white/28" />
          <div className="grid grid-cols-2 gap-[14px] md:grid-cols-3">
            {[
              ['Snap', 'Serving/law freeze frame'],
              ['Develop', 'Polaroids hang in a black void'],
              ['Pan', 'Camera moves across evidence images'],
              ['Zoom', 'Frame becomes a scene again'],
              ['Montage', 'Requiem-inspired quick inserts'],
              ['Return', 'Last photo fades to dark-room void'],
            ].map(([title, body], index) => (
              <article
                className="aspect-[4/5] rounded-[6px] bg-white p-[10px] text-black shadow-[0_18px_40px_rgba(0,0,0,0.32)]"
                key={title}
                style={{
                  transform:
                    index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.1deg)',
                }}
              >
                <div className="mb-[12px] flex h-[58%] items-end rounded-[4px] bg-black p-[10px] text-white">
                  <span className="text-[11px] font-medium uppercase leading-[1.1] text-white/72">
                    Placeholder still
                  </span>
                </div>
                <h2 className="text-[18px] font-medium leading-[1]">{title}</h2>
                <p className="mt-[6px] text-[12px] leading-[1.18] text-black/62">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function EndPage() {
  return (
    <PageShell accent="art" id="end" index={9}>
      <div className="grid flex-1 content-center gap-[28px] lg:grid-cols-[1fr_1fr]">
        <div>
          <DisplayTitle className="text-[60px] md:text-[110px]">
            Next pass: replace the placeholders.
          </DisplayTitle>
          <p className="mt-[18px] text-[18px] leading-[1.22] text-white/68 md:text-[26px]">
            The structure is ready for real stills, AI references, production references, and lookbook pulls. The deck already knows where each image belongs.
          </p>
        </div>
        <div className="grid gap-[12px] self-center">
          {[
            ['Luxury', 'Terrace, foyer, robe, jewelry, food still life.'],
            ['Past', 'Trap house couch, table work, door/peephole, street winter.'],
            ['Performance', 'Fisheye black room, bulb, club transform, direct camera.'],
            ['VFX', 'Polaroids, evidence wall, zooms, clothesline darkroom.'],
          ].map(([label, body], index) => (
            <article
              className="rounded-[8px] border border-black/10 bg-white p-[18px] text-black"
              key={label}
            >
              <div className="flex items-start justify-between gap-[14px]">
                <h2 className="text-[28px] font-medium leading-[1] md:text-[40px]">
                  {label}
                </h2>
                <span
                  className="h-[18px] w-[72px] rounded-full"
                  style={{backgroundColor: Object.values(accents)[index]}}
                />
              </div>
              <p className="mt-[10px] text-[16px] leading-[1.24] text-black/64 md:text-[19px]">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default function DarkRoomDeck() {
  const [activeSlideId, setActiveSlideId] = useState('');

  useEffect(() => {
    const syncActiveSlide = () => {
      const id = window.location.hash.slice(1);
      setActiveSlideId(id);

      if (id) {
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView();
        }, 0);
      }
    };

    const timeout = window.setTimeout(syncActiveSlide, 50);
    window.addEventListener('hashchange', syncActiveSlide);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('hashchange', syncActiveSlide);
    };
  }, []);

  const showSlide = (id: string) => !activeSlideId || activeSlideId === id;

  return (
    <div className="overflow-x-hidden bg-black font-[family-name:var(--font-body)] text-white">
      <DeckIndex />
      {showSlide('cover') ? <CoverPage /> : null}
      {showSlide('thesis') ? <ThesisPage /> : null}
      {showSlide('system') ? <SystemPage /> : null}
      {scenePages.map((page, index) => (
        showSlide(getSceneId(index + 4)) ? (
          <ScenePageView key={page.title} page={page} pageIndex={index + 4} />
        ) : null
      ))}
      {showSlide('vfx') ? <VfxPage /> : null}
      {showSlide('end') ? <EndPage /> : null}
    </div>
  );
}
