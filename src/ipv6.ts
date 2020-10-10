import fetch from 'node-fetch';

export async function getMyIPV6 () {
	const response = await fetch('https://v6.ident.me/.json').catch(() => {
		throw new Error('Internet error at IPV6 call');
	});

	if (!response.ok) {
		throw new Error(`IPV6 call STATUS CODE ${response.status}: ${response.statusText}`);
	}

	const ipv6: string = await response.json().catch(() => {
		throw new Error('Failed to parse IPV6 response');
	});

	return ipv6;
}