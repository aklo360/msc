/**
 * Metaobject field extraction helpers.
 * Used by route loaders to extract typed data from Storefront API metaobject responses.
 *
 * Uses `any[]` for fields param to avoid fighting codegen's Maybe<> types.
 * The helpers do safe null checks internally.
 */

export interface MetaImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

/** Get a plain text field value */
export function getFieldValue(fields: any[], key: string): string {
  return fields.find((f: any) => f.key === key)?.value || '';
}

/** Get a single image reference */
export function getFieldImage(fields: any[], key: string): MetaImage | null {
  const field = fields.find((f: any) => f.key === key);
  const img = field?.reference?.image;
  if (!img?.url) return null;
  return {
    url: img.url,
    altText: img.altText || '',
    width: img.width ?? undefined,
    height: img.height ?? undefined,
  };
}

/** Get a list of image references */
export function getFieldImages(fields: any[], key: string): MetaImage[] {
  const field = fields.find((f: any) => f.key === key);
  const nodes = field?.references?.nodes || [];
  return nodes
    .filter((n: any) => n.image?.url)
    .map((n: any) => ({
      url: n.image!.url,
      altText: n.image!.altText || '',
      width: n.image!.width ?? undefined,
      height: n.image!.height ?? undefined,
    }));
}

/** Get a JSON field, parsed */
export function getFieldJson<T = unknown>(
  fields: any[],
  key: string,
): T | null {
  const val = fields.find((f: any) => f.key === key)?.value;
  if (!val) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

const MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Parse a text date like "Feb–Sep, 2025" or "Oct, 2025" or "2024"
 * into a numeric value for sorting (year * 100 + month).
 * Uses the LAST year and FIRST month found.
 */
function parseDateSortKey(dateStr: string): number {
  const years = dateStr.match(/\b(19|20)\d{2}\b/g);
  const year = years ? parseInt(years[years.length - 1], 10) : 0;
  const monthMatch = dateStr.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/);
  const month = monthMatch ? MONTH_MAP[monthMatch[1]] : 0;
  return year * 100 + month;
}

/** Sort metaobject nodes by a date text field, newest first */
export function sortByDateField(nodes: any[], fieldKey: string): any[] {
  return [...nodes].sort((a, b) => {
    const aVal = getFieldValue(a.fields, fieldKey);
    const bVal = getFieldValue(b.fields, fieldKey);
    return parseDateSortKey(bVal) - parseDateSortKey(aVal);
  });
}
