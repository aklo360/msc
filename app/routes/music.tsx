import {useLoaderData} from 'react-router';
import type {Route} from './+types/music';
import {MetaobjectText} from '~/components/MetaobjectText';
import {SectionHero} from '~/components/SectionHero';
import {getFieldValue} from '~/lib/metaobjects';
import {METAOBJECT_FIELDS_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Music | Mr.StarCity'}];
};

const ACCENT_MUSIC = '#FFD770';

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
      <SectionHero title="Music" accentColor={ACCENT_MUSIC} videoSrc="/videos/music/page-bg.mp4" />

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
                    letterSpacing: '0',
                    color: 'var(--color-black)',
                    fontFeatureSettings: "'salt' 1",
                    marginBottom: '20px',
                  }}
                >
                  {title}
                </h3>
                {description && (
                  <MetaobjectText
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
                  </MetaobjectText>
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
        /* Empty state */
        <div className="px-[60px] max-md:px-[20px] py-[80px]">
          <div className="max-w-[794px] mx-auto text-center">
            <h2 className="font-[family-name:var(--font-body,_sans-serif)] text-[60px] max-md:text-[36px] font-normal leading-[1.1] text-black mb-[30px]">
              Music
            </h2>
            <p className="font-[family-name:var(--font-body,_sans-serif)] text-[22px] font-normal leading-[1.2] text-[#7F7F7F] mb-[60px]">
              Music content coming soon
            </p>
            <div className="flex flex-col gap-[40px]">
              <div className="w-full h-[352px] bg-[#D2D2D2] rounded-[10px] flex items-center justify-center">
                <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] font-medium uppercase text-[#7F7F7F]">
                  Spotify Embed
                </span>
              </div>
              <div className="w-full aspect-video bg-[#D2D2D2] rounded-[10px] flex items-center justify-center">
                <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] font-medium uppercase text-[#7F7F7F]">
                  YouTube Embed
                </span>
              </div>
            </div>
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
