import { getMyIP } from '../libs/ip';
import { getMissingWhitelistItems, isWhitelisted, getDnsZone } from '../libs/config';
import { listDNS } from '../libs/netlify/list-dns';
import { createDNS } from '../libs/netlify/create-dns';
import { deleteDNSById } from '../libs/netlify/delete-dns';
import { log } from './logger';

export async function updateSingleHostname (hostname: string) {
	log(`Handling hostname '${hostname}':`, 1);

	log('Fetching my IP...', 2);
	const myIP = getMyIP();
	log(`My IPv6 is ${myIP}`, 1);
	const dnsZone = getDnsZone();
	const recordsList = await listDNS(dnsZone);
	const record = recordsList.find(record => record.hostname === hostname && record.type === 'AAAA');

	if (!record) {
		log('Record did not exist. Creating...', 2);
		await createDNS(myIP, dnsZone, hostname);
		log('Record created successfuly!', 2);
		log(`A record for '${hostname}' did not exist. It was created.`);
		return;
	}

	if (record.value === myIP) {
		log(`The record for '${hostname}' was already up to date.`);
		return;
	}

	log(`Record is outdated. Updating...`, 2);
	await deleteDNSById(getDnsZone(), record.id);
	await createDNS(myIP, dnsZone, hostname);
	log('Record updated successfuly!');
}

export async function updateAllHostnames () {
	log('Fetching my IP...', 2);
	const myIP = getMyIP();
	log(`My IPv6 is ${myIP}`, 1);
	const dnsZone = getDnsZone();
	const dnsList = await listDNS(dnsZone);

	/** determines which DNS records should be updated */
	const dnsToUpdate = dnsList.filter(record => {
		if (!isWhitelisted(record.hostname)) return false;
		if (record.value === myIP) {
			log(`\t'${record.hostname}' was already up to date.`);
			return false;
		}
		return true;
	});

	dnsToUpdate.forEach(async ({ hostname, id: recordId }) => {
		log(hostname + '\'s IP is incorrect. Updating...', 2);
		await deleteDNSById(getDnsZone(), recordId);
		await createDNS(myIP, dnsZone, hostname);
		log(`\t'${hostname}' was successfuly updated`);
	});

	const missingHostnames = getMissingWhitelistItems(dnsList.map(record => record.hostname));

	missingHostnames.forEach(async hostname => {
		log(`\t'${hostname}' was missing. Creating...`, 2);
		await createDNS(myIP, hostname, 'AAAA');
		log(`\t'${hostname}' was created successfuly`);
	});
}