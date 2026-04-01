import {useState} from 'react';

/**
 * Email & SMS subscribe form module.
 * White card with two inputs side-by-side, privacy text, and pill subscribe button.
 * Figma: w-[523px], p-[30px], rounded-[10px], bg-white.
 */
export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      // TODO: wire up to Shopify/Klaviyo/etc.
    }
  }

  if (submitted) {
    return (
      <div
        className="bg-white rounded-[10px] p-[30px] w-[523px] max-md:w-full"
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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[10px] p-[30px] w-[523px] max-md:w-full flex flex-col gap-[40px]"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="flex-1 h-[60px] px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none max-md:w-full"
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="flex-1 h-[60px] px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none max-md:w-full"
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
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.2,
            color: 'var(--color-black)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          By submitting this form you agree to{' '}
          <strong style={{fontWeight: 500}}>MSC</strong>{' '}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
        <button
          type="submit"
          className="w-full h-[60px] rounded-[100px] bg-white border border-black cursor-pointer transition-colors duration-200 hover:bg-black hover:text-white"
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
          Subscribe
        </button>
      </div>
    </form>
  );
}
