import express, { RequestHandler } from 'express';
import { updateAllHostnames, updateSingleHostname } from './update';
import * as config from '../libs/config';
import process from 'process';
import { getLogs, log, resetLogs, setVerbosity } from './logger';

const PORT = Number(process.env.PORT || 7777);

const app = express();

app.use(express.json());

setInterval(() => {
	if (!config.configFile) {
		log('Config file does not exist. Ignoring automatic update.');
	} else {
		updateAllHostnames();
	}
}, 1000 * 60 * 30);
if (config.configFile) updateAllHostnames();

function loggableHandler (handler: RequestHandler) {
	return (async (req, res, ...args) => {
		const verbosityNumber = Number(req.query.verbosity || 0);
		if (isNaN(verbosityNumber) || !isFinite(verbosityNumber)) {
			res.status(400).send('Invalid verbosity number');
			return;
		}
		setVerbosity(verbosityNumber);
		try {
			resetLogs();
			const v = await handler(req, res, ...args);
			resetLogs();
			return v;
		} catch (e) {
			console.log(e);
		}
	}) as typeof handler;
}

app.post('/update-now', loggableHandler(async (_req, res) => {
	log('Updating now...', 2);
	if (!config.configFile) {
		log('Config file does not exist. Ignoring update.');
	} else {
		await updateAllHostnames();
	}
	res.status(200).send(getLogs().join('\n'));
	return;
}));

app.post('/update-now/:hostname', loggableHandler(async (req, res) => {
	log('Updating now...', 2);
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
	return;
}));

app.post('/config/read', loggableHandler(async (_req, res) => {
	log('Reading config file...', 2);
	config.readConfigFile();
	res.status(200).send(getLogs().join('\n'));
	return;
}));

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} for commands...`);
});