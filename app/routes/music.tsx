import type {Route} from './+types/music';
import {SectionHero} from '~/components/SectionHero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Music | Mr.StarCity'}];
};

const ACCENT_MUSIC = '#FFD770';

export default function Music() {
  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero title="Music" accentColor={ACCENT_MUSIC} />

      {/* Placeholder content */}
      <div className="px-[60px] max-md:px-[20px] py-[80px]">
        <div className="max-w-[794px] mx-auto text-center">
          <h2 className="font-[family-name:var(--font-body,_sans-serif)] text-[60px] max-md:text-[36px] font-normal leading-[1.1] tracking-[-2px] text-black mb-[30px]">
            Music
          </h2>
          <p className="font-[family-name:var(--font-body,_sans-serif)] text-[22px] font-normal leading-[1.2] text-[#7F7F7F] mb-[60px]">
            Music content coming soon
          </p>

          {/* Placeholder embed areas */}
          <div className="flex flex-col gap-[40px]">
            {/* Spotify placeholder */}
            <div className="w-full h-[352px] bg-[#D2D2D2] rounded-[10px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] font-medium uppercase text-[#7F7F7F]">
                Spotify Embed
              </span>
            </div>

            {/* YouTube placeholder */}
            <div className="w-full aspect-video bg-[#D2D2D2] rounded-[10px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] font-medium uppercase text-[#7F7F7F]">
                YouTube Embed
              </span>
            </div>

            {/* Playlists placeholder */}
            <div className="w-full h-[200px] bg-[#D2D2D2] rounded-[10px] flex items-center justify-center">
              <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] font-medium uppercase text-[#7F7F7F]">
                Playlists
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
