let logs: string[] = [];
let verbosity = 0;

export function log (message: string, commandVerbosity = 0) {
	console.log(message);
	if (commandVerbosity <= verbosity) logs.push(message);
}

export function getLogs () {
	return logs;
}

export function resetLogs () {
	logs = [];
}

export function setVerbosity (newVerbosity: number) {
	verbosity = newVerbosity;
}