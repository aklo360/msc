import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 700,
  lineHeight: 1.2,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  color: 'var(--color-black)',
  fontFeatureSettings: "'salt' 1",
};

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const available = Boolean(selectedVariant?.availableForSale);

  return (
    <div className="flex flex-col gap-[30px]">
      {productOptions.map((option) => {
        // Skip options that only have a single value — nothing to choose.
        if (option.optionValues.length === 1) return null;

        return (
          <div className="flex flex-col gap-[14px]" key={option.name}>
            <span style={LABEL_STYLE}>{option.name}</span>
            <div className="flex flex-wrap gap-[10px]">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available: valueAvailable,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const hasSwatch = Boolean(swatch?.color || swatch?.image);

                const commonProps = {
                  selected,
                  available: valueAvailable,
                  hasSwatch,
                  swatch,
                  name,
                };

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <OptionChip {...commonProps} />
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                    className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <OptionChip {...commonProps} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity + Add to cart */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[14px]">
          <span style={LABEL_STYLE}>Quantity</span>
          <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
        </div>

        <AddToCartButton
          disabled={!available}
          onClick={() => open('cart')}
          className="w-full h-[60px] rounded-[100px] cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-nav)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'salt' 1",
            backgroundColor: available
              ? 'var(--color-black)'
              : 'var(--color-neutral-02)',
            color: available ? 'var(--color-white)' : 'var(--color-neutral-01)',
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {available ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function OptionChip({
  name,
  selected,
  available,
  hasSwatch,
  swatch,
}: {
  name: string;
  selected: boolean;
  available: boolean;
  hasSwatch: boolean;
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
}) {
  if (hasSwatch) {
    const image = swatch?.image?.previewImage?.url;
    const color = swatch?.color;
    return (
      <span
        aria-label={name}
        title={name}
        className="block rounded-full overflow-hidden"
        style={{
          width: 36,
          height: 36,
          backgroundColor: color || 'transparent',
          boxShadow: selected
            ? '0 0 0 2px var(--color-white), 0 0 0 4px var(--color-black)'
            : '0 0 0 1px var(--color-neutral-02)',
          opacity: available ? 1 : 0.35,
        }}
      >
        {image && (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        )}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-[100px] px-[18px] h-[44px] min-w-[44px] whitespace-nowrap uppercase transition-colors duration-150"
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-nav-sm)',
        fontWeight: 500,
        lineHeight: 1,
        fontFeatureSettings: "'salt' 1",
        border: '1px solid',
        borderColor: selected
          ? 'var(--color-black)'
          : 'var(--color-neutral-02)',
        backgroundColor: selected ? 'var(--color-black)' : 'transparent',
        color: selected ? 'var(--color-white)' : 'var(--color-black)',
        opacity: available ? 1 : 0.35,
        textDecoration: available ? 'none' : 'line-through',
      }}
    >
      {name}
    </span>
  );
}

function QuantityStepper({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (n: number) => void;
}) {
  const btn =
    'flex items-center justify-center w-[44px] h-[44px] text-[22px] leading-none select-none cursor-pointer bg-transparent border-0 transition-opacity hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed';
  return (
    <div
      className="inline-flex items-center rounded-[100px] w-fit"
      style={{border: '1px solid var(--color-neutral-02)'}}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={btn}
        disabled={quantity <= 1}
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        &#8722;
      </button>
      <span
        className="w-[40px] text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-copy-sm)',
          fontWeight: 500,
          fontFeatureSettings: "'salt' 1",
        }}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={btn}
        onClick={() => setQuantity(quantity + 1)}
      >
        &#43;
      </button>
    </div>
  );
}
