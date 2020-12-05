import axios from 'axios';

const workerProcessHostname = 'localhost';
const workerProcessPort = 7777;

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