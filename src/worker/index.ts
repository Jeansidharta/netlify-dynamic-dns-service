import express, { RequestHandler } from 'express';
import { updateAllHostnames, updateSingleHostname } from './update';
import * as config from '../libs/config';
import process from 'process';
import { getLogs, log, resetLogs } from './logger';

const PORT = Number(process.env.PORT || 7777);

const app = express();

app.use(express.json());

setInterval(() => {
	updateAllHostnames();
}, 1000 * 60 * 30);
updateAllHostnames();

function loggableHandler (handler: RequestHandler) {
	return (async (...args) => {
		try {
			const v = await handler(...args);
			return v;
		} catch (e) {
			console.log(e);
		}
	}) as typeof handler;
}

app.post('/update-now', loggableHandler(async (_req, res) => {
	resetLogs();
	log('Updating now...');
	if (!config.configFile) {
		log('Config file does not exist. Ignoring update.');
	} else {
		await updateAllHostnames();
	}
	res.status(200).send(getLogs().join('\n'));
	resetLogs();
	return;
}));

app.post('/update-now/:hostname', async (req, res) => {
	resetLogs();
	log('Updating now...');
	if (!config.configFile) {
		log('Config file does not exist. Ignoring update.');
	} else {
		const hostname = req.params.hostname as string;
		if (!hostname.endsWith(config.configFile.domainName)) {
			log('It seems the hostname does not end with the configurated domain name. Will not update.');
		} else {
			await updateSingleHostname(req.params.hostname);
		}
	}
	res.status(200).send(getLogs().join('\n'));
	resetLogs();
	return;
});

app.post('/config/read', async (_req, res) => {
	resetLogs();
	log('Reading config file...');
	config.readConfigFile();
	res.status(200).send(getLogs().join('\n'));
	resetLogs();
	return;
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} for commands...`);
});