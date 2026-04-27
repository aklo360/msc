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

export function HomeHero({
  accentColor = '#FF9E70',
  backgroundImage,
}: HomeHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldPreloadVideos, setShouldPreloadVideos] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const preloadedVideoIndexes = useRef(new Set<number>());

  const activeColor =
    hoveredIndex !== null ? HERO_LINKS[hoveredIndex].color : accentColor;

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
        hoveredIndex === i ||
        preloadedVideoIndexes.current.has(i)
      ) {
        return;
      }

      preloadedVideoIndexes.current.add(i);
      video.load();
    });
  }, [hoveredIndex, shouldPreloadVideos]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (hoveredIndex === i) {
        void video.play();
        return;
      }

      video.pause();
    });
  }, [hoveredIndex]);

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
      {/* Background media is preloaded, then faded in instantly on hover. */}
      {HERO_LINKS.map((item, i) => (
        <video
          key={item.to}
          ref={(video) => {
            videoRefs.current[i] = video;
          }}
          className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
          muted
          loop
          playsInline
          preload={shouldPreloadVideos ? 'auto' : 'metadata'}
          aria-hidden="true"
          style={{
            filter: 'grayscale(1)',
            mixBlendMode: 'luminosity',
            opacity: hoveredIndex === i ? 0.5 : 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <source src={item.videoSrc} type="video/mp4" />
        </video>
      ))}

      {hoveredIndex === null && backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
        />
      ) : null}

      {/* Stacked hero text links — vertically & horizontally centered, auto-sized to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90%] my-auto gap-[0.4vh]">
        {HERO_LINKS.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const hasHover = hoveredIndex !== null;
          const scale = hasHover ? (isHovered ? 1.12 : 0.92) : 1;
          const weight = hasHover ? (isHovered ? 700 : 500) : 500;

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
                fontSize: 'clamp(40px, 15.5vw, 128px)',
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
