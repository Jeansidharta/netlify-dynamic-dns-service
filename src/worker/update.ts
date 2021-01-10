import { getMyIP } from '../libs/ip';
import { getMissingWhitelistItems, isWhitelisted } from '../libs/config';
import { listDNS } from '../libs/netlify/list-dns';
import { createDNS } from '../libs/netlify/create-dns';
import { deleteDNS } from '../libs/netlify/delete-dns';

export async function updateSingleHostname (hostname: string) {
	console.log(`Handling hostname '${hostname}':`);

	console.log('Fetching my IP...');
	const myIP = getMyIP();
	console.log(`My IPv6 is ${myIP}`);
	const recordsList = await listDNS();
	const record = recordsList.find(record => record.hostname === hostname && record.type === 'AAAA');

	if (!record) {
		console.log('Record did not exist. Creating...');
		await createDNS(myIP, hostname);
		console.log('Record created successfuly!');
		return;
	}

	if (record.value === myIP) {
		console.log('Record is up to date.');
		return;
	}

	console.log('Record is outdated. Updating...');
	await deleteDNS(record.id);
	await createDNS(myIP, hostname);
	console.log('Record updated successfuly!');
}

export async function updateAllHostnames () {
	console.log('Fetching my IP...');
	const myIP = getMyIP();
	console.log(`My IPv6 is ${myIP}`);
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
		await createDNS(myIP, hostname, 'AAAA');
		console.log(hostname + ' was created successfuly');
	});
}