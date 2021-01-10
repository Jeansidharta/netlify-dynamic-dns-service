import { configFile } from "../../libs/config";

export async function list () {
	if (!configFile) {
		console.log('You currently does not have a configuration file setup. Therefore, no hostnamtes are registered.');
		return;
	}

	if (configFile.whitelist.length === 0) {
		console.log('There are currently no hostnames registered.');
		return;
	}

	console.log('Here are the current hostnames:');
	configFile.whitelist.forEach(hostname => {
		console.log(`\t${hostname}`);
	});
}