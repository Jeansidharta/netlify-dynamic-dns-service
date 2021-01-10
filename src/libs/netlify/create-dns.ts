import { netlifyFetch } from "../netlify-fetch";
import { DNSRecord, DNSRecordType } from "../../models/netlify";

export async function createDNS (ip: string, hostname: string, type: DNSRecordType = 'AAAA') {
	const body = {
		hostname,
		type,
		value: ip,
	}

	const data = await netlifyFetch<DNSRecord>('dns_zones/sidharta_xyz/dns_records', {
		method: 'POST',
		body,
	});
	return data!;
}