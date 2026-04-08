import type {Route} from './+types/big-bless';
import {SectionHero} from '~/components/SectionHero';
import {SubscribeForm} from '~/components/SubscribeForm';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Big Bless | Mr.StarCity'}];
};

const ACCENT_BLESS = '#D073A5';

export default function BigBless() {
  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Big Bless" accentColor={ACCENT_BLESS} />

      {/* About Mr.StarCity — Two-column Text Module Header */}
      <div className="flex gap-[20px] px-[60px] max-md:px-[20px] py-[60px] max-md:flex-col">
        {/* Left: H2 */}
        <div className="flex-1">
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
            About Mr.StarCity
          </h2>
        </div>

        {/* Right: Description (ABC Otto 26px Light) */}
        <div className="flex-1">
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
        </div>
      </div>

      {/* Editorial Photo Collage */}
      <div className="px-[60px] max-md:px-[20px] pb-[60px]">
        {/* Row 1: Quote left + tall photo right */}
        <div className="flex gap-[20px] max-md:flex-col mb-[20px]">
          {/* Left column: quote + small photo below */}
          <div className="flex-1 flex flex-col gap-[20px]">
            <p
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '45px',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at
              enim quis ante tristique fringilla vitae non turpis.
            </p>
            {/* Small photo — flower/bamboo */}
            <img
              src="/images/big-bless/flower-bamboo.jpg"
              alt="Mr.StarCity with flower"
              className="w-[48%] max-md:w-full aspect-[387/484] object-cover rounded-[10px]"
            />
          </div>
          {/* Right column: tall photo — gallery/painting */}
          <div className="flex-1">
            <img
              src="/images/big-bless/gallery-painting.jpg"
              alt="Mr.StarCity viewing painting"
              className="w-full aspect-[794/993] object-cover rounded-[10px]"
            />
          </div>
        </div>

        {/* Row 2: Tall photo left + quote & small photo right */}
        <div className="flex gap-[20px] max-md:flex-col mb-[20px]">
          {/* Left column: tall photo — studio/apron */}
          <div className="flex-1">
            <img
              src="/images/big-bless/studio-apron.jpg"
              alt="Mr.StarCity in studio"
              className="w-full aspect-[794/993] object-cover rounded-[10px]"
            />
          </div>
          {/* Right column: quote + small photo */}
          <div className="flex-1 flex flex-col gap-[20px]">
            <p
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '45px',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at
              enim quis ante tristique fringilla vitae non turpis.
            </p>
            {/* Small photo — Florence bridge */}
            <img
              src="/images/big-bless/florence-bridge.jpg"
              alt="Mr.StarCity walking in Florence"
              className="w-[48%] max-md:w-full aspect-[387/484] object-cover rounded-[10px]"
            />
          </div>
        </div>

        {/* Row 3: Medium photo left + Social media & tall photo right */}
        <div className="flex gap-[20px] max-md:flex-col">
          {/* Left column: medium photo — white stairs */}
          <div className="flex-1 flex items-start justify-center">
            <img
              src="/images/big-bless/white-stairs.jpg"
              alt="Mr.StarCity on white stairs"
              className="w-[66%] max-md:w-full aspect-[523/653] object-cover rounded-[10px]"
            />
          </div>
          {/* Right column: social + tall photo */}
          <div className="flex-1 flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[20px]">
              <h3
                style={{
                  fontFamily: 'var(--font-quote)',
                  fontSize: '45px',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                }}
              >
                Social media
              </h3>
              <a
                href="https://instagram.com/mrstarcity"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                }}
              >
                @mrstarcity
              </a>
            </div>
            {/* Tall photo — bucket hat portrait */}
            <img
              src="/images/big-bless/bucket-hat-portrait.jpg"
              alt="Mr.StarCity portrait"
              className="w-full aspect-[794/987] object-cover rounded-[10px]"
            />
          </div>
        </div>
      </div>

      {/* Subscribe Module */}
      <div className="px-[60px] max-md:px-[20px] pb-[120px]">
        <SubscribeForm />
      </div>
    </div>
  );
}
