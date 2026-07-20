import type {Route} from './+types/big-bless';
import {SectionHero} from '~/components/SectionHero';
import {SubscribeForm} from '~/components/SubscribeForm';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Big Bless | Mr.StarCity'}];
};

const ACCENT_BLESS = '#D073A5';

const quoteStyle = {
  fontFamily: 'var(--font-quote)',
  fontSize: '45px',
  fontWeight: 300,
  lineHeight: 1.1,
  color: 'var(--color-black)',
  fontFeatureSettings: "'salt' 1",
};

export default function BigBless() {
  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero
        title="Big Bless"
        accentColor={ACCENT_BLESS}
        videoSrc="/videos/big-bless/page-bg.mp4"
      />

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
              letterSpacing: '0',
              color: 'var(--color-black)',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            About Mr.StarCity
          </h2>
        </div>

        {/* Right: Description */}
        <div
          className="flex-1 flex flex-col gap-[20px]"
          style={{
            fontFamily: 'var(--font-quote)',
            fontSize: '26px',
            fontWeight: 300,
            lineHeight: 1.2,
            color: 'var(--color-black)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          <p>
            Working between New York City and Los Angeles, David
            &ldquo;Mr.&nbsp;StarCity&rdquo; White is a multidisciplinary artist
            whose practice seamlessly merges painting, sculpture, poetry, and
            performance. His work is defined by an experimental storytelling
            approach, creating heavily textured, polychromatic portraits that
            embody a synthesis of the beauty, passion, and conflict defining
            the shared human experience.
          </p>
          <p>
            Using an innovative mixture of raw, organic materials&mdash;including
            soil, sand, pumice, and charcoal&mdash;White coaxes a statuary,
            quasi-bas-relief dimensionality from his canvases. By unmasking
            societal ills and addressing the complexities of mental health, his
            practice functions as a space for emotional healing and resilience.
            Ultimately, White&rsquo;s work breaks the boundaries between art and
            reality, intentionally inviting viewers into immersive narrative
            worlds to confront vulnerability, cultivate community connection,
            and absorb the profound beauty of life.
          </p>
        </div>
      </div>

      {/* Editorial photo flow */}
      <div className="px-[60px] max-md:px-[20px] pb-[60px]">
        <div className="mx-auto flex max-w-[980px] flex-col gap-[20px]">
          <p style={quoteStyle}>
            &ldquo;I don&rsquo;t just make art. I live it.&rdquo;
          </p>
          <img
            src="/images/big-bless/flower-bamboo.jpg"
            alt="Mr.StarCity with flower"
            className="w-full aspect-[794/993] object-cover rounded-[10px]"
          />
          <img
            src="/images/big-bless/gallery-painting.jpg"
            alt="Mr.StarCity viewing painting"
            className="w-full aspect-[794/993] object-cover rounded-[10px]"
          />
          <img
            src="/images/big-bless/studio-apron.jpg"
            alt="Mr.StarCity in studio"
            className="w-full aspect-[794/993] object-cover rounded-[10px]"
          />
          <p style={quoteStyle}>
            &ldquo;Art is my love letter to resilience.&rdquo;
          </p>
          <img
            src="/images/big-bless/florence-bridge.jpg"
            alt="Mr.StarCity walking in Florence"
            className="w-full aspect-[794/993] object-cover rounded-[10px]"
          />
          <img
            src="/images/big-bless/white-stairs.jpg"
            alt="Mr.StarCity on white stairs"
            className="w-full aspect-[794/993] object-cover rounded-[10px]"
          />
          <div className="flex flex-col gap-[20px] py-[20px]">
            <h3 style={quoteStyle}>Social media</h3>
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
          <img
            src="/images/big-bless/bucket-hat-portrait.jpg"
            alt="Mr.StarCity portrait"
            className="w-full aspect-[794/987] object-cover rounded-[10px]"
          />
        </div>
      </div>

      {/* Subscribe Module */}
      <div className="px-[60px] max-md:px-[20px] pb-[120px]">
        <SubscribeForm />
      </div>
    </div>
  );
}
