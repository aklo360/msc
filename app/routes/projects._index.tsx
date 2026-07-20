import {useLoaderData} from 'react-router';
import {useEffect} from 'react';
import type {CSSProperties} from 'react';
import type {Route} from './+types/projects._index';
import {MetaobjectBannerImage} from '~/components/MetaobjectBannerImage';
import {MetaobjectText} from '~/components/MetaobjectText';
import {SectionHero} from '~/components/SectionHero';
import {
  getFieldValue,
  getFieldImage,
  getFieldImages,
  getFieldJson,
  sortByDateField,
} from '~/lib/metaobjects';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Projects | Mr.StarCity'}];
};

const ACCENT_PROJECTS = '#92D073';

const quoteStyle: CSSProperties = {
  fontFamily: 'var(--font-quote)',
  fontSize: '45px',
  fontWeight: 300,
  lineHeight: 1.1,
  color: 'var(--color-black)',
  fontFeatureSettings: "'salt' 1",
  whiteSpace: 'pre-line',
  overflowWrap: 'break-word',
};

const IMG = 'w-full object-cover rounded-[10px]';
const IMG_SQ = 'w-full object-cover rounded-[10px] aspect-square';

/** Hidden project handles — not ready for display */
const HIDDEN_HANDLES = new Set(['the-fat-boys-each-one-teach-one']);

/** Priority ordering — these handles appear first */
const HANDLE_ORDER = [
  'king-of-hearts-basketball-court',
  'loverboy-x-billionaire-boys-club',
  'loverboy-x-slr-pendant',
];

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(PROJECTS_QUERY, {
    cache: context.storefront.CacheShort(),
  });

  // Filter hidden, then sort: priority handles first, rest by year
  let projects = metaobjects.nodes.filter(
    (n: any) => !HIDDEN_HANDLES.has(n.handle),
  );
  const prioritized = HANDLE_ORDER.map((h) =>
    projects.find((p: any) => p.handle === h),
  ).filter(Boolean);
  const rest = sortByDateField(
    projects.filter((p: any) => !HANDLE_ORDER.includes(p.handle)),
    'year',
  );
  projects = [...prioritized, ...rest];

  return {projects};
}

/** Split body text: first paragraph vs rest */
function splitBodyText(body: string): [string, string] {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) return [body, ''];
  return [paragraphs[0], paragraphs.slice(1).join('\n\n')];
}

const AVANT_ARTE_URL =
  'https://avantarte.com/products/the-people-i-ve-never-met';

const AVANT_SCULPTURE_NOTES = [
  {
    title: 'Reconfigurable sculpture edition',
    body: 'Handmade glass vase, colourful fabric hats, magnetised glass stems, and collector-directed arrangements.',
  },
  {
    title: 'Material details',
    body: 'Undulating glass, vibrant blue sand, small-scale components, and close-up views of the assembled work.',
  },
  {
    title: 'Studio process',
    body: 'Glassblowing, assembly, hands arranging hats and stems, and the finished sculpture staged against paintings.',
  },
];

function isAvantArteProject({
  title,
  collaborator,
  links,
}: {
  title: string;
  collaborator: string;
  links: {label: string; url: string}[];
}) {
  const haystack = [title, collaborator, ...links.map((link) => link.url)]
    .join(' ')
    .toLowerCase();
  return (
    haystack.includes('avant') ||
    haystack.includes("people i've never met") ||
    haystack.includes('people i’ve never met')
  );
}

function AvantArteSculptureBlock() {
  return (
    <section className="px-[60px] max-md:px-[20px] pb-[20px]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] max-md:grid-cols-1 gap-[20px] border-y border-black py-[30px]">
        <div className="flex flex-col gap-[20px]">
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--color-black)',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            Sculpture focus
          </p>
          <a
            href={AVANT_ARTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'var(--color-black)',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            Avant Arte asset source
          </a>
        </div>
        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[20px]">
          {AVANT_SCULPTURE_NOTES.map((note) => (
            <div
              key={note.title}
              className="flex min-h-[260px] flex-col justify-between rounded-[10px] bg-white p-[20px]"
            >
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '28px',
                  fontWeight: 500,
                  lineHeight: 1.05,
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                }}
              >
                {note.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-quote)',
                  fontSize: '24px',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                }}
              >
                {note.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderRemainingImages(images: any[], startIndex: number) {
  const rest = images.slice(startIndex);
  if (rest.length === 0) return null;

  return (
    <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-[20px]">
      {rest.map((img, index) => (
        <img
          key={img.url}
          src={img.url}
          alt={img.altText}
          className={index % 5 === 0 ? `${IMG} col-span-2 max-md:col-span-1` : IMG}
        />
      ))}
    </div>
  );
}

export default function ProjectsIndex() {
  const {projects} = useLoaderData<typeof loader>();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--active-accent',
      ACCENT_PROJECTS,
    );
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      <SectionHero
        title="Projects"
        accentColor={ACCENT_PROJECTS}
        videoSrc="/videos/projects/page-bg.mp4"
      />

      {projects.map((proj: any) => {
        const title = getFieldValue(proj.fields, 'title');
        const category = getFieldValue(proj.fields, 'category');
        const collaborator = getFieldValue(proj.fields, 'collaborator');
        const location = getFieldValue(proj.fields, 'location');
        const year = getFieldValue(proj.fields, 'year');
        const seriesTag = getFieldValue(proj.fields, 'series_tag');
        const description = getFieldValue(proj.fields, 'description');
        const body = getFieldValue(proj.fields, 'body');
        const inquiryEmail = getFieldValue(proj.fields, 'inquiry_email');
        const links =
          getFieldJson<{label: string; url: string}[]>(
            proj.fields,
            'links',
          ) || [];
        const featuredImage = getFieldImage(proj.fields, 'featured_image');
        const allImages = getFieldImages(proj.fields, 'images');
        const images = featuredImage
          ? allImages.filter((img) => img.url !== featuredImage.url)
          : allImages;

        const [bodyPart1, bodyPart2] = body ? splitBodyText(body) : ['', ''];
        const hasEditorialLayout = !!body && images.length >= 4;
        const showAvantSculptureBlock = isAvantArteProject({
          title,
          collaborator,
          links,
        });

        return (
          <div key={proj.handle}>
            {/* Text Module Header — matches art detail */}
            <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
              {/* Left — title + tags */}
              <div className="flex flex-col gap-[20px] shrink-0 w-[794px] max-md:w-full">
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
                  {title}
                </h2>
                <div className="flex gap-[10px] items-start flex-wrap">
                  {inquiryEmail && (
                    <a
                      href={`mailto:${inquiryEmail}?subject=Inquiry: ${title}`}
                      className="bg-white rounded-[20px] px-[10px] py-[5px] uppercase whitespace-nowrap"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '18px',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: 'var(--color-black)',
                        fontFeatureSettings: "'salt' 1",
                      }}
                    >
                      Inquire About This
                    </a>
                  )}
                  {seriesTag && (
                    <span
                      className="bg-white rounded-[20px] px-[10px] py-[5px] uppercase whitespace-nowrap"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '18px',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: 'var(--color-black)',
                        fontFeatureSettings: "'salt' 1",
                      }}
                    >
                      {seriesTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Right — description + credits */}
              <div className="flex-1 flex flex-col gap-[60px]">
                {description && (
                  <MetaobjectText
                    style={{
                      fontFamily: 'var(--font-quote)',
                      fontSize: '26px',
                      fontWeight: 300,
                      lineHeight: 1.2,
                      color: 'var(--color-black)',
                      fontFeatureSettings: "'salt' 1",
                    }}
                  >
                    {description}
                  </MetaobjectText>
                )}

                {/* Credits */}
                <div className="flex flex-col">
                  <div
                    className="flex items-start justify-between py-[20px] border-t border-b border-black max-md:flex-wrap max-md:gap-[8px]"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: 'var(--color-black)',
                      fontFeatureSettings: "'salt' 1",
                    }}
                  >
                    {category && <span>{category}</span>}
                    {collaborator && <span>{collaborator}</span>}
                    {location && <span>{location}</span>}
                    {year && <span>{year}</span>}
                  </div>
                  <a
                    href={links[0]?.url || '#'}
                    target={links[0] ? '_blank' : undefined}
                    rel={links[0] ? 'noopener noreferrer' : undefined}
                    className="py-[20px] underline"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      color: 'var(--color-black)',
                      fontFeatureSettings: "'salt' 1",
                    }}
                  >
                    Link
                  </a>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {(featuredImage || images.length > 0) && (
              <div className="px-[60px] max-md:px-[20px] pb-[20px] flex flex-col gap-[20px]">
                {hasEditorialLayout ? (
                  <>
                    {/* Row A: Full-width featured */}
                    {featuredImage && (
                      <MetaobjectBannerImage
                        image={featuredImage}
                        className="rounded-[10px]"
                        imgClassName="rounded-[10px]"
                      />
                    )}

                    {bodyPart2 ? (
                      <>
                        {/* KoH layout: 2 small images + quote | quote + images */}
                        {images.length > 1 && (
                          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                            <div className="grid grid-cols-2 gap-[20px]">
                              <img
                                src={images[0].url}
                                alt={images[0].altText}
                                className={IMG_SQ}
                              />
                              <img
                                src={images[1].url}
                                alt={images[1].altText}
                                className={IMG_SQ}
                              />
                            </div>
                            <div className="flex items-start">
                              <MetaobjectText style={quoteStyle}>
                                {bodyPart1}
                              </MetaobjectText>
                            </div>
                          </div>
                        )}

                        {images.length > 2 && (
                          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px] items-end">
                            <div className="flex flex-col gap-[20px]">
                              <MetaobjectText style={quoteStyle}>
                                {bodyPart2}
                              </MetaobjectText>
                              {images.length > 3 && (
                                <img
                                  src={images[3].url}
                                  alt={images[3].altText}
                                  className={IMG}
                                />
                              )}
                            </div>
                            <img
                              src={images[2].url}
                              alt={images[2].altText}
                              className={IMG}
                            />
                          </div>
                        )}
                        {renderRemainingImages(images, 4)}
                      </>
                    ) : (
                      <>
                        {/* SLR layout: 4-across row + quote/image split */}
                        {images.length >= 4 && (
                          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-[20px]">
                            {images.slice(0, 4).map((img, i) => (
                              <img
                                key={i}
                                src={img.url}
                                alt={img.altText}
                                className={IMG}
                              />
                            ))}
                          </div>
                        )}

                        {images.length > 4 && (
                          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px] items-end">
                            <div className="flex flex-col gap-[20px]">
                              <MetaobjectText style={quoteStyle}>
                                {bodyPart1}
                              </MetaobjectText>
                              {images[4] && (
                                <img
                                  src={images[4].url}
                                  alt={images[4].altText}
                                  className={IMG}
                                />
                              )}
                            </div>
                            {images[5] && (
                              <img
                                src={images[5].url}
                                alt={images[5].altText}
                                className={IMG}
                              />
                            )}
                          </div>
                        )}
                        {renderRemainingImages(images, 6)}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Simple gallery */}
                    {featuredImage && (
                      <MetaobjectBannerImage
                        image={featuredImage}
                        className="rounded-[10px]"
                        imgClassName="rounded-[10px]"
                      />
                    )}
                    {/* First row: small square + larger image */}
                    {images.length >= 2 && (
                      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[20px]">
                        <img
                          src={images[0].url}
                          alt={images[0].altText}
                          className={IMG_SQ}
                        />
                        <img
                          src={images[1].url}
                          alt={images[1].altText}
                          className="col-span-2 w-full object-cover rounded-[10px]"
                        />
                      </div>
                    )}
                    {/* Remaining images: alternating wide/narrow zigzag */}
                    {images.length > 2 &&
                      (() => {
                        const rest = images.slice(2);
                        const rows: React.ReactNode[] = [];
                        let i = 0;
                        let rowIdx = 0;
                        while (i < rest.length) {
                          if (i + 1 < rest.length) {
                            // Alternate: wide+narrow, then narrow+wide
                            const flip = rowIdx % 2 === 1;
                            rows.push(
                              <div
                                key={rowIdx}
                                className="grid grid-cols-3 max-md:grid-cols-1 gap-[20px]"
                              >
                                <img
                                  src={rest[flip ? i + 1 : i].url}
                                  alt={rest[flip ? i + 1 : i].altText}
                                  className="col-span-2 w-full object-cover rounded-[10px]"
                                />
                                <img
                                  src={rest[flip ? i : i + 1].url}
                                  alt={rest[flip ? i : i + 1].altText}
                                  className="w-full object-cover rounded-[10px]"
                                />
                              </div>,
                            );
                            i += 2;
                          } else {
                            // Odd image out: full width
                            rows.push(
                              <img
                                key={rowIdx}
                                src={rest[i].url}
                                alt={rest[i].altText}
                                className={IMG}
                              />,
                            );
                            i += 1;
                          }
                          rowIdx++;
                        }
                        return rows;
                      })()}
                    {/* Single image fallback */}
                    {images.length === 1 && (
                      <img
                        src={images[0].url}
                        alt={images[0].altText}
                        className={IMG}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Placeholder for projects without images */}
            {!featuredImage && images.length === 0 && (
              <div className="px-[60px] max-md:px-[20px] pb-[20px]">
                <div className="w-full aspect-[1608/1068] bg-[#D2D2D2] rounded-[10px]" />
              </div>
            )}

            {showAvantSculptureBlock && <AvantArteSculptureBlock />}
          </div>
        );
      })}

      <div className="h-[100px]" />
    </div>
  );
}

const PROJECTS_QUERY = `#graphql
  query Projects {
    metaobjects(type: "project", first: 20, sortKey: "updated_at", reverse: true) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_FRAGMENT}
` as const;
