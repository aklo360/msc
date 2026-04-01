import {useEffect} from 'react';

interface SectionHeroProps {
  title: string;
  accentColor: string;
  imageUrl?: string;
}

export function SectionHero({title, accentColor, imageUrl}: SectionHeroProps) {
  // Set CSS variable so Header and Footer pick up the section accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', accentColor);
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, [accentColor]);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        height: '90vh',
        paddingBottom: '10vh',
        backgroundColor: accentColor,
      }}
    >
      {/* Background image layer (desaturated via luminosity blend) */}
      {imageUrl && (
        <div className="absolute inset-0" style={{mixBlendMode: 'luminosity'}}>
          <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-none" />
        </div>
      )}
      {/* Title — centered in the full viewport (offset by header height) */}
      <h1
        className="relative z-10 select-none text-center"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: `min(${Math.min(120 / title.length, 18)}vw, 200px)`,
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--color-black)',
          fontFeatureSettings: "'dlig' 1",
        }}
      >
        {title}
      </h1>
    </section>
  );
}
