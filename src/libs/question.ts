import readline from 'readline';
import process from 'process';

export async function askQuestion (question: string) {
	const lineReader = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise<string>(resolve =>
		// The whitespace is to make sure there is a space between the text and the user's answer.
		// Is is purely aesthetic.
		lineReader.question(question + ' ', (answer) => {
			lineReader.close();
			resolve(answer);
		})
	);
}

export async function askBooleanQuestion (question: string, defaultAnswer = false) {
	const answer = await askQuestion(question.trim() + ' (Y or N) ');
	const lowercase = answer.trim().toLowerCase();

	if (lowercase === 'y' || lowercase === 'yes' || lowercase === 'ye') return true;
	if (lowercase === 'n' || lowercase === 'no') return false;

	console.log(`Unrecognized answer. Defaulting to ${defaultAnswer ? 'Y' : 'N'}.`);
	return defaultAnswer;
}