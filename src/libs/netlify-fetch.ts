import fetch, { RequestInit } from 'node-fetch';
import { key } from '../../netlify_key.json';

type RequestInitObjectBody = Omit<RequestInit, 'body'> & { body?: object };

export async function netlifyFetch<T>(url: string, options?: RequestInitObjectBody): Promise<T> {
	const body = JSON.stringify(options?.body);

	const newOptions: RequestInit = {
		...options,
		body,
		headers: {
			...options?.headers,
			authorization: 'Bearer ' + key,
		}
	}

	const response = await fetch(`https://api.netlify.com/api/v1/${url}`, newOptions).catch(() => {
		throw new Error('Internet error at netlify call');
	});

	if (!response.ok) {
		throw new Error(`Netlify call STATUS CODE ${response.status}: ${response.statusText}`);
	}

	const data: T = await response.json().catch(() => {
		throw new Error('Failed to parse Netlify response');
	});

	return data;
}