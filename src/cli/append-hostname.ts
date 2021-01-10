import { configFile } from "../libs/config";
import { askBooleanQuestion } from "../libs/question";
import { tryCreatingConfigFileWithUser } from "./user-create-config";

export async function appendHostname (hostname: string) {
	if (!configFile) await tryCreatingConfigFileWithUser();

	if (!hostname.endsWith(configFile!.domainName)) {
		const shouldAppendHostname = await askBooleanQuestion(`Your hostname seems not to end with the hostname you own: '${configFile!.domainName}'. Would you like to append it to the hostname you provided?`);
		if (shouldAppendHostname) {
			if (hostname.endsWith('.') || !hostname) return hostname + configFile!.domainName;
			return hostname + '.' + configFile!.domainName;
		}
		else {
			console.log('Appending hostname was denied. The operation cannot be completed.');
			throw new Error('Invalid hostname');
		}
	}
	return hostname;
}