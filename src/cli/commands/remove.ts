import { workerAxiosInstance } from "../axios";
import * as config from '../../libs/config';
import { tryCreatingConfigFileWithUser } from "../user-create-config";
import { appendHostname } from "../append-hostname";
import { deleteDNSByHostname } from "../../libs/netlify/delete-dns";

export async function remove (yargs: any) {
	let hostname = await appendHostname(yargs.hostname);

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	try {
		await config.removeFromWhitelist(hostname);
	} catch (e) {
		console.log('Hostname not found.');
		return;
	}

	try {
		await deleteDNSByHostname(config.getDnsZone(), hostname);
	} catch (e) {
		console.log("Failed to delete record on Netlify. Error was:", e.message);
	}

	const { data } = await workerAxiosInstance.post('/config/read');
	console.log(data);
	console.log('Hostname removed successfuly');
}