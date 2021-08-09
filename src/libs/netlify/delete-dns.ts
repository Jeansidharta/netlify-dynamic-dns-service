import { netlifyFetch } from "../netlify-fetch";
import { listDNS } from "./list-dns";

/** If response is undefined, then no errors occurred. Otherwise, there were errors. */
type Response = undefined | {
	/** The HTTP status code */
   code: number,

	/** The HTTP status code message */
   message: string,
}

export async function deleteDNSById (dnsZone: string, dnsId: string) {
	const data = await netlifyFetch<Response>(`dns_zones/${dnsZone}/dns_records/${dnsId}`, {
		method: 'DELETE',
	});
	return data;
}

export async function deleteDNSByHostname (dnsZone: string, hostname: string) {
	const recordsList = await listDNS(dnsZone);

	const record = recordsList.find(record => record.hostname === hostname);

	if (!record) throw new Error("Record not found on Netlify");

	const data = await netlifyFetch<Response>(`dns_zones/${dnsZone}/dns_records/${record.id}`, {
		method: 'DELETE',
	});
	return data;
}