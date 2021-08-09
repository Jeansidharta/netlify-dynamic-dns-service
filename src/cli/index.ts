#!/usr/bin/env node

import yargs from 'yargs';
import { update } from './commands/update';
import { remove } from './commands/remove';
import { add } from './commands/add';
import { list } from './commands/list';
import { init } from './commands/init';
import { echoIP } from './commands/echo-ip';
import { setVerbosity } from './verbosity';

function makeHandler(handler: Function) {
	return async (yargs: any, ...args: any[]) => {
		const verbosityLevel = Number(yargs.verbosity || 0);

		if (isNaN(verbosityLevel) || !isFinite(verbosityLevel)) {
			console.log('Invalid verbosity level.');
			return;
		}

		setVerbosity(verbosityLevel);
		try {
			return await handler(yargs, ...args);
		} catch(e) {}
	}
}

const { argv } = yargs
	.option('verbosity', {
		type: 'number',
		alias: ['v', 'verbose'],
		default: 0,
		requiresArg: false,
		description: 'The verbosity level of the command. Number. Default is 0. Higher numbers makes more verbosity. Lower numbers, less verbosity. A verbosity smaller than 0 is silent. Maximum verbosity level is 2.',
	})
	.command(
		'update [hostname]',
		'forces worker process to check for an update on all hostnames',
		() => {},
		makeHandler(update),
	)
	.command(
		['remove <hostname>', 'delete <hostname>'],
		'removes a specific hostname',
		() => {},
		makeHandler(remove),
	)
	.command(
		['init', 'start', 'initialize'],
		'Initializes the configuration file',
		() => {},
		makeHandler(init),
	)
	.command(
		['add <hostname>', 'new <hostname>', 'create <hostname>'],
		'adds a new hostname to sync',
		() => {},
		makeHandler(add),
	)
	.command(
		'list',
		'Lists registered hostnames',
		() => {},
		makeHandler(list),
	)
	.command(
		['ip'],
		'Prints my current IPv6',
		() => {},
		makeHandler(echoIP),
	)
	.demandCommand(1, 1)
	.strict()
	.help();

if (false) console.log(argv);