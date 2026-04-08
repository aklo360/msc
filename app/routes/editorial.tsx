import {useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/editorial';
import {SectionHero} from '~/components/SectionHero';
import {ArtMenu} from '~/components/ArtMenu';
import {GalleryCard} from '~/components/GalleryCard';
import {getFieldValue, sortByDateField} from '~/lib/metaobjects';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Editorial | Mr.StarCity'}];
};

const ACCENT_EDITORIAL = '#D073A5';

/** Article thumbnails crawled from og:image and saved locally */
const ARTICLE_THUMBNAILS: Record<string, string> = {
  'let-us-refuse-urban-art-signature-auction':
    '/images/editorial/ha-let-us-refuse.jpg',
  'mr-starcity-turns-his-dream-into-a-living-legacy-in-brooklyn':
    '/images/editorial/mr-starcity-brooklyn-legacy.jpg',
  'the-royal-court-loverboy-king-of-hearts':
    '/images/editorial/royal-court-nyc-parks.jpg',
  'mr-starcitys-when-we-bloom-exhibition-at-frevo-nyc':
    '/images/editorial/when-we-bloom-frevo.jpg',
  'art-and-fine-dining-collide':
    '/images/editorial/cultured-fine-dining.png',
  'david-mr-starcity-white-exhibits-at-frevo':
    '/images/editorial/seegreatart-frevo.jpg',
  'mr-starcity-unites-poetry-performance-and-painting':
    '/images/editorial/artcurrently-pit-la.jpg',
  'garden-of-love-the-pit-la':
    '/images/editorial/thepit-garden-of-love.webp',
  'multidisciplinary-artist-mr-starcity-on-authenticity':
    '/images/editorial/vogue-ph-authenticity.jpg',
  'on-art-spirituality-and-the-human-experience':
    '/images/editorial/esquire-ph-spirituality.png',
  'art-fair-philippines-2024-10-must-sees':
    '/images/editorial/gma-art-fair-ph.jpg',
  'must-see-works-at-art-fair-philippines-2024':
    '/images/editorial/artplus-must-see.jpg',
  '10-questions-with-david-mr-starcity-white':
    '/images/editorial/beyondthestreets-10q.webp',
  'mr-starcity-office-magazine':
    '/images/editorial/office-magazine.jpg',
  'david-mr-starcity-white-the-year-of-the-big-bless':
    '/images/editorial/juxtapoz-big-bless.jpg',
  'black-voices-black-microcosm':
    '/images/editorial/cfhill-black-microcosm.jpg',
  'new-years-in-chinatown-with-the-obamas':
    '/images/editorial/juxtapoz-chinatown-obamas.jpg',
  'gallery-review-fractured-the-long-road-back-to-insanity':
    '/images/editorial/artx-fractured.jpg',
};

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(
    EDITORIAL_QUERY,
    {cache: context.storefront.CacheShort()},
  );
  return {articles: sortByDateField(metaobjects.nodes, 'date')};
}

export default function Editorial() {
  const {articles} = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Editorial" accentColor={ACCENT_EDITORIAL} />

      {/* Filter Bar */}
      <ArtMenu
        accentColor={ACCENT_EDITORIAL}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterLabel="All Articles"
      />

      {/* Content */}
      <div className="px-[60px] max-md:px-[20px] py-[30px] pb-[120px]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-x-[20px] gap-y-[60px]">
            {articles.map((article: any) => {
              const title = getFieldValue(article.fields, 'title');
              const tag = getFieldValue(article.fields, 'tag');
              const externalUrl = getFieldValue(article.fields, 'external_url');
              const thumbnailUrl = ARTICLE_THUMBNAILS[article.handle];
              return (
                <GalleryCard
                  key={article.handle}
                  title={title}
                  seriesTag={tag}
                  href={externalUrl}
                  imageUrl={thumbnailUrl}
                  external
                />
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-[#D2D2D2]">
            {articles.map((article: any) => {
              const title = getFieldValue(article.fields, 'title');
              const source = getFieldValue(article.fields, 'source');
              const category = getFieldValue(article.fields, 'category');
              const date = getFieldValue(article.fields, 'date');
              const tag = getFieldValue(article.fields, 'tag');
              const externalUrl = getFieldValue(article.fields, 'external_url');
              return (
                <a
                  key={article.handle}
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-[10px] text-black no-underline"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {/* Desktop: 5-column grid */}
                  <div
                    className="hidden lg:grid items-center justify-items-start gap-x-[20px]"
                    style={{
                      gridTemplateColumns: '1.4fr 1fr 0.8fr 0.8fr 160px',
                      fontSize: 'var(--text-copy-sm)',
                    }}
                  >
                    <span className="font-medium group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">
                      {title}
                    </span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{source}</span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{category}</span>
                    <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{date}</span>
                    <span
                      className="bg-white rounded-[20px] p-[10px] whitespace-nowrap uppercase justify-self-end"
                      style={{fontSize: 'var(--text-nav-sm)', fontWeight: 500}}
                    >
                      {tag}
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
                        {tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px] mt-[4px] text-[#7F7F7F] text-[13px]">
                      <span>{source}</span>
                      <span>&middot;</span>
                      <span>{category}</span>
                      <span>&middot;</span>
                      <span>{date}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const EDITORIAL_QUERY = `#graphql
  query EditorialEntries {
    metaobjects(type: "editorial", first: 50, sortKey: "updated_at", reverse: true) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_FRAGMENT}
` as const;
