export let verbosity: number = 0;

export function setVerbosity (newVerbosity = 0) {
	verbosity = newVerbosity;
}

export function getVerbosity () {
	return verbosity;
}