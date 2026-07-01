import {useEffect} from 'react';
import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

const ACCENT_ACCOUNT = '#F46060';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  // Theme header/footer to the account accent.
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--active-accent',
      ACCENT_ACCOUNT,
    );
    return () => {
      document.documentElement.style.removeProperty('--active-accent');
    };
  }, []);

  const heading = customer?.firstName
    ? `Welcome, ${customer.firstName}`
    : 'Your account';

  return (
    <div className="bg-[var(--color-neutral-03)] min-h-screen">
      <div className="mx-auto max-w-[var(--max-width)] px-[60px] max-md:px-[20px] pt-[40px] pb-[120px] max-md:pb-[80px]">
        <h1
          className="mb-[30px]"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(40px, 4.5vw, 60px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '0',
            color: 'var(--color-black)',
            fontFeatureSettings: "'salt' 1",
          }}
        >
          {heading}
        </h1>

        <AccountMenu />

        <div className="mt-[50px]">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

const TAB_BASE =
  'inline-flex items-center justify-center h-[44px] px-[22px] rounded-[100px] uppercase whitespace-nowrap transition-colors duration-150';
const TAB_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-nav-sm)',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0.02em',
  fontFeatureSettings: "'salt' 1",
};

function AccountMenu() {
  const tab = ({isActive}: {isActive: boolean}): React.CSSProperties => ({
    ...TAB_STYLE,
    border: '1px solid',
    borderColor: isActive ? 'var(--color-black)' : 'var(--color-neutral-02)',
    backgroundColor: isActive ? 'var(--color-black)' : 'transparent',
    color: isActive ? 'var(--color-white)' : 'var(--color-black)',
  });

  return (
    <nav role="navigation" className="flex items-center gap-[10px] flex-wrap">
      <NavLink
        to="/account/orders"
        prefetch="intent"
        className={TAB_BASE}
        style={tab}
      >
        Orders
      </NavLink>
      <NavLink
        to="/account/profile"
        prefetch="intent"
        className={TAB_BASE}
        style={tab}
      >
        Profile
      </NavLink>
      <NavLink
        to="/account/addresses"
        prefetch="intent"
        className={TAB_BASE}
        style={tab}
      >
        Addresses
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout" className="ml-auto max-md:ml-0">
      <button
        type="submit"
        className="bg-transparent border-0 cursor-pointer uppercase underline transition-opacity hover:opacity-60"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-nav-sm)',
          fontWeight: 800,
          letterSpacing: '0.02em',
          color: 'var(--color-black)',
          fontFeatureSettings: "'salt' 1",
        }}
      >
        Sign out
      </button>
    </Form>
  );
}
