import {useState} from 'react';
import type {Route} from './+types/editorial';
import {SectionHero} from '~/components/SectionHero';
import {ArtMenu} from '~/components/ArtMenu';
import {GalleryCard} from '~/components/GalleryCard';
import {Link} from 'react-router';
/* Editorial press links are external URLs — rendered as <a> tags */

export const meta: Route.MetaFunction = () => {
  return [{title: 'Editorial | Mr.StarCity'}];
};

const ACCENT_EDITORIAL = '#D073A5';

const PRESS_ARTICLES: Array<{
  title: string;
  source?: string;
  category?: string;
  date?: string;
  tag?: string;
  href: string;
}> = [
  {title: 'Let Us Refuse — Urban Art Signature® Auction', source: 'Heritage Auctions', category: 'Auction', date: 'Oct, 2025', tag: 'Auction', href: 'https://fineart.ha.com/itm/paintings/mr-starcity-b-1979-let-us-refuse-acrylic-on-canvas-60-x-48-inches-1524-x-1219-cm-signed-titled-dated-and/a/8236-66024.s?ic4=GalleryView-Thumbnail-071515'},
  {title: 'Mr. StarCity Turns His Dream into a Living Legacy in Brooklyn', source: 'stupidDOPE', category: 'Feature', date: 'Nov, 2025', tag: 'Feature', href: 'https://stupiddope.com/2025/11/david-mr-starcity-white-the-royal-court-brooklyn-mural/'},
  {title: 'The Royal Court: LoverBoy \u2014 King of Hearts', source: 'NYC Parks', category: 'Public Art', date: 'Jul, 2025', tag: 'Public Art', href: 'https://www.nycgovparks.org/art-and-antiquities/public-art/the-royal-court-loverboy-king-of-hearts'},
  {title: 'Mr. StarCity\'s "When We Bloom" Exhibition at FREVO NYC', source: 'stupidDOPE', category: 'Feature', date: 'Feb, 2025', tag: 'Feature', href: 'https://stupiddope.com/2025/02/mr-starcity-when-we-bloom-exhibition/'},
  {title: 'Art and Fine Dining Collide at the Opening of David \u201CMr. StarCity\u201D White\u2019s New Show', source: 'Cultured Magazine', category: 'Feature', date: 'Feb, 2025', tag: 'Feature', href: 'https://www.culturedmag.com/article/2025/02/19/art-and-fine-dining-collide-at-the-opening-of-david-mr-starcity-whites-new-show'},
  {title: 'David \u201CMr. StarCity\u201D White Exhibits at Michelin-Starred NYC Restaurant Frevo', source: 'See Great Art', category: 'Feature', date: 'Feb, 2025', tag: 'Feature', href: 'https://www.seegreatart.art/david-mr-starcity-white-frevo-nyc/'},
  {title: 'Mr. StarCity Unites Poetry, Performance, and Painting at The Pit Los Angeles', source: 'Art Currently', category: 'Feature', date: 'Jul, 2024', tag: 'Feature', href: 'https://artcurrently.com/mr-starcity-unites-poetry-performance-and-painting-at-the-pit-los-angeles/'},
  {title: 'David \u201CMr.StarCity\u201D White: Garden of Love @ The Pit LA', source: 'Juxtapoz', category: 'Review', date: 'Jun, 2024', tag: 'Review', href: 'https://www.juxtapoz.com/news/painting/david-mrstarcity-white-garden-of-love-the-pit-la/'},
  {title: 'Garden of Love', source: 'The Pit LA', category: 'Press Release', date: 'Jun, 2024', tag: 'Gallery', href: 'https://www.thepitla.com/exhibitions/david-mr-starcity-white-garden-of-love'},
  {title: 'Multidisciplinary Artist Mr. StarCity On Authenticity Across Mediums', source: 'Vogue Philippines', category: 'Profile', date: 'Feb, 2024', tag: 'Profile', href: 'https://vogue.ph/lifestyle/art/mr-starcity-authenticity-across-mediums-art-fair-philippines-2024/'},
  {title: 'On Art, Spirituality, and the Human Experience: A Conversation With Mr. StarCity', source: 'Esquire Philippines', category: 'Interview', date: 'Feb, 2024', tag: 'Interview', href: 'https://www.esquiremag.ph/culture/books-and-art/mr-starcity-art-fair-philippines-2024-a00007-20240213-lfrm'},
  {title: 'Art Fair Philippines 2024: 10 must-sees', source: 'GMA News', category: 'Listing', date: 'Feb, 2024', tag: 'Listing', href: 'https://www.gmanetwork.com/news/lifestyle/artandculture/898205/art-fair-philippines-2024-10-must-sees/story/'},
  {title: 'Must-See Works at Art Fair Philippines 2024', source: 'Art+ Magazine', category: 'Listing', date: 'Feb, 2024', tag: 'Listing', href: 'https://artplus.ph/features/must-see-artworks-at-art-fair-philippines-2024/'},
  {title: '10 Questions with David \u201CMr. StarCity\u201D White', source: 'Beyond The Streets', category: 'Interview', date: 'Aug, 2021', tag: 'Interview', href: 'https://beyondthestreets.com/blogs/beyond-the-streets/10-questions-with-david-mr-starcity-white'},
  {title: 'Mr. StarCity', source: 'Office Magazine', category: 'Profile', date: '2021', tag: 'Profile', href: 'https://officemagazine.net/mr-starcity'},
  {title: 'New Year\u2019s in Chinatown with the Obamas!', source: 'Juxtapoz', category: 'Feature', date: 'Feb, 2021', tag: 'Feature', href: 'https://www.juxtapoz.com/news/studio-time/new-years-in-chinatown-with-the-obamas/'},
  {title: 'David \u201CMr. StarCity\u201D White: The Year of the Big Bless', source: 'Juxtapoz', category: 'Feature', date: 'Dec, 2020', tag: 'Feature', href: 'https://www.juxtapoz.com/news/painting/david-mr-starcity-white-the-year-of-the-big-bless/'},
  {title: 'BLACK VOICES / BLACK MICROCOSM', source: 'CFHILL', category: 'Exhibition', date: 'Apr, 2020', tag: 'Gallery', href: 'https://cfhill.com/exhibition/black-voices-black-microcosm/'},
  {title: 'Interview: David \u201CMr. StarCity\u201D White', source: 'CFHILL', category: 'Interview', date: 'Apr, 2020', tag: 'Interview', href: 'https://cfhill.com/interview-david-mr-starcity-white/'},
  {title: 'Gallery Review: Fractured, The Long Road Back to Insanity', source: 'ArtX', category: 'Review', date: 'Sep, 2019', tag: 'Review', href: 'https://artx.net/mediapost/gallery-review-fractured-the-long-road-back-to-insanity-david-mr-starcity-white/'},
];

export default function Editorial() {
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
            {PRESS_ARTICLES.map((article) => (
              <GalleryCard
                key={article.title}
                title={article.title}
                seriesTag={article.tag}
                href={article.href}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#D2D2D2]">
            {PRESS_ARTICLES.map((article) => (
              <a
                key={article.title}
                href={article.href}
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
                    {article.title}
                  </span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{article.source || ''}</span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{article.category || ''}</span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{article.date || ''}</span>
                  <span
                    className="bg-white rounded-[20px] p-[10px] whitespace-nowrap uppercase justify-self-end"
                    style={{fontSize: 'var(--text-nav-sm)', fontWeight: 500}}
                  >
                    {article.tag || ''}
                  </span>
                </div>

                {/* Mobile: stacked 2-line layout */}
                <div className="lg:hidden">
                  <div className="flex items-center justify-between gap-[10px]">
                    <span className="font-medium group-hover:font-bold transition-all duration-200 text-[16px] truncate min-w-0">
                      {article.title}
                    </span>
                    <span
                      className="bg-white rounded-[20px] px-[8px] py-[6px] whitespace-nowrap uppercase shrink-0"
                      style={{fontSize: '11px', fontWeight: 500}}
                    >
                      {article.tag || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-[6px] mt-[4px] text-[#7F7F7F] text-[13px]">
                    <span>{article.source}</span>
                    <span>&middot;</span>
                    <span>{article.category}</span>
                    <span>&middot;</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
