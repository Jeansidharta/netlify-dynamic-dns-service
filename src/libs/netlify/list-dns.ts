import { netlifyFetch } from "../netlify-fetch";
import { DNSRecord } from "../../models/netlify";

export async function listDNS (dnsZone: string) {
	const data = await netlifyFetch<DNSRecord[]>(`dns_zones/${dnsZone}/dns_records`);
	return data!;
}