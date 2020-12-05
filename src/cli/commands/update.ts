import { workerAxiosInstance } from '../axios';

export async function update () {
	await workerAxiosInstance.post('/update-now');
	console.log('Hostnames updated successfuly');
}