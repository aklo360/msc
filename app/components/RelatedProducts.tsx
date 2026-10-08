import {Suspense} from 'react';
import {Await} from 'react-router';
import {ShopCard} from '~/components/ShopCard';
import {formatPrice} from '~/lib/format';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

type RecommendedProduct = NonNullable<
  RecommendedProductsQuery['productRecommendations']
>[number];

/**
 * "You may also like" — branded shop-card grid below the product detail.
 * Driven by Shopify product recommendations (deferred so it never blocks the PDP).
 */
export function RelatedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={products}>
        {(result) => {
          const items = (result?.productRecommendations ?? []).slice(0, 4);
          if (items.length === 0) return null;

          return (
            <section className="mt-[120px] max-md:mt-[80px]">
              <h2
                className="mb-[40px]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '0',
                  color: 'var(--color-black)',
                  fontFeatureSettings: "'salt' 1",
                }}
              >
                You may also like
              </h2>
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[20px] gap-y-[60px]">
                {items.map((product: RecommendedProduct) => (
                  <ShopCard
                    key={product.id}
                    title={product.title}
                    price={formatPrice(product.priceRange.minVariantPrice)}
                    seriesTag={product.tags?.[0] || undefined}
                    imageUrl={product.featuredImage?.url}
                    href={`/products/${product.handle}`}
                  />
                ))}
              </div>
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}
