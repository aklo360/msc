import type {Route} from './+types/projects._index';
import {SectionHero} from '~/components/SectionHero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Projects | Mr.StarCity'}];
};

const ACCENT_PROJECTS = '#92D073';

export default function ProjectsIndex() {
  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Projects" accentColor={ACCENT_PROJECTS} />

      {/* ──────────────────────────────────────────────── */}
      {/* Project 1: King of Hearts Basketball Court      */}
      {/* ──────────────────────────────────────────────── */}

      {/* Text Module Header */}
      <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
        {/* Left column — title + tag */}
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
            King of Hearts{' '}
            <br />
            Basketball Court
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
          </div>
        </div>

        {/* Right column — description + credits */}
        <div className="flex-1 flex flex-col gap-[60px]">
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
              <span>Public Art Installation</span>
              <span>Marcy Playground</span>
              <span>Brooklyn, NY</span>
              <span>May, 2024</span>
            </div>
            <div className="py-[20px] border-t border-black">
              <a
                href="https://www.nycgovparks.org/art-and-antiquities/public-art/the-royal-court-loverboy-king-of-hearts"
                target="_blank"
                rel="noopener noreferrer"
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
                NYC Parks — Art in the Parks
              </a>
              <a
                href="https://stupiddope.com/2025/11/david-mr-starcity-white-the-royal-court-brooklyn-mural/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-[20px]"
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
                stupidDOPE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery — Project 1 */}
      {/* Full-width basketball court */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="w-full aspect-[1608/1068] bg-[#D2D2D2]" />
      </div>

      {/* Two small images + quote */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          {/* Left: two small paintings side by side */}
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="w-full aspect-[385/512] bg-[#D2D2D2]" />
            <div className="w-full aspect-[390/513] bg-[#C8C8C8]" />
          </div>
          {/* Right: quote */}
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
            <p>
              &ldquo;The court we painted isn&rsquo;t just for the game,
              it&rsquo;s a love letter to Brooklyn, to the kids who dream
              beneath its skyline.
            </p>
          </div>
        </div>
      </div>

      {/* Quote + tall image */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          {/* Left: quote text + landscape image */}
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
              <p>
                Every line, every color, every heart was drawn to remind them:
                you are seen, you are powerful, and this city beats for
                you.&rdquo;
              </p>
            </div>
            <div className="w-full aspect-[795/419] bg-[#D2D2D2]" />
          </div>
          {/* Right: tall image */}
          <div className="w-full aspect-[795/1061] bg-[#C8C8C8]" />
        </div>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* Project 2: Loverboy x Billionaire Boys Club     */}
      {/* ──────────────────────────────────────────────── */}

      {/* Text Module Header */}
      <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
        {/* Left column — title + tag */}
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
            Loverboy x Billionaire
            <br />
            Boys Club
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
          </div>
        </div>

        {/* Right column — description + credits */}
        <div className="flex-1 flex flex-col gap-[60px]">
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
              <span>Fashion Collaboration</span>
              <span>Billionaire Boys Club</span>
              <span>With Pharrell Williams</span>
              <span>2024</span>
            </div>
            <div className="py-[20px] border-t border-black">
              <a
                href="https://hypebeast.com/2024/2/pharrell-billionaire-boys-club-black-history-month-mrstarcity-exclusive-collaboration"
                target="_blank"
                rel="noopener noreferrer"
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
                Hypebeast — BBC x Mr.StarCity
              </a>
              <a
                href="https://www.bbcicecream.com/collections/billionaire-boys-club-x-mr-starcity-x-league-oto"
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-[20px]"
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
                BBC Official
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery — Project 2 */}
      {/* Full-width BBC photo */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="w-full aspect-[1606/1070] bg-[#D2D2D2]" />
      </div>

      {/* Narrow left column (3 stacked) + wide right column (2 stacked) */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[20px]">
          {/* Left: 3 stacked images */}
          <div className="flex flex-col gap-[20px]">
            <div className="w-full aspect-[522/348] bg-[#D2D2D2]" />
            <div className="w-full aspect-[522/348] bg-[#C8C8C8]" />
            <div className="w-full aspect-[522/338] bg-[#BEBEBE]" />
          </div>
          {/* Right: 2 stacked images */}
          <div className="flex flex-col gap-[20px]">
            <div className="w-full aspect-[1063/715] bg-[#BEBEBE]" />
            <div className="w-full aspect-[1063/708] bg-[#D2D2D2]" />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* Project 3: Loverboy x SLR Pendant               */}
      {/* ──────────────────────────────────────────────── */}

      {/* Text Module Header */}
      <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
        {/* Left column — title + CTA button */}
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
            Loverboy x SLR Pendant
          </h2>
          {/* CTA button instead of series tag */}
          <div>
            <a
              href="mailto:mrstarcity@gmail.com?subject=Inquiry%20—%20Loverboy%20x%20SLR%20Pendant"
              className="inline-flex items-center justify-center uppercase no-underline"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.2,
                color: '#FFFFFF',
                backgroundColor: '#000000',
                borderRadius: '10px',
                padding: '10px',
                minWidth: '100px',
                height: '40px',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              Inquire About This
            </a>
          </div>
        </div>

        {/* Right column — description + credits */}
        <div className="flex-1 flex flex-col gap-[60px]">
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
              <span>Jewelry Collaboration</span>
              <span>SLR</span>
              <span>Sterling Silver</span>
              <span>2023</span>
            </div>
            <div className="py-[20px] border-t border-black">
              <a
                href="https://www.dropbox.com/scl/fo/a9mwqb52lgjnbncojf859/APcZDl3YcVmDI6Kn4brRiwY?rlkey=7nfu58tigzyoqyflbgoeg7qmm&st=a077cdvj&dl=0"
                target="_blank"
                rel="noopener noreferrer"
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
                View Photos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery — Project 3 */}
      {/* Full-width SLR pendant photo */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="w-full aspect-[1608/1072] bg-[#D2D2D2]" />
      </div>

      {/* Row of 4 pendant photos */}
      <div className="px-[60px] max-md:px-[20px] pb-[20px]">
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-[20px]">
          <div className="w-full aspect-[387/580] bg-[#D2D2D2]" />
          <div className="w-full aspect-[387/580] bg-[#C8C8C8]" />
          <div className="w-full aspect-[387/579] bg-[#BEBEBE]" />
          <div className="w-full aspect-[387/580] bg-[#D2D2D2]" />
        </div>
      </div>

      {/* Quote + tall image */}
      <div className="px-[60px] max-md:px-[20px] pb-[120px]">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
          {/* Left: quote + small image */}
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
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at
                enim quis ante tristique fringilla vitae non turpis.
              </p>
            </div>
            <div className="w-full aspect-[794/530] bg-[#C8C8C8]" />
          </div>
          {/* Right: tall image */}
          <div className="w-full aspect-[794/998] bg-[#BEBEBE]" />
        </div>
      </div>
    </div>
  );
}
