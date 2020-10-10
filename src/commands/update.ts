import { isIPv6 } from 'net';

import { getMyIPV6 } from '../ipv6';
import { getMissingWhitelistItems, isWhitelisted } from '../config';
import { listDNS } from '../netlify/list-dns';
import { createDNS } from '../netlify/create-dns';
import { deleteDNS } from '../netlify/delete-dns';

export async function command () {
	console.log('Checking for DNS updates...');
	const myIPV6 = await getMyIPV6();
	if (!myIPV6) throw new Error('IPV6 is empty');
	if (!isIPv6(myIPV6)) throw new Error(`Invalid IPV6: ${myIPV6}`);

	console.log('My IPV6 is ' + myIPV6);
	const dnsList = await listDNS();

	dnsList.forEach(async record => {
		const { value: recordIP, hostname, id: recordId } = record;

		// only work on whitelisted items
		if (!isWhitelisted(hostname)) return;

		if (recordIP === myIPV6) {
			console.log(hostname + '\'s IP is up to date.');
			return;
		}
		console.log(hostname + '\'s IP is incorrect. Updating...');
		await deleteDNS(recordId);
		await createDNS(myIPV6, hostname);
		console.log(hostname + ' was successfuly updated');
	});

	const missingHostnames = getMissingWhitelistItems(dnsList.map(record => record.hostname));

	missingHostnames.forEach(async item => {
		console.log(item + ' was missing. Creating...');
		await createDNS(myIPV6, item);
		console.log(item + ' was created successfuly');
	});
}