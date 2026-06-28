import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/**
 * Price display. `size` controls the type scale:
 * - 'lg'   product detail hero price (26px)
 * - 'md'   default / cart line (18px)
 * - 'sm'   compact (14px)
 */
export function ProductPrice({
  price,
  compareAtPrice,
  size = 'md',
  serif = false,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'lg' | 'md' | 'sm';
  /** Render in the Crimson Pro serif "voice" (used on the product detail page). */
  serif?: boolean;
}) {
  const fontSize =
    size === 'lg'
      ? 'var(--text-copy-lg)'
      : size === 'sm'
        ? 'var(--text-nav-sm)'
        : 'var(--text-copy-sm)';

  const base: React.CSSProperties = {
    fontFamily: serif ? 'var(--font-quote)' : 'var(--font-body)',
    fontSize,
    fontWeight: serif ? 300 : 500,
    lineHeight: 1.2,
    color: 'var(--color-black)',
    fontFeatureSettings: "'salt' 1",
  };

  return (
    <div className="flex items-center gap-[10px]" style={base}>
      {compareAtPrice ? (
        <>
          {price ? <Money data={price} /> : null}
          <s style={{opacity: 0.45, fontWeight: 400}}>
            <Money data={compareAtPrice} />
          </s>
        </>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
