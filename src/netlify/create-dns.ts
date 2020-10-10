import { netlifyFetch } from "../libs/netlify-fetch";
import { DNSRecord, DNSRecordType } from "../models/netlify";

export async function createDNS (ip: string, hostname: string, type: DNSRecordType = 'AAAA') {
	const data = await netlifyFetch<DNSRecord>('dns_zones/sidharta_xyz/dns_records', {
		method: 'POST',
		body: {
			hostname,
			type,
			value: ip,
		},
	});
	return data!;
}