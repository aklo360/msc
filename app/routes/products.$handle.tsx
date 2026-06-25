import {useEffect} from 'react';
import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {RelatedProducts} from '~/components/RelatedProducts';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

const ACCENT_SHOP = '#73B9D0';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.title ?? 'Shop'} | Mr.StarCity`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args, criticalData.product.id);

  return {...criticalData, ...deferredData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(
  {context}: Route.LoaderArgs,
  productId: string,
) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {productId},
    })
    .catch((error) => {
      // Recommendations are non-critical — never let them break the page.
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Product() {
  const {product, recommendedProducts} = useLoaderData<typeof loader>();

  // Theme the header/footer accent to the Shop blue while on a product page.
  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', ACCENT_SHOP);
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const tag = product.tags?.[0];
  const images = product.images?.nodes ?? [];

  return (
    <div className="bg-[var(--color-neutral-03)] min-h-screen">
      <div className="mx-auto max-w-[var(--max-width)] px-[60px] max-md:px-[20px] pt-[40px] pb-[120px] max-md:pb-[80px]">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          prefetch="intent"
          className="inline-block mb-[30px] uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-nav-sm)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'var(--color-neutral-01)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          &#8592;&nbsp;&nbsp;MSC Shop
        </Link>

        {/* Detail grid */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[60px] max-lg:gap-[40px] items-start">
          <ProductGallery
            images={images}
            selectedImageId={selectedVariant?.image?.id}
            title={title}
          />

          <div className="flex flex-col gap-[24px] lg:sticky lg:top-[120px]">
            {(tag || vendor) && (
              <div className="flex items-center gap-[10px]">
                {tag && (
                  <span
                    className="bg-white rounded-[20px] px-[12px] py-[6px] uppercase whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-nav-sm)',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: 'var(--color-black)',
                      fontFeatureSettings: "'salt' 1",
                    }}
                  >
                    {tag}
                  </span>
                )}
              </div>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: '-1.5px',
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
                margin: 0,
              }}
            >
              {title}
            </h1>

            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
              size="lg"
            />

            <div className="mt-[6px]">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            {descriptionHtml && (
              <div className="mt-[10px] pt-[30px] border-t border-[var(--color-neutral-02)]">
                <span
                  className="block mb-[16px] uppercase"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-nav-sm)',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: 'var(--color-black)',
                    fontFeatureSettings: "'salt' 1",
                  }}
                >
                  Details
                </span>
                <div
                  className="prose-msc"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            )}
          </div>
        </div>

        <RelatedProducts products={recommendedProducts} />
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 12) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      tags
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;
