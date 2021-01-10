import * as config from '../../libs/config';
import { workerAxiosInstance } from "../axios";
import { tryCreatingConfigFileWithUser } from "../user-create-config";
import { appendHostname } from "../append-hostname";

export async function add (yargs: any) {
	let hostname = await appendHostname(yargs.hostname);

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	config.addToWhitelist(hostname);

	const { data } = await workerAxiosInstance.post('/config/read');
	console.log(data);
	console.log('Hostname added successfuly');
}