import { workerAxiosInstance } from '../axios';
import * as config from '../../libs/config';
import { tryCreatingConfigFileWithUser } from '../user-create-config';

export async function update (yargs: any) {
	const hostname = yargs.hostname as string | undefined;

	if (!hostname) {
		console.log('Updating all records...');
		await workerAxiosInstance.post('/update-now');
		console.log('Hostnames updated successfuly');
		return;
	}

	if (!config.configFile) await tryCreatingConfigFileWithUser();

	if (!hostname.endsWith(config.configFile!.domainName)) {
		console.log(`The requested hostname does not end with the configured domain name '${config.configFile!.domainName}'. Will not continue operation.`);
		return;
	}

	if (!config.isWhitelisted(hostname)) {
		console.log(`The requested hostname is not in the 'to update' list. Will not continue operation.`);
		return;
	}

	console.log(`Updating ${hostname}...`);
	await workerAxiosInstance.post('/update-now/' + hostname);
	console.log(`${hostname} updated succesfuly!`);
}