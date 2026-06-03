import {Link} from 'react-router';

export type GalleryCardProps = {
  title: string;
  seriesTag?: string;
  imageUrl?: string;
  href: string;
  /** Use <a target="_blank"> instead of <Link> for external URLs */
  external?: boolean;
};

/**
 * Gallery card for the Art section grid.
 * Image with aspect-[15/10], rounded-[10px], hover scale effect.
 * Title row below: artwork title left (22px Medium), series tag pill right (14px).
 */
export function GalleryCard({title, seriesTag, imageUrl, href, external}: GalleryCardProps) {
  const Wrapper = external ? 'a' : Link;
  const wrapperProps = external
    ? {href, target: '_blank' as const, rel: 'noopener noreferrer'}
    : {to: href};
  return (
    <Wrapper {...(wrapperProps as any)} className="group flex flex-col gap-[20px]">
      {/* Image container */}
      <div className="overflow-hidden rounded-[10px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-[15/10] object-cover rounded-[10px] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full aspect-[15/10] bg-[#D2D2D2] rounded-[10px] transition-transform duration-300 group-hover:scale-[1.02]" />
        )}
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-copy-md)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-black)',
          }}
        >
          {title}
        </span>
        {seriesTag && (
          <span
            className="bg-white rounded-[20px] px-[10px] py-[5px] whitespace-nowrap uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-nav-sm)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--color-black)',
            }}
          >
            {seriesTag}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
