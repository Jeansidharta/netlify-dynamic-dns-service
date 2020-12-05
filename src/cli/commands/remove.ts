import { workerAxiosInstance } from "../axios";
import * as config from '../../config';
import { tryCreatingConfigFileWithUser } from "../user-create-config";
import { appendHostname } from "../append-hostname";

export async function remove (yargs: any) {
	let hostname = await appendHostname(yargs.hostname);

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	try {
		await config.removeFromWhitelist(hostname);
	} catch (e) {
		console.log('Hostname not found.');
		return;
	}

	await workerAxiosInstance.post('/config/read');
	console.log('Hostname removed successfuly');
}