import {useLoaderData} from 'react-router';
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

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(PROJECTS_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return {projects: sortByDateField(metaobjects.nodes, 'year')};
}

export default function ProjectsIndex() {
  const {projects} = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Projects" accentColor={ACCENT_PROJECTS} />

      {projects.map((proj: any) => {
        const title = getFieldValue(proj.fields, 'title');
        const category = getFieldValue(proj.fields, 'category');
        const collaborator = getFieldValue(proj.fields, 'collaborator');
        const location = getFieldValue(proj.fields, 'location');
        const year = getFieldValue(proj.fields, 'year');
        const seriesTag = getFieldValue(proj.fields, 'series_tag');
        const description = getFieldValue(proj.fields, 'description');
        const inquiryEmail = getFieldValue(proj.fields, 'inquiry_email');
        const links =
          getFieldJson<{label: string; url: string}[]>(proj.fields, 'links') ||
          [];
        const featuredImage = getFieldImage(proj.fields, 'featured_image');
        const images = getFieldImages(proj.fields, 'images');

        return (
          <div key={proj.handle}>
            {/* Text Module Header */}
            <div className="flex gap-[20px] max-md:flex-col px-[60px] max-md:px-[20px] py-[60px]">
              {/* Left column — title + tag/CTA */}
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
                  {title}
                </h2>
                <div className="flex gap-[10px] items-start flex-wrap">
                  {seriesTag && (
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
                      {seriesTag}
                    </span>
                  )}
                  {inquiryEmail && (
                    <a
                      href={`mailto:${inquiryEmail}?subject=Inquiry%20%E2%80%94%20${encodeURIComponent(title)}`}
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
                  )}
                </div>
              </div>

              {/* Right column — description + credits */}
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
                    {category && <span>{category}</span>}
                    {collaborator && <span>{collaborator}</span>}
                    {location && <span>{location}</span>}
                    {year && <span>{year}</span>}
                  </div>
                  {links.length > 0 && (
                    <div className="py-[20px] border-t border-black flex flex-wrap gap-[20px]">
                      {links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
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
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {(featuredImage || images.length > 0) && (
              <div className="px-[60px] max-md:px-[20px] pb-[20px]">
                {/* Featured image full-width */}
                {featuredImage && (
                  <div className="mb-[20px]">
                    <img
                      src={featuredImage.url}
                      alt={featuredImage.altText}
                      className="w-full rounded-[10px] object-cover"
                    />
                  </div>
                )}

                {/* Remaining images in 2-col grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[20px]">
                    {images.slice(featuredImage ? 1 : 0).map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={img.altText}
                        className="w-full rounded-[10px] object-cover"
                      />
                    ))}
                  </div>
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

      {/* Bottom spacer */}
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
