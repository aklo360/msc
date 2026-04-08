import * as path from 'path';
import * as fs from 'fs';

/** Generate a URL-safe handle from a title */
export function toHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Parse art folder name: "YEAR_Title_Venue" */
export function parseArtFolder(folderName: string): {
  year: string;
  title: string;
  venue: string;
} {
  const parts = folderName.split('_');
  const year = parts[0] || '';
  const title = parts.slice(1, -1).join('_') || parts[1] || '';
  const venue = parts[parts.length - 1] || '';
  return {year, title, venue};
}

/** Get all image files from a directory, sorted alphabetically */
export function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const validExts = new Set(['.jpg', '.jpeg', '.png', '.webp']);
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      if (!validExts.has(ext)) return false;
      if (f.startsWith('.')) return false;
      if (f.toLowerCase().startsWith('screencapture-')) return false;
      const size = fs.statSync(path.join(dir, f)).size;
      if (size > 20 * 1024 * 1024) return false; // skip >20MB
      return true;
    })
    .sort()
    .map((f) => path.join(dir, f));
}

/** Sleep for ms */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Log with timestamp */
export function log(msg: string): void {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}
