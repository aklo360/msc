import {useLoaderData} from 'react-router';
import {useEffect} from 'react';
import type {CSSProperties} from 'react';
import type {Route} from './+types/projects._index';
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
      <SectionHero title="Projects" accentColor={ACCENT_PROJECTS} />

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
                    letterSpacing: '-2px',
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
                      Inquire About This
                    </a>
                  )}
                  {seriesTag && (
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
                      {seriesTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Right — description + credits */}
              <div className="flex-1 flex flex-col gap-[60px]">
                {description && (
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
                    {description}
                  </p>
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
                      <img
                        src={featuredImage.url}
                        alt={featuredImage.altText}
                        className={IMG}
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
                              <p style={quoteStyle}>{bodyPart1}</p>
                            </div>
                          </div>
                        )}

                        {images.length > 2 && (
                          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px] items-end">
                            <div className="flex flex-col gap-[20px]">
                              <p style={quoteStyle}>{bodyPart2}</p>
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
                              <p style={quoteStyle}>{bodyPart1}</p>
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
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Simple gallery */}
                    {featuredImage && (
                      <img
                        src={featuredImage.url}
                        alt={featuredImage.altText}
                        className={IMG}
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
                    {/* Row C: 2 stacked left (1/3) + 1 tall right (2/3) */}
                    {images.length >= 5 && (
                      <div className="grid grid-cols-3 grid-rows-2 max-md:grid-cols-1 gap-[20px]">
                        <img
                          src={images[2].url}
                          alt={images[2].altText}
                          className="w-full object-cover rounded-[10px]"
                        />
                        <img
                          src={images[3].url}
                          alt={images[3].altText}
                          className="col-span-2 row-span-2 w-full h-full object-cover rounded-[10px]"
                        />
                        <img
                          src={images[4].url}
                          alt={images[4].altText}
                          className="w-full object-cover rounded-[10px]"
                        />
                      </div>
                    )}
                    {/* Fallback: remaining images in 2-col grid */}
                    {images.length > 2 && images.length < 5 && (
                      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                        {images.slice(2).map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt={img.altText}
                            className={IMG}
                          />
                        ))}
                      </div>
                    )}
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
