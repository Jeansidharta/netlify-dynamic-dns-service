import os from 'os';

export function getMyIP () {
	const networkInterfaces = os.networkInterfaces();

	for (const networkInterface of Object.values(networkInterfaces)) {
		for (const { address, family, internal } of networkInterface!) {
			// No IPv4 addresses.
			if (family === 'IPv4') continue;

			// No internal addresses (e.g. 127.0.0.1 or ::1)
			if (internal) continue;

			// IPv6 addresses that start with fe80 are link-local addresses.
			// We want the global addresses.
			if (address.startsWith('fe80')) continue;

			return address;
		}
	}

	throw new Error('No valid IPv6 was found.');
}