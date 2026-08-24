import {useState, type FormEvent} from 'react';
import {useFetcher} from 'react-router';
import PhoneInput, {
  type Country,
  type Value,
} from 'react-phone-number-input/input';
import {
  getCountries,
  getCountryCallingCode,
  isPossiblePhoneNumber,
} from 'libphonenumber-js/min';

const PHONE_ERROR = 'Enter a complete phone number for the selected country.';

/**
 * Email & SMS subscribe form module.
 * White card with email and international phone inputs on separate rows,
 * privacy text, and a subscribe button.
 * Figma: w-[523px], p-[30px], rounded-[10px], bg-white.
 */
export function SubscribeForm() {
  const fetcher = useFetcher<{success?: boolean; error?: string}>();
  const [country, setCountry] = useState<Country>('US');
  const [phone, setPhone] = useState<Value>();
  const [phoneError, setPhoneError] = useState<string>();
  const isSubmitting = fetcher.state !== 'idle';
  const success = fetcher.data?.success;
  const error = fetcher.data?.error;

  function handleCountryChange(nextCountry: Country) {
    setCountry(nextCountry);
    setPhone(undefined);
    setPhoneError(undefined);
  }

  function handlePhoneChange(value?: Value) {
    setPhone(value);
    setPhoneError(undefined);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (phone && !isPossiblePhoneNumber(phone)) {
      event.preventDefault();
      setPhoneError(PHONE_ERROR);
    }
  }

  if (success) {
    return (
      <div
        className="bg-white rounded-[10px] p-[30px] w-full"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: 1.2,
          color: 'var(--color-black)',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Thank you for subscribing.
      </div>
    );
  }

  return (
    <fetcher.Form
      method="post"
      action="/api/subscribe"
      onSubmit={handleSubmit}
      className="bg-white rounded-[10px] p-[30px] w-[45%] max-md:w-full flex flex-col gap-[40px]"
    >
      {/* Heading */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '22px',
          fontWeight: 500,
          lineHeight: 1.2,
          color: 'var(--color-black)',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Subscribe to Email &amp; SMS
      </p>

      {/* Inputs */}
      <div className="flex flex-col gap-[20px]">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="h-[60px] w-full px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#191919',
            fontFeatureSettings: "'salt' 1",
          }}
        />
        <div className="w-full min-w-0">
          <div
            className="flex h-[60px] overflow-hidden rounded-[5px] bg-[#DCDCDC] focus-within:ring-1 focus-within:ring-black"
            style={{fontFamily: 'var(--font-body)'}}
          >
            <select
              aria-label="Country calling code"
              autoComplete="country"
              value={country}
              onChange={(event) =>
                handleCountryChange(event.target.value as Country)
              }
              className="h-full w-[110px] shrink-0 border-0 border-r border-black/15 bg-transparent px-[12px] outline-none cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                color: '#191919',
              }}
            >
              {getCountries().map((optionCountry) => (
                <option key={optionCountry} value={optionCountry}>
                  {optionCountry} +{getCountryCallingCode(optionCountry)}
                </option>
              ))}
            </select>
            <PhoneInput
              country={country}
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone (optional)"
              autoComplete="tel-national"
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? 'subscribe-phone-error' : undefined}
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-[16px] outline-none"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#191919',
              }}
            />
            <input type="hidden" name="phone" value={phone ?? ''} />
          </div>
          {phoneError && (
            <p
              id="subscribe-phone-error"
              className="mt-[8px]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#F46060',
              }}
            >
              {phoneError}
            </p>
          )}
        </div>
      </div>

      {/* Privacy text + button */}
      <div className="flex flex-col gap-[20px]">
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--color-neutral-01)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          By submitting this form you agree to{' '}
          <strong style={{fontWeight: 500}}>MSC</strong>{' '}
          <a href="/policies/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </p>

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#F46060',
              fontFeatureSettings: "'salt' 1",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[60px] rounded-[100px] bg-[#EDEDED] cursor-pointer transition-colors duration-200 hover:bg-[#D2D2D2] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-black)',
            textTransform: 'uppercase',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
    </fetcher.Form>
  );
}
