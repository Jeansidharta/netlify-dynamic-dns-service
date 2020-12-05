import * as config from '../../config';
import { workerAxiosInstance } from "../axios";
import { tryCreatingConfigFileWithUser } from "../user-create-config";
import { appendHostname } from "../append-hostname";

export async function add (yargs: any) {
	let hostname = await appendHostname(yargs.hostname);

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	config.addToWhitelist(hostname);

	await workerAxiosInstance.post('/config/read');
	console.log('Hostname added successfuly');
}