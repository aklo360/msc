import {useEffect} from 'react';

interface SectionHeroProps {
  title: string;
  accentColor: string;
  imageUrl?: string;
  /** Looping background video, styled like the home hero (grayscale + luminosity). */
  videoSrc?: string;
}

export function SectionHero({title, accentColor, imageUrl, videoSrc}: SectionHeroProps) {
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
        height: '100vh',
        backgroundColor: accentColor,
        isolation: 'isolate',
      }}
    >
      {/* Background video (grayscale) with the accent color washed over the
          top via hard-light — the color is the blend source, so it tints the
          footage into a vivid duotone instead of greying it out. */}
      {videoSrc && (
        <>
          <video
            className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{filter: 'grayscale(1)'}}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              backgroundColor: accentColor,
              mixBlendMode: 'hard-light',
            }}
          />
        </>
      )}

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
