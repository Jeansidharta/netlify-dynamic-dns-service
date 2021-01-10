import express from 'express';
import { update } from './update';
import * as config from '../libs/config';

const app = express();

app.use(express.json());

setInterval(() => {
	update('IPV6');
}, 1000 * 60 * 30);
update('IPV6');

app.post('/update-now', async (_req, res) => {
	console.log('Updating now...');
	if (!config.configFile) {
		console.log('Config file does not exist. Ignoring update.');
	} else {
		await update('IPV6');
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

app.listen(7777, () => {
	console.log('Listening on port 7777 for commands...');
});