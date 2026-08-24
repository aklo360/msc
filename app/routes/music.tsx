import {useLoaderData} from 'react-router';
import type {Route} from './+types/music';
import {SectionHero} from '~/components/SectionHero';
import {getFieldValue} from '~/lib/metaobjects';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Music | Mr.StarCity'}];
};

const ACCENT_MUSIC = '#FFD770';
const FEATURED_TRACK_EMBED_URL =
  'https://open.spotify.com/embed/track/3A1XlvapLyRNBBSaxWC99v?utm_source=generator&si=501ad2b133bb42cb';

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(MUSIC_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return {entries: metaobjects.nodes};
}

export default function Music() {
  const {entries} = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Music" accentColor={ACCENT_MUSIC} />

      {entries.length > 0 ? (
        <div className="px-[60px] max-md:px-[20px] py-[80px] flex flex-col gap-[40px]">
          {entries.map((entry: any) => {
            const title = getFieldValue(entry.fields, 'title');
            const type = getFieldValue(entry.fields, 'type');
            const embedUrl = getFieldValue(entry.fields, 'embed_url');
            const description = getFieldValue(entry.fields, 'description');

            return (
              <div key={entry.handle} className="max-w-[794px] mx-auto w-full">
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '32px',
                    fontWeight: 400,
                    lineHeight: 1.1,
                    letterSpacing: '-2px',
                    color: 'var(--color-black)',
                    fontFeatureSettings: "'salt' 1",
                    marginBottom: '20px',
                  }}
                >
                  {title}
                </h3>
                {description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: '#7F7F7F',
                      marginBottom: '20px',
                    }}
                  >
                    {description}
                  </p>
                )}
                {embedUrl && type?.toLowerCase().includes('spotify') && (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-[10px]"
                    title={title}
                  />
                )}
                {embedUrl && type?.toLowerCase().includes('youtube') && (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    className="aspect-video rounded-[10px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={title}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-[60px] max-md:px-[20px] py-[80px]">
          <div className="max-w-[794px] mx-auto w-full">
            <iframe
              data-testid="embed-iframe"
              src={FEATURED_TRACK_EMBED_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="block w-full border-0"
              style={{borderRadius: '12px'}}
              title="Featured Mr.StarCity track on Spotify"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const MUSIC_QUERY = `#graphql
  query MusicEntries {
    metaobjects(type: "music_entry", first: 50, sortKey: "updated_at", reverse: true) {
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${METAOBJECT_FIELDS_FRAGMENT}
` as const;
