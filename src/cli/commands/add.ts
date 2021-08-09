import * as config from '../../libs/config';
import { workerAxiosInstance } from "../axios";
import { tryCreatingConfigFileWithUser } from "../user-create-config";
import { appendHostname } from "../append-hostname";
import { createDNS } from '../../libs/netlify/create-dns';
import { getMyIP } from '../../libs/ip';

export async function add (yargs: any) {
	let hostname = await appendHostname(yargs.hostname);

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	config.addToWhitelist(hostname);

	let myIp: string;
	try {
		myIp = getMyIP()
	} catch (e) {
		console.log('Failed to determine my IPv6');
		return;
	}

	try {
		await createDNS(myIp, config.getDnsZone(), hostname);
	} catch (e) {
		console.log('Failed to create record on Netlify. The error was:', e.message);
	}

	const { data } = await workerAxiosInstance.post('/config/read');
	console.log(data);
	console.log('Hostname added successfuly');
}