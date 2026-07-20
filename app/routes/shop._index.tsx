import {useLoaderData} from 'react-router';
import type {Route} from './+types/shop._index';
import {SectionHero} from '~/components/SectionHero';
import {ShopCard} from '~/components/ShopCard';

export const meta: Route.MetaFunction = () => {
  return [{title: 'MSC Shop | Mr.StarCity'}];
};

const ACCENT_SHOP = '#73B9D0';

export async function loader({context}: Route.LoaderArgs) {
  // Driven by the "Home page" collection (handle: frontpage). A product only
  // appears in the shop once it is added to this collection.
  const {collection} = await context.storefront.query(SHOP_COLLECTION_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return {products: collection?.products?.nodes ?? []};
}

/** Format a Shopify MoneyV2 into "$200" / "$199.99". */
function formatPrice(money: {amount: string; currencyCode: string}): string {
  const num = parseFloat(money.amount);
  const value = Number.isInteger(num) ? String(num) : num.toFixed(2);
  return money.currencyCode === 'USD'
    ? `$${value}`
    : `${value} ${money.currencyCode}`;
}

/**
 * Shop menu bar: "SHOP: ALL" left, "SORT: RECOMMENDED" right.
 * Same height/padding as ArtMenu (100px tall, px-60, py-30).
 */
function ShopMenu() {
  return (
    <div className="flex items-center justify-between h-[100px] px-[60px] max-md:px-[20px] py-[30px]">
      <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] max-md:text-[14px] font-medium leading-[1.2] uppercase text-black">
        Shop: All
      </span>
      <span className="font-[family-name:var(--font-body,_sans-serif)] text-[18px] max-md:text-[14px] font-medium leading-[1.2] uppercase text-black">
        Sort: Recommended
      </span>
    </div>
  );
}

export default function ShopIndex() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero */}
      <SectionHero
        title="MSC Shop"
        accentColor={ACCENT_SHOP}
        videoSrc="/videos/shop/page-bg.mp4"
      />

      {/* Shop Menu */}
      <ShopMenu />

      {/* Product Grid */}
      <div className="px-[60px] max-md:px-[20px] py-[30px] pb-[120px]">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-[20px] gap-y-[60px]">
            {products.map((product: any) => (
              <ShopCard
                key={product.id}
                title={product.title}
                price={formatPrice(product.priceRange.minVariantPrice)}
                seriesTag={product.tags?.[0] || undefined}
                imageUrl={product.featuredImage?.url}
                imageUrls={product.images?.nodes
                  ?.map((image: any) => image.url)
                  .filter(Boolean)}
                href={`/products/${product.handle}`}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-center text-[#7F7F7F]"
            style={{fontFamily: 'var(--font-body)', fontSize: '18px'}}
          >
            Products coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

const SHOP_COLLECTION_QUERY = `#graphql
  query ShopHomePageCollection {
    collection(handle: "frontpage") {
      products(first: 100) {
        nodes {
          id
          title
          handle
          tags
          featuredImage {
            url
            altText
          }
          images(first: 4) {
            nodes {
              url
              altText
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;
