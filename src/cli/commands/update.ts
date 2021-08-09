import { workerAxiosInstance } from '../axios';
import * as config from '../../libs/config';
import { tryCreatingConfigFileWithUser } from '../user-create-config';
import { appendHostname } from '../append-hostname';

export async function update (yargs: any) {
	const hostname = yargs.hostname as string | undefined;

	if (!hostname) await updateAllHostnames();
	else await updateSingleHostname(hostname);
}

async function updateAllHostnames () {
	console.log('Updating all records...');
	const { data } = await workerAxiosInstance.post('/update-now');
	console.log(data);
	console.log('Hostnames updated successfuly');
	return;
}

async function updateSingleHostname (rawHostname: string) {
	if (!config.configFile) await tryCreatingConfigFileWithUser();
	let hostname = await appendHostname(rawHostname);

	if (!config.isWhitelisted(hostname)) {
		console.log(`The requested hostname is not in the 'to update' list. Will not continue operation.`);
		return;
	}

	console.log(`Updating ${hostname}...`);
	const { data } = await workerAxiosInstance.post('/update-now/' + hostname);
	console.log(data);
	console.log(`${hostname} updated succesfuly!`);
}