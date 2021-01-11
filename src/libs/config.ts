import path from 'path';
import process from 'process';
import { promises as fs, readFileSync, statSync, writeFileSync } from 'fs';
import { ConfigurationFile } from '../models/config';
import { log } from '../worker/logger';

function getConfigFileLocation () {
	return path.join(process.env.HOME as string, 'netlify-domains.json');
}

function doesConfigFileExist () {
	const configFileLocation = getConfigFileLocation();
	try {
		statSync(configFileLocation);
		return true;
	} catch(e) {
		return false;
	}
}

export function createConfigFile (netlifyKey: string, domainName: string) {
	const configFileLocation = getConfigFileLocation();
	const newConfigFile: ConfigurationFile = {
		domainName,
		netlifyKey,
		whitelist: [],
	};

	writeFileSync(configFileLocation, JSON.stringify(newConfigFile));
	configFile = newConfigFile;
}

export function readConfigFile () {
	const configFileLocation = getConfigFileLocation();
	if (!doesConfigFileExist()) {
		return;
	}
	try {
		// Read and parse the config file.
		configFile = JSON.parse(readFileSync(configFileLocation, 'utf8'));
	} catch (e) {
		log('Failed to read or parse config file');
	}
}


export let configFile: ConfigurationFile | undefined;

readConfigFile();

/**
 * Checks if hostname should be kept up to date in Netlify's DNS records.
 */
export function isWhitelisted (hostname: string) {
	if (!configFile) throw new Error('Config file does not exist.');

	return configFile.whitelist.findIndex(item => item === hostname) >= 0;
}

/**
 * given the hostnames list (possibly comming from netlify's current DNS records),
 * determines which of the hostnames that should be syncronized were not in the list
 */
export function getMissingWhitelistItems (hostnames: string[]) {
	if (!configFile) throw new Error('Config file does not exist.');

	return configFile.whitelist.filter(whitelistItem =>
		!hostnames.some(hostname => hostname === whitelistItem)
	);
}

/** Updates the configuration file that was read in the disk */
async function updateConfigFile () {
	await fs.writeFile(getConfigFileLocation(), JSON.stringify(configFile), { encoding: 'utf8' });
}

/** Adds a new hostname to the config file, while also updating it on disk */
export async function addToWhitelist (hostname: string) {
	if (!configFile) throw new Error('Config file does not exist.');

	if (configFile.whitelist.find(name => name === hostname)) return;

	configFile.whitelist.push(hostname);
	await updateConfigFile();
}

/** removes a new hostname from the config file, while also updating it on disk */
export async function removeFromWhitelist (hostname: string) {
	if (!configFile) throw new Error('Config file does not exist.');

	const hostnameIndex = configFile.whitelist.findIndex(name => name === hostname);
	if (hostnameIndex === -1) throw new Error('Hostname not found');
	configFile.whitelist.splice(hostnameIndex, 1);
	await updateConfigFile();
}