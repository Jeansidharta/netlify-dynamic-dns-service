import { netlifyFetch } from "../netlify-fetch";
import { DNSRecord, DNSRecordType } from "../../models/netlify";

export async function createDNS (ip: string, dnsZone: string, hostname: string, type: DNSRecordType = 'AAAA') {
	const body = {
		hostname,
		type,
		value: ip,
	}

	const data = await netlifyFetch<DNSRecord>(`dns_zones/${dnsZone}/dns_records`, {
		method: 'POST',
		body,
	});
	return data!;
}