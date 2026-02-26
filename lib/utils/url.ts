/**
 * Get the site URL without trailing slash (server-side)
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 * Get the site URL without trailing slash (client-side)
 */
export function getClientSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  return url.endsWith('/') ? url.slice(0, -1) : url
}
