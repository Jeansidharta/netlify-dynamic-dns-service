import { createConfigFile } from "../config";
import { askBooleanQuestion, askQuestion } from "../libs/question";

async function askForData (): Promise<{ netlifyKey: string, domainName: string }> {
	const netlifyKey = await askQuestion(`\nFirst, I need your netlify personal access token. It should be in your account's configuration section, under "Application":`);
	const domainName = await askQuestion(`\nNow, I need the domain name you bought on netlify:`);

	console.log(`\nAwesome! Here is the data you just provided to me:`);
	console.log(`\tNetlify personal token: ${netlifyKey}`);
	console.log(`\Your domain name: ${domainName}`);
	const isCorrect = await askBooleanQuestion(`Is the information correct?`);

	if (!isCorrect) {
		console.log(`Alright. I'll ask the same information again then.`);
		return askForData();
	}

	return { netlifyKey, domainName };
}

export async function tryCreatingConfigFileWithUser () {
	const shouldCreateConfig = await askBooleanQuestion(`You appear not to currently have a configuration file in your system. I can't do anything without one. Would you like to create one?`);

	if (!shouldCreateConfig) {
		console.log(`I can't do anything without a config file. I'm sorry.`);
		throw new Error('Missing config file');
	}

	const { domainName, netlifyKey } = await askForData();

	console.log('Perfect! Creating the configuration file now...');

	try {
		createConfigFile(netlifyKey, domainName);
	} catch (e) {
		console.log(`Err... Something went wrong creating the configuration file. I'm not sure what. I'm sorry`);
		throw new Error('Failed to create config file.');
	}

	console.log('Configuration file created successfuly!');
}