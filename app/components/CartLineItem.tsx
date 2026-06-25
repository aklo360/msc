import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

const META_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 400,
  lineHeight: 1.3,
  color: 'var(--color-neutral-01)',
  fontFeatureSettings: "'salt' 1",
};

/**
 * A single line item in the cart — product image, title, options, price,
 * quantity stepper, and remove control. Used in both the slide-out and the
 * full cart page.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const imageSize = layout === 'page' ? 120 : 96;

  // Hide auto-generated "Title: Default Title" pseudo-option.
  const realOptions = selectedOptions.filter(
    (o) => !(o.name === 'Title' && o.value === 'Default Title'),
  );

  return (
    <li
      key={id}
      className="flex gap-[16px] py-[20px]"
      style={{borderBottom: '1px solid var(--color-neutral-02)'}}
    >
      <Link
        prefetch="intent"
        to={lineItemUrl}
        onClick={() => layout === 'aside' && close()}
        className="shrink-0 overflow-hidden rounded-[10px] bg-white"
        style={{width: imageSize, height: imageSize}}
      >
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={imageSize}
            width={imageSize}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
        <div className="flex items-start justify-between gap-[12px]">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="min-w-0"
          >
            <p
              className="truncate"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-copy-sm)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'var(--color-black)',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              {product.title}
            </p>
          </Link>
          <div className="shrink-0">
            <ProductPrice price={line?.cost?.totalAmount} size="sm" />
          </div>
        </div>

        {realOptions.length > 0 && (
          <p className="truncate" style={META_STYLE}>
            {realOptions.map((o) => `${o.name}: ${o.value}`).join('  /  ')}
          </p>
        )}

        <div className="mt-auto pt-[8px]">
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/**
 * Quantity stepper + remove control for a cart line, wired to the cart action.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  const stepBtn =
    'flex items-center justify-center w-[32px] h-[32px] text-[18px] leading-none bg-transparent border-0 cursor-pointer transition-opacity hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-between gap-[12px]">
      <div
        className="inline-flex items-center rounded-[100px]"
        style={{border: '1px solid var(--color-neutral-02)'}}
      >
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className={stepBtn}
          >
            &#8722;
          </button>
        </CartLineUpdateButton>
        <span
          className="w-[28px] text-center"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-nav-sm)',
            fontWeight: 500,
            fontFeatureSettings: "'salt' 1",
          }}
        >
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className={stepBtn}
          >
            &#43;
          </button>
        </CartLineUpdateButton>
      </div>

      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="bg-transparent border-0 cursor-pointer uppercase transition-opacity hover:opacity-60 disabled:opacity-40"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-nav-sm)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: 'var(--color-neutral-01)',
          textDecoration: 'underline',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
