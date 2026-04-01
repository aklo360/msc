import {useState} from 'react';
import type {Route} from './+types/art._index';
import {SectionHero} from '~/components/SectionHero';
import {ArtMenu} from '~/components/ArtMenu';
import {GalleryCard} from '~/components/GalleryCard';
import {Link} from 'react-router';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Art | Mr.StarCity'}];
};

const ACCENT_ART = '#FF9E70';

const EXHIBITIONS: Array<{
  title: string;
  type?: string;
  place?: string;
  location?: string;
  date?: string;
  seriesTag?: string;
  href: string;
}> = [
  {title: 'When We Bloom', type: 'Solo Exhibition', place: 'FREVO NYC', location: 'New York, NY', date: 'Feb\u2013Sep, 2025', seriesTag: 'Solo', href: '/art/when-we-bloom'},
  {title: 'Garden of Love', type: 'Solo Exhibition', place: 'The Pit', location: 'Los Angeles, CA', date: 'Jun\u2013Jul, 2024', seriesTag: 'Solo', href: '/art/garden-of-love'},
  {title: 'One Petal At A Time', type: 'Solo Presentation', place: 'Art Fair Philippines', location: 'Makati City, Philippines', date: 'Feb, 2024', seriesTag: 'Solo', href: '/art/one-petal-at-a-time'},
  {title: '10 Years', type: 'Group Show', place: 'Wilding Cran Gallery', location: 'Los Angeles, CA', date: 'Jan\u2013Mar, 2024', seriesTag: 'Group', href: '/art/10-years'},
  {title: 'Sounds of Blackness', type: 'Group Show', place: 'Metropolitan Museum of Manila', location: 'Taguig City, Philippines', date: 'Mar\u2013Jun, 2023', seriesTag: 'Group', href: '/art/sounds-of-blackness'},
  {title: 'I Love Me Some Life', type: 'Solo Exhibition', place: 'Tiger Gallery', location: 'London, UK', date: 'Oct\u2013Nov, 2022', seriesTag: 'Solo', href: '/art/i-love-me-some-life'},
  {title: 'Before There Was Life There Were People I Never Met', type: 'Solo Exhibition', place: 'Salon 94', location: 'New York, NY', date: 'Mar, 2022', seriesTag: 'Solo', href: '/art/before-there-was-life'},
  {title: 'Rise', type: 'Group Show', place: 'NBB Gallery', location: 'Berlin, Germany', date: 'Sep\u2013Oct, 2022', seriesTag: 'Group', href: '/art/rise'},
  {title: 'Collage/Assemblage', type: 'Group Show', place: 'Eric Firestone Gallery', location: 'East Hampton, NY', date: 'Jul\u2013Aug, 2022', seriesTag: 'Group', href: '/art/collage-assemblage'},
  {title: 'Selfish Too', type: 'Group Show', place: 'ChaShaMa', location: 'New York, NY', date: 'Nov, 2021\u2013Jan, 2022', seriesTag: 'Group', href: '/art/selfish-too'},
  {title: 'Black Excellence, Black Elegance', type: 'Group Show', place: 'Ross-Sutton Gallery', location: 'Miami, FL', date: 'Nov\u2013Dec, 2021', seriesTag: 'Group', href: '/art/black-excellence'},
  {title: 'WOPART Fair', type: 'Group Presentation', place: 'Kutlesa Gallery', location: 'Lugano, Switzerland', date: 'Nov, 2021', seriesTag: 'Group', href: '/art/wopart-fair'},
  {title: 'The Loneliest Sport', type: 'Group Show', place: 'Spazio Amanita', location: 'New York, NY', date: 'Oct\u2013Nov, 2021', seriesTag: 'Group', href: '/art/the-loneliest-sport'},
  {title: 'Beyond the Streets on Paper', type: 'Group Show', place: 'Southampton Arts Center', location: 'Southampton, NY', date: 'Jul\u2013Aug, 2021', seriesTag: 'Group', href: '/art/beyond-the-streets'},
  {title: 'Shape of An Image', type: 'Group Show', place: 'WOAW Gallery', location: 'Hong Kong', date: 'May\u2013Jun, 2021', seriesTag: 'Group', href: '/art/shape-of-an-image'},
  {title: 'Fairyland', type: 'Group Show', place: 'Mindy Solomon Gallery', location: 'Miami, FL', date: 'Apr\u2013May, 2021', seriesTag: 'Group', href: '/art/fairyland'},
  {title: 'LOVERBOY: Moonlit Roses and Heartache', type: 'Solo Exhibition', place: 'Kantor Gallery', location: 'Los Angeles, CA', date: 'Aug\u2013Sep, 2020', seriesTag: 'Solo', href: '/art/moonlit-roses'},
  {title: 'Afterparty', type: 'Solo Presentation', place: 'iv Gallery @ Spring Break Art Fair', location: 'Los Angeles, CA', date: 'Feb, 2020', seriesTag: 'Solo', href: '/art/afterparty'},
  {title: 'Black Voices: Friend of My Mind', type: 'Group Show', place: 'Ross-Sutton Gallery', location: 'New York, NY', date: 'Dec, 2020\u2013Mar, 2021', seriesTag: 'Group', href: '/art/black-voices-friend'},
  {title: 'How \u2018Bout Them Apples', type: 'Group Show', place: 'Ross+Kramer Gallery', location: 'New York, NY', date: 'Sep\u2013Oct, 2020', seriesTag: 'Group', href: '/art/how-bout-them-apples'},
  {title: 'Black Voices, Black Microcosm', type: 'Group Show', place: 'CFHILL', location: 'Stockholm, Sweden', date: 'Apr\u2013May, 2020', seriesTag: 'Group', href: '/art/black-microcosm'},
  {title: 'Fractured and The Long Road Back to Insanity', type: 'Solo Exhibition', place: 'iv Gallery', location: 'Los Angeles, CA', date: 'Aug\u2013Oct, 2019', seriesTag: 'Solo', href: '/art/fractured'},
];

export default function ArtIndex() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Art" accentColor={ACCENT_ART} />

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
            {EXHIBITIONS.map((artwork) => (
              <GalleryCard
                key={artwork.href}
                title={artwork.title}
                seriesTag={artwork.seriesTag}
                href={artwork.href}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#D2D2D2]">
            {EXHIBITIONS.map((artwork) => (
              <Link
                key={artwork.href}
                to={artwork.href}
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
                    {artwork.title}
                  </span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{artwork.type || ''}</span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{artwork.place || ''}</span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{artwork.location || ''}</span>
                  <span className="group-hover:font-bold transition-all duration-200 truncate min-w-0 max-w-full">{artwork.date || ''}</span>
                  <span
                    className="bg-white rounded-[20px] p-[10px] whitespace-nowrap uppercase justify-self-end"
                    style={{fontSize: 'var(--text-nav-sm)', fontWeight: 500}}
                  >
                    {artwork.seriesTag || ''}
                  </span>
                </div>

                {/* Mobile: stacked 2-line layout */}
                <div className="lg:hidden">
                  <div className="flex items-center justify-between gap-[10px]">
                    <span className="font-medium group-hover:font-bold transition-all duration-200 text-[16px] truncate min-w-0">
                      {artwork.title}
                    </span>
                    <span
                      className="bg-white rounded-[20px] px-[8px] py-[6px] whitespace-nowrap uppercase shrink-0"
                      style={{fontSize: '11px', fontWeight: 500}}
                    >
                      {artwork.seriesTag || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-[6px] mt-[4px] text-[#7F7F7F] text-[13px]">
                    <span>{artwork.type}</span>
                    <span>&middot;</span>
                    <span>{artwork.place}</span>
                    <span>&middot;</span>
                    <span>{artwork.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
