import {useParams} from 'react-router';
import {useEffect} from 'react';
import type {Route} from './+types/art.$handle';

export const meta: Route.MetaFunction = () => {
  return [{title: 'When We Bloom | Art | Mr.StarCity'}];
};

const ACCENT_ART = '#FF9E70';

export default function ArtDetail() {
  const {handle} = useParams();

  // Set accent color for header/footer
  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', ACCENT_ART);
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero — full-bleed exhibition photo */}
      <section className="relative w-full overflow-hidden" style={{height: '90vh'}}>
        {/* Placeholder — replace with actual exhibition image */}
        <div className="absolute inset-0 bg-[#D2D2D2]" />
      </section>

      {/* Text Module Header — two-column layout */}
      <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
        {/* Left column — title + tags */}
        <div className="flex flex-col gap-[20px] shrink-0 w-[794px] max-md:w-full">
          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '60px',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-1.2px',
              color: 'var(--color-black)',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            When We Bloom
          </h2>
          <div className="flex gap-[10px] items-start flex-wrap">
            <span
              className="bg-white rounded-[20px] p-[10px] uppercase whitespace-nowrap cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              Loverboy Series
            </span>
            <span
              className="bg-white rounded-[20px] p-[10px] uppercase whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              Bloomer Series
            </span>
          </div>
        </div>

        {/* Right column — description + credits */}
        <div className="flex-1 flex flex-col gap-[60px]">
          {/* Description — ABC Otto Variable Light, 26px */}
          <p
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: '26px',
              fontWeight: 300,
              lineHeight: 1.2,
              color: 'var(--color-black)',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at enim
            quis ante tristique fringilla vitae non turpis. Sed ac sagittis nisi.
            Nunc imperdiet neque pretium risus porttitor, nec congue massa
            rhoncus. Aliquam porttitor efficitur nunc at volutpat. Cras nisl
            orci, condimentum nec nisi et, viverra venenatis purus. Suspendisse
            massa est, convallis vel posuere sed, ullamcorper faucibus nibh.
            Quisque ut sollicitudin tellus. Aliquam erat volutpat. Sed elementum
            nisi non sapien malesuada, sed rhoncus dolor scelerisque. Etiam
            laoreet velit vel nibh blandit ullamcorper.
          </p>

          {/* Credits List */}
          <div className="flex flex-col">
            {/* Credits row */}
            <div
              className="flex items-start justify-between py-[20px] border-t border-black max-md:flex-wrap max-md:gap-[8px]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.2,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              <span>Solo Exhibition</span>
              <span>FREVO NYC</span>
              <span>New York, NY</span>
              <span>Feb&ndash;Sept, 2025</span>
            </div>
            {/* Link row */}
            <div className="py-[20px] border-t border-black">
              <a
                href="#"
                className="underline"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                  textDecorationSkipInk: 'none',
                }}
              >
                Link
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        {/* Full-width exhibition photo */}
        <div className="w-full aspect-[1606/1205] bg-[#D2D2D2] mb-[20px]" />
      </div>

      {/* Two paintings side by side */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          <div className="w-full aspect-[795/988] bg-[#C8C8C8]" />
          <div className="w-full aspect-[794/988] bg-[#BEBEBE]" />
        </div>
      </div>

      {/* Mixed layout: small paintings + poem + large photo */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          {/* Left column — poem text + small paintings */}
          <div className="flex flex-col gap-[20px]">
            {/* Two small paintings side by side */}
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="w-full aspect-[387/492] bg-[#D2D2D2]" />
              <div className="w-full aspect-[387/492] bg-[#C8C8C8]" />
            </div>

            {/* Poem text */}
            <div
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '45px',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
              className="max-md:text-[28px]"
            >
              <p className="mb-[1em]">
                Growing together
                <br />
                our love is found.
              </p>
              <p className="mb-[1em]">
                Through storms and sun, our roots intertwine,
              </p>
              <p className="mb-[1em]">
                Sharing the rain, your
                <br />
                strength becomes mine.
              </p>
              <p className="mb-[1em]">
                The world is brighter,
                <br />
                no need for gloom,
              </p>
              <p>
                We&rsquo;ll find the light together When We Bloom.
              </p>
            </div>
          </div>

          {/* Right column — quote + large photo */}
          <div className="flex flex-col gap-[20px]">
            <div
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '45px',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
              className="max-md:text-[28px]"
            >
              <p className="mb-[1em]">When We Bloom</p>
              <p>
                We begin as seeds
                <br />
                in the quiet ground,
              </p>
            </div>
            <div className="w-full aspect-[793/788] bg-[#BEBEBE]" />
          </div>
        </div>
      </div>

      {/* Bottom gallery rows */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="w-full aspect-[387/392] bg-[#D2D2D2]" />
            <div className="w-full aspect-[387/392] bg-[#C8C8C8]" />
          </div>
          <div className="w-full aspect-[793/788] bg-[#BEBEBE] max-md:hidden" />
        </div>
      </div>

      {/* Full-width bottom photo */}
      <div className="px-[60px] max-md:px-[20px] pb-[120px]">
        <div className="w-full aspect-[1608/1049] bg-[#D2D2D2]" />
      </div>
    </div>
  );
}
