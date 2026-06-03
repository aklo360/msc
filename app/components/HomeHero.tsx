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
      'requestIdleCallback' in window
        ? window.requestIdleCallback(warmVideos, {timeout: 1500})
        : window.setTimeout(warmVideos, 900);

    return () => {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallback as number);
        return;
      }

      window.clearTimeout(idleCallback as number);
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
            mixBlendMode: 'luminosity',
            opacity: currentIndex === i ? 0.5 : 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <source src={item.videoSrc} type="video/mp4" />
        </video>
      ))}

      {/* Stacked hero text links — vertically & horizontally centered, auto-sized to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90%] my-auto gap-[0.4vh]">
        {HERO_LINKS.map((item, i) => {
          // The featured item (hovered, or the current cycle item) is bold;
          // every other item is medium. Hover changes weight only — not size.
          const isFeatured = currentIndex === i;
          const weight = isFeatured ? 700 : 500;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              className="cursor-pointer text-center w-fit whitespace-nowrap"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 15.5vw, 140px)',
                lineHeight: 0.85,
                fontWeight: weight,
                color: 'var(--color-black)',
                textDecoration: 'none',
                fontFeatureSettings: "'dlig' 1",
                transition: 'font-weight 0.3s ease',
              }}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
