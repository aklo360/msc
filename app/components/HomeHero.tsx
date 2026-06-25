import {useState, useEffect, useRef} from 'react';
import {NavLink} from 'react-router';

const HERO_LINKS = [
  {
    label: 'Art',
    to: '/art',
    color: '#FF9E70',
    videoSrc: '/videos/art/page-bg.mp4',
  },
  {
    label: 'Music',
    to: '/music',
    color: '#FFD770',
    videoSrc: '/videos/music/page-bg.mp4',
  },
  {
    label: 'Projects',
    to: '/projects',
    color: '#92D073',
    videoSrc: '/videos/projects/page-bg.mp4',
  },
  {
    label: 'MSC Shop',
    to: '/shop',
    color: '#73B9D0',
    videoSrc: '/videos/shop/page-bg.mp4',
  },
  {
    label: 'Editorial',
    to: '/editorial',
    color: '#D073A5',
    videoSrc: '/videos/editorial/page-bg.mp4',
  },
  {
    label: 'Big Bless',
    to: '/big-bless',
    color: '#F46060',
    videoSrc: '/videos/big-bless/page-bg.mp4',
  },
];

interface HomeHeroProps {
  accentColor?: string;
  backgroundImage?: string;
}

export function HomeHero({accentColor = '#FF9E70'}: HomeHeroProps) {
  // `cycleIndex` is the item highlighted/playing via the auto-cycle.
  // It starts on Art (index 0) so the loading state shows Art highlighted
  // with its video playing. Hovering overrides it via `hoveredIndex`.
  const [cycleIndex, setCycleIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldPreloadVideos, setShouldPreloadVideos] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const preloadedVideoIndexes = useRef(new Set<number>());

  // The currently featured item: hover takes precedence over the auto-cycle.
  const currentIndex = hoveredIndex !== null ? hoveredIndex : cycleIndex;
  const activeColor = HERO_LINKS[currentIndex].color;

  useEffect(() => {
    const warmVideos = () => setShouldPreloadVideos(true);
    const idleCallback =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(warmVideos, {timeout: 1500})
        : globalThis.setTimeout(warmVideos, 900);

    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallback as number);
        return;
      }

      globalThis.clearTimeout(idleCallback as number);
    };
  }, []);

  useEffect(() => {
    if (!shouldPreloadVideos) return;

    videoRefs.current.forEach((video, i) => {
      if (
        !video ||
        currentIndex === i ||
        preloadedVideoIndexes.current.has(i)
      ) {
        return;
      }

      preloadedVideoIndexes.current.add(i);
      video.load();
    });
  }, [currentIndex, shouldPreloadVideos]);

  // Play only the featured video; restart it from the top so each item gets a
  // full play-through before `onEnded` advances the cycle.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (currentIndex === i) {
        try {
          video.currentTime = 0;
        } catch {
          // ignore — currentTime may not be settable until metadata loads
        }
        void video.play();
        return;
      }

      video.pause();
    });
  }, [currentIndex]);

  // Sync active accent to CSS variable for Header/Footer
  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', activeColor);
  }, [activeColor]);

  // Clean up CSS variable on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        backgroundColor: activeColor,
        transition: 'background-color 0.4s ease',
        isolation: 'isolate',
      }}
    >
      {/*
        Background media. The featured item's video plays; when it ends the
        cycle advances to the next item (onEnded), which highlights that item
        and plays its video. Hover temporarily features a different item.
      */}
      {HERO_LINKS.map((item, i) => (
        <video
          key={item.to}
          ref={(video) => {
            videoRefs.current[i] = video;
          }}
          className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
          muted
          playsInline
          preload={shouldPreloadVideos ? 'auto' : 'metadata'}
          aria-hidden="true"
          onEnded={() => setCycleIndex((i + 1) % HERO_LINKS.length)}
          style={{
            filter: 'grayscale(1)',
            opacity: currentIndex === i ? 1 : 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <source src={item.videoSrc} type="video/mp4" />
        </video>
      ))}

      {/* Accent color washed over the active video via hard-light — the color
          is the blend source, giving a vivid duotone rather than a grey wash. */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundColor: activeColor,
          mixBlendMode: 'hard-light',
          transition: 'background-color 0.4s ease',
        }}
      />

      {/* Stacked hero text links — vertically & horizontally centered, auto-sized to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90%] my-auto gap-[0.4vh]">
        {HERO_LINKS.map((item, i) => {
          // The featured item (hovered, or the current cycle item) is bold;
          // every other item is medium. StarCity ships as two static faces
          // (Medium 500 / Bold 700) so the weight just snaps — no opacity
          // dissolve. The motion is carried entirely by the springy scale.
          const isFeatured = currentIndex === i;
          const isHovered = hoveredIndex === i;
          const someHover = hoveredIndex !== null;
          // Springy "stretch" on hover: the hovered item scales up and the
          // others ease back. The overshoot curve pushes past the target then
          // settles, for an organic elastic feel. Idle auto-cycle stays at 1.
          const scale = isHovered ? 1.08 : someHover ? 0.94 : 1;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              className="home-hero-link cursor-pointer text-center w-fit whitespace-nowrap"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'relative',
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                lineHeight: 0.85,
                color: 'var(--color-black)',
                textDecoration: 'none',
                fontFeatureSettings: "'dlig' 1",
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.7, 0.45, 1)',
                willChange: 'transform',
              }}
            >
              {/* Hidden bold copy reserves the wider bold width so the visible
                  weight swap below never shifts the layout. */}
              <span aria-hidden="true" style={{visibility: 'hidden', fontWeight: 700}}>
                {item.label}
              </span>
              {/* Visible label — weight snaps medium↔bold instantly, no fade. */}
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontWeight: isFeatured ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
