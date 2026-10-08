type CustomerAccountEnvironment = {
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
  SHOP_ID?: string;
};

export function isCustomerAccountConfigured(
  env: CustomerAccountEnvironment,
): boolean {
  return Boolean(
    env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?.trim() && env.SHOP_ID?.trim(),
  );
}
