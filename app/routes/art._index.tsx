import {useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/art._index';
import {SectionHero} from '~/components/SectionHero';
import {ArtMenu} from '~/components/ArtMenu';
import {GalleryCard} from '~/components/GalleryCard';
import {Link} from 'react-router';
import {getFieldValue, getFieldImage, sortByDateField} from '~/lib/metaobjects';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Art | Mr.StarCity'}];
};

const ACCENT_ART = '#FF9E70';

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(ART_EXHIBITIONS_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return {exhibitions: sortByDateField(metaobjects.nodes, 'date_range')};
}

export default function ArtIndex() {
  const {exhibitions} = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Art" accentColor={ACCENT_ART} videoSrc="/videos/art/page-bg.mp4" />

      {/* Art Menu / Filter Bar */}
      <ArtMenu
        accentColor={ACCENT_ART}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Gallery */}
      <div className="px-[60px] max-md:px-[20px] py-[30px] pb-[120px]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-x-[20px] gap-y-[60px]">
            {exhibitions.map((ex: any) => {
              const title = getFieldValue(ex.fields, 'title');
              const seriesTag = getFieldValue(ex.fields, 'series_tag');
              const image = getFieldImage(ex.fields, 'featured_image');
              return (
                <GalleryCard
                  key={ex.handle}
                  title={title}
                  seriesTag={seriesTag}
                  href={`/art/${ex.handle}`}
                  imageUrl={image?.url}
                />
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-[#D2D2D2]">
            {exhibitions.map((ex: any) => {
              const title = getFieldValue(ex.fields, 'title');
              const type = getFieldValue(ex.fields, 'type');
              const venue = getFieldValue(ex.fields, 'venue');
              const location = getFieldValue(ex.fields, 'location');
              const dateRange = getFieldValue(ex.fields, 'date_range');
              const seriesTag = getFieldValue(ex.fields, 'series_tag');
              return (
                <Link
                  key={ex.handle}
                  to={`/art/${ex.handle}`}
                  prefetch="intent"
                  className="group block py-[10px] text-black no-underline"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {/* Desktop: 6-column grid */}
                  <div
                    className="hidden lg:grid items-center justify-items-start gap-x-[20px]"
                    style={{
                      gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 160px',
                      fontSize: 'var(--text-copy-sm)',
                    }}
                  >
                    <span className="font-medium group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">
                      {title}
                    </span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{type}</span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{venue}</span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{location}</span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{dateRange}</span>
                    <span
                      className="bg-white rounded-[20px] px-[10px] py-[5px] whitespace-nowrap uppercase justify-self-end"
                      style={{fontSize: 'var(--text-nav-sm)', fontWeight: 500}}
                    >
                      {seriesTag}
                    </span>
                  </div>

                  {/* Mobile: stacked 2-line layout */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between gap-[10px]">
                      <span className="font-medium group-hover:font-bold transition-all duration-200 text-[16px] truncate min-w-0">
                        {title}
                      </span>
                      <span
                        className="bg-white rounded-[20px] px-[8px] py-[6px] whitespace-nowrap uppercase shrink-0"
                        style={{fontSize: '11px', fontWeight: 500}}
                      >
                        {seriesTag}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px] mt-[4px] text-[#7F7F7F] text-[13px]">
                      <span>{type}</span>
                      <span>&middot;</span>
                      <span>{venue}</span>
                      <span>&middot;</span>
                      <span>{dateRange}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const ART_EXHIBITIONS_QUERY = `#graphql
  query ArtExhibitions {
    metaobjects(type: "art_exhibition", first: 50, sortKey: "updated_at", reverse: true) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_FRAGMENT}
` as const;
