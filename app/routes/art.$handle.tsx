import {useLoaderData} from 'react-router';
import {useEffect} from 'react';
import type {CSSProperties} from 'react';
import type {Route} from './+types/art.$handle';
import {MetaobjectBannerImage} from '~/components/MetaobjectBannerImage';
import {getFieldValue, getFieldImage, getFieldImages} from '~/lib/metaobjects';
import {MetaobjectText} from '~/components/MetaobjectText';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

const ACCENT_ART = '#FF9E70';

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

export const meta: Route.MetaFunction = ({data}) => {
  const title = data?.exhibition
    ? getFieldValue(data.exhibition.fields, 'title')
    : 'Art';
  return [{title: `${title} | Art | Mr.StarCity`}];
};

export async function loader({context, params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  const {metaobject} = await context.storefront.query(ART_EXHIBITION_QUERY, {
    variables: {handle: {handle, type: 'art_exhibition'}},
    cache: context.storefront.CacheShort(),
  });

  if (!metaobject) throw new Response('Not found', {status: 404});
  return {exhibition: metaobject};
}

/** Split body text: first 2 paragraphs (title + opening line) vs rest */
function splitBodyText(body: string): [string, string] {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 2) return [body, ''];
  return [
    paragraphs.slice(0, 2).join('\n\n'),
    paragraphs.slice(2).join('\n\n'),
  ];
}

/* Gallery image classes */
const IMG = 'w-full object-cover rounded-[10px]';
const IMG_SQ = 'w-full object-cover rounded-[10px] aspect-square';

export default function ArtDetail() {
  const {exhibition} = useLoaderData<typeof loader>();
  const fields = exhibition.fields;

  const title = getFieldValue(fields, 'title');
  const type = getFieldValue(fields, 'type');
  const venue = getFieldValue(fields, 'venue');
  const location = getFieldValue(fields, 'location');
  const dateRange = getFieldValue(fields, 'date_range');
  const seriesTag = getFieldValue(fields, 'series_tag');
  const description = getFieldValue(fields, 'description');
  const body = getFieldValue(fields, 'body');
  const featuredImage = getFieldImage(fields, 'featured_image');
  const allImages = getFieldImages(fields, 'images');

  // Exclude featured image from gallery to avoid duplication
  const images = featuredImage
    ? allImages.filter((img) => img.url !== featuredImage.url)
    : allImages;

  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', ACCENT_ART);
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  const [bodyPart1, bodyPart2] = body ? splitBodyText(body) : ['', ''];
  const hasEditorialLayout = !!body && images.length >= 8;

  /*
   * Editorial layout (matches Figma art detail):
   *   Row A: Full-width image              [0]
   *   Row B: 2-col                         [1, 2]
   *   Row C: 2 small + poem part 1         [3, 4]
   *   Row D: poem part 2 + large image     [5]
   *   Row E: 2 small + blank right         [6, 7]
   *   Row F: Full-width (last image)       [last]
   */

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero — full-bleed featured image, 1120px per Figma */}
      <MetaobjectBannerImage
        image={featuredImage}
        loading="eager"
        className="md:aspect-auto md:h-[1120px]"
      />

      {/* Text Module Header — two-column */}
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
          {seriesTag && (
            <div className="flex gap-[10px] items-start flex-wrap">
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
            </div>
          )}
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
              {type && <span>{type}</span>}
              {venue && <span>{venue}</span>}
              {location && <span>{location}</span>}
              {dateRange && <span>{dateRange}</span>}
            </div>
            <a
              href="#"
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
      {images.length > 0 && (
        <div className="px-[60px] max-md:px-[20px] pb-[120px] flex flex-col gap-[20px]">
          {hasEditorialLayout ? (
            <>
              {/* Row A: Full-width */}
              <img
                src={images[0].url}
                alt={images[0].altText}
                className={IMG}
              />

              {/* Row B: 2-col */}
              {images.length > 2 && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  <img
                    src={images[1].url}
                    alt={images[1].altText}
                    className={IMG}
                  />
                  <img
                    src={images[2].url}
                    alt={images[2].altText}
                    className={IMG}
                  />
                </div>
              )}

              {/* Row C: 2 small images (left) + poem part 1 (right) */}
              {images.length > 4 && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  <div className="grid grid-cols-2 gap-[20px]">
                    <img
                      src={images[3].url}
                      alt={images[3].altText}
                      className={IMG_SQ}
                    />
                    <img
                      src={images[4].url}
                      alt={images[4].altText}
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

              {/* Row D: poem part 2 (left) + large image (right) */}
              {bodyPart2 && images.length > 5 && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  <div className="flex items-start">
                    <MetaobjectText style={quoteStyle}>
                      {bodyPart2}
                    </MetaobjectText>
                  </div>
                  <img
                    src={images[5].url}
                    alt={images[5].altText}
                    className={IMG_SQ}
                  />
                </div>
              )}

              {/* Row E: 2 small images (left) + blank (right) */}
              {images.length > 7 && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  <div className="grid grid-cols-2 gap-[20px]">
                    <img
                      src={images[6].url}
                      alt={images[6].altText}
                      className={IMG_SQ}
                    />
                    <img
                      src={images[7].url}
                      alt={images[7].altText}
                      className={IMG_SQ}
                    />
                  </div>
                  <div />
                </div>
              )}

              {/* Row F: Full-width last image */}
              {images.length > 8 && (
                <img
                  src={images[images.length - 1].url}
                  alt={images[images.length - 1].altText}
                  className={IMG}
                />
              )}
            </>
          ) : (
            <>
              {/* Simple gallery: full-width first, then 2-col grid */}
              <img
                src={images[0].url}
                alt={images[0].altText}
                className={IMG}
              />
              {images.length > 1 && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                  {images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.altText}
                      className={IMG}
                    />
                  ))}
                </div>
              )}
              {body && (
                <MetaobjectText style={quoteStyle}>{body}</MetaobjectText>
              )}
            </>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !featuredImage && (
        <div className="px-[60px] max-md:px-[20px] pb-[120px]">
          <div className="w-full aspect-[16/9] bg-[#D2D2D2]" />
        </div>
      )}
    </div>
  );
}

const ART_EXHIBITION_QUERY = `#graphql
  query ArtExhibition($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      ...MetaobjectFields
    }
  }
  ${METAOBJECT_FIELDS_FRAGMENT}
` as const;
