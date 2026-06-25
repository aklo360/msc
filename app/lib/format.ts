/** Format a Shopify MoneyV2 into "$200" / "$199.99" / "199.99 EUR". */
export function formatPrice(money?: {
  amount: string;
  currencyCode: string;
} | null): string {
  if (!money) return '';
  const num = parseFloat(money.amount);
  const value = Number.isInteger(num) ? String(num) : num.toFixed(2);
  return money.currencyCode === 'USD'
    ? `$${value}`
    : `${value} ${money.currencyCode}`;
}
