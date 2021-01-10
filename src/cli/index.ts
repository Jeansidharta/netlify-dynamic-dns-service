#!/usr/bin/env node

import yargs from 'yargs';
import { update } from './commands/update';
import { remove } from './commands/remove';
import { add } from './commands/add';
import { list } from './commands/list';
import { init } from './commands/init';
import { echoIP } from './commands/echo-ip';

function preventDeath(handler: Function) {
	return async (...args: any[]) => {
		try {
			return await handler(...args);
		} catch(e) {}
	}
}

const { argv } = yargs
	.command(
		'update [hostname]',
		'forces worker process to check for an update on all hostnames',
		() => {},
		preventDeath(update),
	)
	.command(
		['remove <hostname>', 'delete <hostname>'],
		'removes a specific hostname',
		() => {},
		preventDeath(remove),
	)
	.command(
		['init', 'start', 'initialize'],
		'Initializes the configuration file',
		() => {},
		preventDeath(init),
	)
	.command(
		['add <hostname>', 'new <hostname>', 'create <hostname>'],
		'adds a new hostname to sync',
		() => {},
		preventDeath(add),
	)
	.command(
		'list',
		'removes a specific hostname',
		() => {},
		preventDeath(list),
	)
	.command(
		['ip'],
		'Prints my current IPv6',
		() => {},
		preventDeath(echoIP),
	)
	.demandCommand(1, 1)
	.strict()
	.help();

if (false) console.log(argv);