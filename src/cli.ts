#!/usr/bin/env node

import * as commands from './commands';
import yargs from 'yargs';

function preventDeath<T extends typeof commands[keyof typeof commands]>(command: T) : T {
	const unkillableCommand = (...args: any) => {
		try {
			return command(...args);
		} catch (e: any) {
			console.error(e.message);
			return null;
		}
	}

	return unkillableCommand as T;
}

const updateCommand = preventDeath(commands.update);
const clearCommand = preventDeath(commands.clear);

const { argv } = yargs
	.option('watch', {
		describe: 'The number of minutes to wait between updates',
		requiresArg: true,
		number: true,
	})
	.option('ipv4', {
		describe: 'Indicates that IPV4 should be used',
		requiresArg: false,
		boolean: true,
	})
	.option('ipv6', {
		describe: 'Indicates that IPV6 should be used',
		requiresArg: false,
		boolean: true,
	})
	.command(
		'update',
		'updates all whitelisted hostnames to the current IP address',
		({ argv }) => {
			const IPType = (
				argv.ipv6 ? 'IPV6' :
				argv.ipv4 ? 'IPV4' :
				'IPV6'
			);

			console.log(`Updating records to ${IPType}`);

			if (argv.watch) {
				console.log(`Watch mode enabled. Will update every ${argv.watch} minutes`);
				setInterval(() => updateCommand(IPType), argv.watch * 1000 * 60);
			}
			updateCommand(IPType);
		}
	)
	.command(
		'clear',
		'deletes all whitelisted hostnames',
		({ argv }) => {
			clearCommand();
			if (argv.watch) setInterval(clearCommand, argv.watch * 1000 * 60);
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

if (false) console.log(argv);