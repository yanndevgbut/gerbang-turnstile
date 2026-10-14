export function getRailwayUrl(): string | null {
  let url = process.env.RAILWAY_API_URL?.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}
