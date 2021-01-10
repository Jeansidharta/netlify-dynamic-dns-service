let logs: string[] = [];

export function log (...messages: string[]) {
	console.log(...messages);
	logs = logs.concat(messages);
}

export function getLogs () {
	return logs;
}

export function resetLogs () {
	logs = [];
}