import { netlifyFetch } from "../libs/netlify-fetch";
import { DNSRecord } from "../models/netlify";

export async function createDNS (ip: string, name: string) {
	const data = await netlifyFetch<DNSRecord>('dns_zones/sidharta_xyz/dns_records', {
		method: 'POST',
		body: {
			hostname: name,
			type: 'AAAA',
			value: ip,
		},
	});
	return data;
}