import axios from 'axios';
import process from 'process';

const workerProcessHostname = 'localhost';
const workerProcessPort = Number(process.env.WORKER_PORT || 7777);

export const workerAxiosInstance = axios.create({
	baseURL: `http://${workerProcessHostname}:${workerProcessPort}/`,
});

workerAxiosInstance.interceptors.response.use(undefined, (error) => {
	const { response } = error;

	if (!response) {
		console.error('No response was received. Is the worker process on?');
	} else {
		console.error(`ERROR ${response.status}: ${response.data}`);
	}

	return Promise.reject(error);
});