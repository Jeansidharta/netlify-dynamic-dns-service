import { whitelist } from '../whitelist.json';

/**
 * Checks if hostname should be kept up to date in Netlify's DNS records.
 */
export function isWhitelisted (hostname: string) {
	return whitelist.findIndex(item => item === hostname) >= 0;
}

/**
 * given the hostnames list (possibly comming from netlify's current DNS records),
 * determines which of the hostnames that should be syncronized were not in the list
 */
export function getMissingWhitelistItems (hostnames: string[]) {
	return whitelist.filter(whitelistItem =>
		!hostnames.some(hostname => hostname === whitelistItem)
	);
}