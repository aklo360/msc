interface FooterProps {
  accentColor?: string;
}

/** Bottom halves of MSC letterforms (Layer_1 from msc.svg) */
function MscBottom() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 35 418.6 54.6"
      fill="currentColor"
      className="w-full h-auto block"
      aria-hidden="true"
    >
      <path d="M70.3,35.1h75c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v50.7c0,.5-.2,1-.6,1.3s-.8.6-1.3.6h-45.6c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-20.6c0-.6-.3-1-.9-1.2-.6-.2-1.1,0-1.4.4l-14.3,22c-.2.3-.5.6-1,.9-.5.3-.9.4-1.3.4h-10.4c-.4,0-.9-.1-1.3-.4-.5-.3-.8-.6-1-.9l-14.1-22c-.3-.5-.8-.7-1.4-.4-.6.2-.9.6-.9,1.2v20.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6H1.9c-.5,0-1-.2-1.3-.6s-.6-.8-.6-1.3v-50.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h68.4Z" />
      <path d="M276.7,83.4c-4.1,4.1-10.6,6.2-19.4,6.2h-76.8c-8.8,0-15.3-2.1-19.4-6.2-4.1-4.1-6.2-10.5-6.2-19.1c.1,-.7,.6,-1.9,1.9,-1.9h47.4c.5,0,1,.2,1.3.6s.6.8.6,1.3v4.9c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-.4c0-4.3-.6-7.3-1.7-9.2-1.2-1.9-3.4-3.1-6.8-3.8-3.4-.6-8.9-1-16.7-1-12.5,0-22.4-.6-29.9-1.8-7.5-1.2-12.9-3.1-16.4-5.6-3.5-2.6-5.2-6-5.2-10.4s.2-1,.5-1.3c.3-.4.8-.6,1.3-.6h74.9c12.9,0,23,.9,30.4,2.7,7.4,1.8,12.7,4.7,15.9,8.6,3.2,4,4.9,9.4,4.9,16.3v1.3c0,8.8-2.1,15.3-6.2,19.4Z" />
      <path d="M341.2,35.6c.4.4.6.8.6,1.3v32.3c0,4.2,1.1,7.4,3.3,9.5s5.4,3.3,9.5,3.3,7.4-1.1,9.5-3.3c2.2-2.2,3.3-5.4,3.3-9.5v-12.7c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6.4.4.6.8.6,1.3v7.4c0,8.3-2.2,14.6-6.5,19-4.4,4.4-10.7,6.6-19.1,6.6h-76.8c-8.3,0-14.6-2.2-19-6.6-4.4-4.4-6.6-10.7-6.6-19v-27c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h47.4c.5,0,1,.2,1.3.6Z" />
    </svg>
  );
}

/** Top halves of MSC letterforms (Layer_2 from msc.svg) */
function MscTop() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 418.6 27.5"
      fill="currentColor"
      className="w-full h-auto block"
      aria-hidden="true"
    >
      <path d="M53.2,1.9l14.5,23.2c.3.5.4,1,.1,1.5-.3.5-.6.8-1.2.8H1.9c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3V1.9c0-.5.2-1,.6-1.3.4-.4.8-.6,1.3-.6h48.1c1.5,0,2.5.6,3.2,1.9Z" />
      <path d="M146.6.6c.4.4.6.8.6,1.3v23.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-65c-.5,0-.9-.3-1.2-.8-.3-.5-.2-1,.1-1.5L93.6,1.9c.7-1.3,1.7-1.9,3.2-1.9h48.5c.5,0,1,.2,1.3.6Z" />
      <path d="M155.5,26.8c-.4-.4-.6-.8-.6-1.3v-.6c0-8.8,2-15.1,6.1-19,4.1-3.9,10.6-5.8,19.5-5.8h76.8c8.9,0,15.4,1.9,19.5,5.8,4.1,3.9,6.1,10.2,6.1,19v.6c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
      <path d="M291.1,26.8c-.4-.4-.6-.8-.6-1.3v-1c0-8.2,2.2-14.3,6.5-18.4,4.3-4.1,10.7-6.1,19.1-6.1h76.8c8.4,0,14.8,2,19.1,6.1,4.3,4.1,6.5,10.2,6.5,18.4v1c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6-.4-.4-.6-.8-.6-1.3v-5c0-4.2-1.1-7.4-3.3-9.5-2.2-2.2-5.4-3.3-9.5-3.3s-7.4,1.1-9.5,3.3c-2.2,2.2-3.3,5.4-3.3,9.5v5c0,.5-.2,1-.6,1.3-.4.4-.8.6-1.3.6h-47.4c-.5,0-1-.2-1.3-.6Z" />
    </svg>
  );
}

export function Footer({accentColor = '#FF9E70'}: FooterProps) {
  const colorValue = `var(--active-accent, ${accentColor})`;

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--color-black)',
      }}
    >
      <div className="relative h-[390px] md:h-[800px] flex flex-col justify-between">
        {/* Top: bottom halves of MSC (aligned to top) */}
        <div className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] pt-[24px] pointer-events-none select-none" style={{color: colorValue, transition: 'color 0.4s ease'}}>
          <MscBottom />
        </div>

        {/* Middle: text content */}
        <div className="absolute inset-x-0 px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] flex items-start justify-between" style={{top: '38%'}}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 5vw, 60px)',
              lineHeight: 1.1,
              letterSpacing: '0',
              color: colorValue,
              transition: 'color 0.4s ease',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            Big Bless! &#9829;
          </p>

          <div className="flex flex-col gap-[10px]">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 'var(--text-copy-md)',
                lineHeight: 1.2,
                color: colorValue,
                transition: 'color 0.4s ease',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              &copy; Mr.StarCity 2026
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 'var(--text-copy-md)',
                lineHeight: 1.2,
                color: colorValue,
                transition: 'color 0.4s ease',
                fontFeatureSettings: "'salt' 1",
                marginLeft: '-0.1em',
              }}
            >
              <a href="https://www.instagram.com/mrstarcity" target="_blank" rel="noopener noreferrer">@mrstarcity</a>
            </p>
          </div>
        </div>

        {/* Bottom: top halves of MSC (aligned to bottom) */}
        <div className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] pb-[24px] pointer-events-none select-none" style={{color: colorValue, transition: 'color 0.4s ease'}}>
          <MscTop />
        </div>
      </div>
    </footer>
  );
}
