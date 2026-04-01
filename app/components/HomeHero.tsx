import {useState, useEffect} from 'react';
import {NavLink} from 'react-router';

const HERO_LINKS = [
  {label: 'Art', to: '/art', color: '#FF9E70'},
  {label: 'Music', to: '/music', color: '#FFD770'},
  {label: 'Projects', to: '/projects', color: '#92D073'},
  {label: 'MSC Shop', to: '/shop', color: '#73B9D0'},
  {label: 'Editorial', to: '/editorial', color: '#D073A5'},
  {label: 'Big Bless', to: '/big-bless', color: '#F46060'},
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

  const activeColor =
    hoveredIndex !== null ? HERO_LINKS[hoveredIndex].color : accentColor;

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
        height: '90vh',
        backgroundColor: activeColor,
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* Background image layer (desaturated via luminosity blend) */}
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{mixBlendMode: 'luminosity'}}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover rounded-none"
          />
        </div>
      )}

      {/* Stacked hero text links — vertically & horizontally centered, auto-sized to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90%] my-auto gap-[0.4vh]">
        {HERO_LINKS.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const hasHover = hoveredIndex !== null;
          const scale = hasHover ? (isHovered ? 1.12 : 0.92) : 1;
          const weight = hasHover ? (isHovered ? 700 : 500) : 500;
          const opacity = hasHover ? (isHovered ? 1 : 0.5) : 1;

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
                opacity,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
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
