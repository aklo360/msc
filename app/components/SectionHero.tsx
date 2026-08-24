import {useEffect, useRef} from 'react';

interface SectionHeroProps {
  title: string;
  accentColor: string;
  imageUrl?: string;
  /** Looping background video, styled like the home hero. */
  videoSrc?: string;
  /** Smaller fast-start encode for narrow/mobile viewports. */
  mobileVideoSrc?: string;
  /** Use WebM only when its output is smaller than the MP4 fallback. */
  desktopWebm?: boolean;
  mobileWebm?: boolean;
}

export function SectionHero({
  title,
  accentColor,
  imageUrl,
  videoSrc,
  mobileVideoSrc,
  desktopWebm = true,
  mobileWebm = true,
}: SectionHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set CSS variable so Header and Footer pick up the section accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', accentColor);
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, [accentColor]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // iOS Safari can reject the declarative autoplay request during hydration,
    // page restoration, Low Power Mode, or before enough media is buffered.
    // Keep the required properties set at runtime and retry on the next event
    // that can legally resume muted inline playback.
    const attemptPlayback = () => {
      video.autoplay = true;
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      void video.play().catch(() => {
        // Safari may still require a user gesture; the touch listener retries.
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
  }, [videoSrc]);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        height: '100vh',
        backgroundColor: accentColor,
        isolation: 'isolate',
      }}
    >
      {/* Background video: grayscale footage tinted by the section accent. */}
      {videoSrc && (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full object-cover rounded-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{filter: 'grayscale(1)'}}
          >
            {mobileVideoSrc ? (
              <>
                {mobileWebm ? (
                  <source
                    src={mobileVideoSrc.replace(/\.mp4$/, '.webm')}
                    type="video/webm"
                    media="(max-width: 767px)"
                  />
                ) : null}
                <source
                  src={mobileVideoSrc}
                  type="video/mp4"
                  media="(max-width: 767px)"
                />
              </>
            ) : null}
            {desktopWebm ? (
              <source
                src={videoSrc.replace(/\.mp4$/, '.webm')}
                type="video/webm"
              />
            ) : null}
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
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover rounded-none"
          />
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
