import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-nav-sm)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: 'var(--color-black)',
    fontFeatureSettings: "'salt' 1",
  };
  const inputClass =
    'w-full h-[60px] px-[20px] rounded-[5px] bg-[#DCDCDC] border-0 outline-none';
  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-copy-sm)',
    fontWeight: 400,
    color: '#191919',
    fontFeatureSettings: "'salt' 1",
  };

  return (
    <div className="max-w-[560px]">
      <div className="bg-white rounded-[20px] p-[30px] max-md:p-[24px] flex flex-col gap-[30px]">
        <span style={labelStyle}>Personal information</span>

        <Form method="PUT" className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="firstName" style={{...labelStyle, fontWeight: 500}}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label htmlFor="lastName" style={{...labelStyle, fontWeight: 500}}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {action?.error && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-nav-sm)',
                fontWeight: 400,
                color: '#F46060',
                fontFeatureSettings: "'salt' 1",
              }}
            >
              {action.error}
            </p>
          )}

          <button
            type="submit"
            disabled={state !== 'idle'}
            className="w-full h-[60px] rounded-[100px] cursor-pointer uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {state !== 'idle' ? 'Updating…' : 'Update'}
          </button>
        </Form>
      </div>
    </div>
  );
}
