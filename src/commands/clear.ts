import { isWhitelisted } from '../config';
import { listDNS } from '../netlify/list-dns';
import { deleteDNS } from '../netlify/delete-dns';

export async function command () {
	console.log('clearing every whitelisted domain...');
	const dnsList = await listDNS();
	dnsList.forEach(async record => {
		const { hostname, id: recordId } = record;

		// only work on whitelisted items
		if (!isWhitelisted(hostname)) return;

		console.log('Deleting ' + hostname + '...');
		await deleteDNS(recordId);
		console.log(hostname + ' was successfuly deleted');
	});
}