import { getMyIP } from '../ip';
import { getMissingWhitelistItems, isWhitelisted } from '../config';
import { listDNS } from '../netlify/list-dns';
import { createDNS } from '../netlify/create-dns';
import { deleteDNS } from '../netlify/delete-dns';

export async function command (IPType?: 'IPV4' | 'IPV6') {
	console.log('Fetching my IP...');
	const myIP = await getMyIP(IPType);
	console.log(`My ${IPType || 'IP'} is ${myIP}`);
	const dnsList = await listDNS();

	/** determines which DNS records should be updated */
	const dnsToUpdate = dnsList.filter(record => {
		if (!isWhitelisted(record.hostname)) return false;
		if (record.value === myIP) {
			console.log(record.hostname + '\'s IP is up to date.');
			return false;
		}
		return true;
	});

	dnsToUpdate.forEach(async ({ hostname, id: recordId }) => {
		console.log(hostname + '\'s IP is incorrect. Updating...');
		await deleteDNS(recordId);
		await createDNS(myIP, hostname);
		console.log(hostname + ' was successfuly updated');
	});

	const missingHostnames = getMissingWhitelistItems(dnsList.map(record => record.hostname));

	missingHostnames.forEach(async hostname => {
		console.log(hostname + ' was missing. Creating...');
		const type = IPType === 'IPV6' ? 'AAAA' : 'A';
		await createDNS(myIP, hostname, type);
		console.log(hostname + ' was created successfuly');
	});
}