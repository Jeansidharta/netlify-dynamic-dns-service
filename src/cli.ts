#!/usr/bin/env node

import * as commands from './commands';
import yargs from 'yargs';

yargs
	.option('watch', {
		describe: 'The number of minutes to wait between updates',
		requiresArg: true,
		number: true,
	})
	.command(
		'update',
		'updates all whitelisted hostnames to the current IP address',
		({ argv }) => {
			if (argv.watch) {
				console.log(`Watch mode enabled. Will update every ${argv.watch} minutes`);
				setInterval(commands.update, argv.watch * 1000 * 60);
			}
			commands.update();
		}
	)
	.command(
		'clear',
		'deletes all whitelisted hostnames',
		({ argv }) => {
			commands.clear();
			if (argv.watch) setInterval(commands.clear, argv.watch * 1000 * 60);
		}
	)
	.check(argv => {
		if (argv.watch !== undefined && isNaN(argv.watch))
			throw new Error('Must give a value to watch option');
		if (argv.watch && argv.watch < 5)
			throw new Error('Watch time cannot be under 5 minutes');
		return true;
	})
	.demandCommand(1, 1)
	.strict()
	.help();