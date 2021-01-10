import express from 'express';
import { updateAllHostnames, updateSingleHostname } from './update';
import * as config from '../libs/config';
import process from 'process';

const PORT = Number(process.env.PORT || 7777);

const app = express();

app.use(express.json());

setInterval(() => {
	updateAllHostnames();
}, 1000 * 60 * 30);
updateAllHostnames();

app.post('/update-now', async (_req, res) => {
	console.log('Updating now...');
	if (!config.configFile) {
		console.log('Config file does not exist. Ignoring update.');
	} else {
		await updateAllHostnames();
	}
	res.status(200).send();
	return;
});

app.post('/update-now/:hostname', async (req, res) => {
	console.log('Updating now...');
	if (!config.configFile) {
		console.log('Config file does not exist. Ignoring update.');
	} else {
		const hostname = req.params.hostname as string;
		if (!hostname.endsWith(config.configFile.domainName)) {
			console.log('It seems the hostname does not end with the configurated domain name. Will not update.');
		} else {
			await updateSingleHostname(req.params.hostname);
		}
	}
	res.status(200).send();
	return;
});

app.post('/config/read', async (_req, res) => {
	console.log('Reading config file...');
	config.readConfigFile();
	res.status(200).send();
	return;
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} for commands...`);
});