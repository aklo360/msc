import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component, used by both the /cart route (layout="page")
 * and the slide-out cart dialog (layout="aside").
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // useOptimisticCart reflects pending actions immediately for snappy UX.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = (cart?.totalQuantity ?? 0) > 0;
  const lines = cart?.lines?.nodes ?? [];

  if (!linesCount) {
    return (
      <div
        className={
          layout === 'aside'
            ? 'cart-main cart-main--aside'
            : 'cart-main cart-main--page'
        }
      >
        <CartEmpty layout={layout} />
      </div>
    );
  }

  if (layout === 'aside') {
    return (
      <div className="cart-main cart-main--aside">
        <ul className="cart-lines" aria-labelledby="cart-lines">
          {lines.map((line) => (
            <CartLineItem key={line.id} line={line} layout="aside" />
          ))}
        </ul>
        {cartHasItems && (
          <div className="cart-summary--aside">
            <CartSummary cart={cart} layout="aside" />
          </div>
        )}
      </div>
    );
  }

  // Full page
  return (
    <div className="cart-main cart-main--page grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[60px] max-lg:gap-[40px] items-start">
      <ul className="cart-lines" aria-labelledby="cart-lines">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} layout="page" />
        ))}
      </ul>
      {cartHasItems && (
        <div className="lg:sticky lg:top-[120px]">
          <div className="bg-white rounded-[20px] p-[30px]">
            <CartSummary cart={cart} layout="page" />
          </div>
        </div>
      )}
    </div>
  );
}

function CartEmpty({layout}: {layout: CartMainProps['layout']}) {
  const {close} = useAside();
  return (
    <div
      className={`flex flex-col items-start gap-[24px] ${
        layout === 'aside' ? 'px-[30px] py-[40px]' : 'py-[40px]'
      }`}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-copy-md)',
          fontWeight: 400,
          lineHeight: 1.3,
          color: 'var(--color-black)',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Your cart is empty.
      </p>
      <Link
        to="/shop"
        onClick={close}
        prefetch="viewport"
        className="inline-flex items-center justify-center h-[56px] px-[32px] rounded-[100px] uppercase transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-nav)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-white)',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Shop now
      </Link>
    </div>
  );
}
