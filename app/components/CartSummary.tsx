import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-copy-sm)',
  fontWeight: 400,
  lineHeight: 1.2,
  color: 'var(--color-black)',
  fontFeatureSettings: "'salt' 1",
};

const SMALL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 400,
  lineHeight: 1.3,
  color: 'var(--color-neutral-01)',
  fontFeatureSettings: "'salt' 1",
};

// Serif "voice" note (taxes/shipping line) — matches the art-page descriptive tone.
const NOTE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-quote)',
  fontSize: '18px',
  fontWeight: 300,
  lineHeight: 1.3,
  color: 'var(--color-neutral-01)',
  fontFeatureSettings: "'salt' 1",
};

// Soft filled input matching the site's subscribe form (rounded-5, #DCDCDC).
const INPUT_CLASS =
  'flex-1 min-w-0 h-[48px] px-[16px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none';
const INPUT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 400,
  color: '#191919',
  fontFeatureSettings: "'salt' 1",
};

// Understated underlined text link (the site's link language) — not a hard pill.
const APPLY_BTN_CLASS =
  'shrink-0 bg-transparent border-0 cursor-pointer uppercase underline transition-opacity hover:opacity-60 disabled:opacity-50';
const APPLY_BTN_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 800,
  letterSpacing: '0.02em',
  color: 'var(--color-black)',
  fontFeatureSettings: "'salt' 1",
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div aria-labelledby="cart-summary" className="flex flex-col gap-[20px]">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span style={LABEL_STYLE}>Subtotal</span>
        <span style={{...LABEL_STYLE, fontWeight: 500}}>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />

      <p style={NOTE_STYLE}>Taxes and shipping calculated at checkout.</p>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="flex items-center justify-center h-[60px] rounded-[100px] uppercase transition-colors duration-200"
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
      Checkout
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Existing discount with remove */}
      {codes.length > 0 && (
        <UpdateDiscountForm>
          <div className="flex items-center justify-between gap-[12px]">
            <span style={{...SMALL_STYLE, color: 'var(--color-black)'}}>
              Discount: <strong>{codes.join(', ')}</strong>
            </span>
            <button
              type="submit"
              className="bg-transparent border-0 cursor-pointer underline"
              style={SMALL_STYLE}
            >
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      )}

      {/* Apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-[10px]">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
          <button type="submit" className={APPLY_BTN_CLASS} style={APPLY_BTN_STYLE}>
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="flex flex-col gap-[10px]">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="flex flex-col gap-[6px]">
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center justify-between gap-[12px]">
                <span style={{...SMALL_STYLE, color: 'var(--color-black)'}}>
                  Gift card ***{giftCard.lastCharacters} (
                  <Money data={giftCard.amountUsed} />)
                </span>
                <button
                  type="submit"
                  className="bg-transparent border-0 cursor-pointer underline"
                  style={SMALL_STYLE}
                >
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex items-center gap-[10px]">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className={APPLY_BTN_CLASS}
            style={APPLY_BTN_STYLE}
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey="gift-card-add"
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
