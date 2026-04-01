import {Link} from 'react-router';

export type ShopCardProps = {
  title: string;
  price: string;
  seriesTag?: string;
  imageUrl?: string;
  href: string;
};

/**
 * Product card for the MSC Shop grid.
 * Image with aspect-[912/607], white bg, rounded-[10px], object-contain.
 * Info row below: product name + price + optional series tag (14px).
 */
export function ShopCard({title, price, seriesTag, imageUrl, href}: ShopCardProps) {
  return (
    <Link to={href} className="group flex flex-col gap-[20px]">
      {/* Image container */}
      <div className="overflow-hidden rounded-[10px] bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-[912/607] object-contain rounded-[10px] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full aspect-[912/607] bg-white rounded-[10px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
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
            className="bg-white rounded-[20px] p-[10px] whitespace-nowrap uppercase"
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
