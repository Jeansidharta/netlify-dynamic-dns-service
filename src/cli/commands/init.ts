import { workerAxiosInstance } from "../axios";
import { tryCreatingConfigFileWithUser } from "../user-create-config";

export async function init () {
	await tryCreatingConfigFileWithUser();

	await workerAxiosInstance.post('/config/read');
	console.log('The worker thread should have everything running now.');
}