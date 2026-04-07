import type {Route} from './+types/api.subscribe';

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();

  if (!email) {
    return Response.json({error: 'Email is required.'}, {status: 400});
  }

  const password = crypto.randomUUID();

  try {
    const {customerCreate} = await context.storefront.mutate(
      CUSTOMER_CREATE_MUTATION,
      {
        variables: {
          input: {
            email,
            phone: phone || undefined,
            password,
            acceptsMarketing: true,
          },
        },
      },
    );

    const errors = customerCreate?.customerUserErrors;
    if (errors?.length) {
      // Already subscribed — treat as success
      if (errors.some((e: {code: string}) => e.code === 'TAKEN')) {
        return Response.json({success: true});
      }
      return Response.json({error: errors[0].message}, {status: 400});
    }

    return Response.json({success: true});
  } catch {
    return Response.json(
      {error: 'Something went wrong. Please try again.'},
      {status: 500},
    );
  }
}
