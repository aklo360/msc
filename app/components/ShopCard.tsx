import {Link} from 'react-router';

export type ShopCardProps = {
  title: string;
  price: string;
  seriesTag?: string;
  imageUrl?: string;
  imageUrls?: string[];
  href: string;
};

/**
 * Product card for the MSC Shop grid.
 * Image with aspect-[912/607], white bg, rounded-[10px], object-contain.
 * Info row below: product name + price + optional series tag (14px).
 */
export function ShopCard({
  title,
  price,
  seriesTag,
  imageUrl,
  imageUrls,
  href,
}: ShopCardProps) {
  const images = Array.from(new Set([...(imageUrls || []), imageUrl].filter(Boolean) as string[]));

  return (
    <Link to={href} className="group flex flex-col gap-[20px]">
      {/* Image container */}
      <div className="overflow-hidden rounded-[10px] bg-white p-[8px]">
        {images.length > 1 ? (
          <div className="grid aspect-[912/607] grid-cols-[2fr_1fr] gap-[8px] transition-transform duration-300 group-hover:scale-[1.01]">
            <img
              src={images[0]}
              alt={title}
              className="h-full w-full rounded-[8px] object-contain"
            />
            <div
              className={
                images.length === 2
                  ? 'grid grid-rows-1 gap-[8px]'
                  : 'grid grid-rows-2 gap-[8px]'
              }
            >
              {images.slice(1, 3).map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`${title} view ${index + 2}`}
                  className="h-full w-full rounded-[8px] object-contain"
                />
              ))}
            </div>
          </div>
        ) : images[0] ? (
          <div className="aspect-[912/607] transition-transform duration-300 group-hover:scale-[1.02]">
            <img
              src={images[0]}
              alt={title}
              className="h-full w-full rounded-[8px] object-contain"
            />
          </div>
        ) : (
          <div className="w-full aspect-[912/607] bg-white rounded-[8px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
            <div className="w-[60%] h-[60%] bg-[#EDEDED] rounded-[10px]" />
          </div>
        )}
      </div>

      {/* Info row */}
      <div className="flex items-center h-[30px] gap-[20px]">
        <span
          className="flex-1"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-copy-md)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-black)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          {title}
        </span>
        <span
          className="w-[100px] text-right"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-copy-md)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: 'var(--color-black)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          {price}
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
              fontFeatureSettings: "'salt' 1",
            }}
          >
            {seriesTag}
          </span>
        )}
      </div>
    </Link>
  );
}
