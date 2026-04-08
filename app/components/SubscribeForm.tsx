import {useFetcher} from 'react-router';

/**
 * Email & SMS subscribe form module.
 * White card with two inputs side-by-side, privacy text, and subscribe button.
 * Figma: w-[523px], p-[30px], rounded-[10px], bg-white.
 */
export function SubscribeForm() {
  const fetcher = useFetcher<{success?: boolean; error?: string}>();
  const isSubmitting = fetcher.state !== 'idle';
  const success = fetcher.data?.success;
  const error = fetcher.data?.error;

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
      className="bg-white rounded-[10px] p-[30px] w-[40%] max-md:w-full flex flex-col gap-[40px]"
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

      {/* Inputs row */}
      <div className="flex gap-[20px] items-center max-md:flex-col">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="flex-1 min-w-0 h-[60px] px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none max-md:w-full"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#191919',
            fontFeatureSettings: "'salt' 1",
          }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone (optional)"
          className="flex-1 min-w-0 h-[60px] px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none max-md:w-full"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#191919',
            fontFeatureSettings: "'salt' 1",
          }}
        />
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
