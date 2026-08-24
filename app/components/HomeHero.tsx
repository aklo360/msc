import {useState, useEffect, useRef} from 'react';
import {NavLink} from 'react-router';

const HERO_LINKS = [
  {
    label: 'Art',
    to: '/art',
    color: '#FF9E70',
    videoSrc: '/videos/art/page-bg.mp4',
    desktopWebm: true,
    mobileWebm: false,
  },
  {
    label: 'Music',
    to: '/music',
    color: '#FFD770',
    videoSrc: '/videos/music/page-bg.mp4',
    desktopWebm: true,
    mobileWebm: true,
  },
  {
    label: 'Projects',
    to: '/projects',
    color: '#92D073',
    videoSrc: '/videos/projects/page-bg.mp4',
    desktopWebm: false,
    mobileWebm: false,
  },
  {
    label: 'MSC Shop',
    to: '/shop',
    color: '#73B9D0',
    videoSrc: '/videos/shop/page-bg.mp4',
    desktopWebm: true,
    mobileWebm: true,
  },
  {
    label: 'Editorial',
    to: '/editorial',
    color: '#D073A5',
    videoSrc: '/videos/editorial/page-bg.mp4',
    desktopWebm: true,
    mobileWebm: false,
  },
  {
    label: 'Big Bless',
    to: '/big-bless',
    color: '#F46060',
    videoSrc: '/videos/big-bless/page-bg.mp4',
    desktopWebm: true,
    mobileWebm: true,
  },
];

interface HomeHeroProps {
  accentColor?: string;
  backgroundImage?: string;
}

export function HomeHero({
  accentColor = '#FF9E70',
  backgroundImage,
}: HomeHeroProps) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldPreloadVideos, setShouldPreloadVideos] = useState(false);
  const [hoverScales, setHoverScales] = useState(() =>
    HERO_LINKS.map(() => 1),
  );
  const [hoverWeights, setHoverWeights] = useState(() =>
    HERO_LINKS.map(() => 500),
  );
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const preloadedVideoIndexes = useRef(new Set<number>());

  const currentIndex = hoveredIndex !== null ? hoveredIndex : cycleIndex;
  const activeColor = HERO_LINKS[currentIndex]?.color ?? accentColor;

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

  useEffect(() => {
    let cancelled = false;

    const measureHoverScales = () => {
      if (cancelled) return;

      const viewportWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth,
      );
      const maxVisualWidth = viewportWidth * 0.9;

      const nextHoverStyles = linkRefs.current.map((link) => {
        if (!link) return {scale: 1, weight: 500};

        const previousTransform = link.style.transform;
        const previousTransition = link.style.transition;
        const previousWeight = link.style.fontWeight;

        link.style.transform = 'none';
        link.style.transition = 'none';
        link.style.fontWeight = '500';
        const regularWidth = link.getBoundingClientRect().width;
        link.style.fontWeight = '700';
        const boldWidth = link.getBoundingClientRect().width;

        link.style.transform = previousTransform;
        link.style.transition = previousTransition;
        link.style.fontWeight = previousWeight;

        if (regularWidth === 0 || boldWidth === 0) {
          return {scale: 1, weight: 500};
        }

        if (boldWidth <= maxVisualWidth) {
          return {
            scale: Math.min(1.12, maxVisualWidth / boldWidth),
            weight: 700,
          };
        }

        return {
          scale: Math.min(1.12, maxVisualWidth / regularWidth),
          weight: 500,
        };
      });

      const nextScales = nextHoverStyles.map(({scale}) => scale);
      const nextWeights = nextHoverStyles.map(({weight}) => weight);

      setHoverScales((currentScales) =>
        currentScales.every(
          (scale, index) => Math.abs(scale - nextScales[index]) < 0.001,
        )
          ? currentScales
          : nextScales,
      );
      setHoverWeights((currentWeights) =>
        currentWeights.every(
          (weight, index) => weight === nextWeights[index],
        )
          ? currentWeights
          : nextWeights,
      );
    };

    measureHoverScales();
    void document.fonts.ready.then(measureHoverScales);
    window.addEventListener('resize', measureHoverScales);
    window.addEventListener('orientationchange', measureHoverScales);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureHoverScales);
      window.removeEventListener('orientationchange', measureHoverScales);
    };
  }, []);

  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    videoRefs.current.forEach((candidate, i) => {
      if (!candidate) return;

      candidate.defaultMuted = true;
      candidate.muted = true;
      candidate.playsInline = true;
      candidate.setAttribute('muted', '');
      candidate.setAttribute('playsinline', '');
      candidate.setAttribute('webkit-playsinline', '');

      if (i !== currentIndex) candidate.pause();
    });

    try {
      video.currentTime = 0;
    } catch {
      // Metadata may not be ready yet; playback can still begin at the start.
    }

    const attemptPlayback = () => {
      video.autoplay = true;
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => {
        // A later readiness, visibility, or user-interaction event retries.
      });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') attemptPlayback();
    };

    attemptPlayback();
    video.addEventListener('loadeddata', attemptPlayback);
    video.addEventListener('canplay', attemptPlayback);
    window.addEventListener('pageshow', attemptPlayback);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', attemptPlayback, {passive: true});
    document.addEventListener('pointerdown', attemptPlayback, {passive: true});

    return () => {
      video.removeEventListener('loadeddata', attemptPlayback);
      video.removeEventListener('canplay', attemptPlayback);
      window.removeEventListener('pageshow', attemptPlayback);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', attemptPlayback);
      document.removeEventListener('pointerdown', attemptPlayback);
    };
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
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
        />
      ) : null}

      {/* The active video auto-plays; hover temporarily overrides the cycle. */}
      {HERO_LINKS.map((item, i) => (
        <video
          key={item.to}
          ref={(video) => {
            videoRefs.current[i] = video;
          }}
          className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
          autoPlay={currentIndex === i}
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
          {item.mobileWebm ? (
            <source
              src={item.videoSrc.replace(/\.mp4$/, '-mobile.webm')}
              type="video/webm"
              media="(max-width: 767px)"
            />
          ) : null}
          <source
            src={item.videoSrc.replace(/\.mp4$/, '-mobile.mp4')}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          {item.desktopWebm ? (
            <source
              src={item.videoSrc.replace(/\.mp4$/, '.webm')}
              type="video/webm"
            />
          ) : null}
          <source src={item.videoSrc} type="video/mp4" />
        </video>
      ))}

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
      <div className="home-hero-nav relative z-10 flex flex-col items-center justify-center h-[90%] my-auto gap-[0.4vh]">
        {HERO_LINKS.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const hasHover = hoveredIndex !== null;
          const scale = hasHover ? (isHovered ? hoverScales[i] : 0.92) : 1;
          const weight = hasHover
            ? isHovered
              ? hoverWeights[i]
              : 500
            : 500;

          return (
            <NavLink
              key={item.to}
              ref={(link) => {
                linkRefs.current[i] = link;
              }}
              to={item.to}
              prefetch="intent"
              className="home-hero-link cursor-pointer text-center w-fit whitespace-nowrap"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                fontWeight: weight,
                color: 'var(--color-black)',
                textDecoration: 'none',
                fontFeatureSettings: "'dlig' 1",
                transform: `scale(${scale})`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
