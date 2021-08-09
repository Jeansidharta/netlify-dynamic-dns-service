# Netlify Dynamic DNS Service

If you use Netlify's domain name system, and intends on hosting an application on a server that doesn't have a static IP address, you may wish to automatically detect whenever your machine's public IP changes, and update your Netlify's domain name records to point to the new IP. This is exactly the problem this project solves.

This project has a daemon process (a process that will run on the background) that will periodicaly fetch your Netlify's DNS records and compare them to your public IP address. If the record's value and your IP don't match, it automatically updates the record with the new IP address.

There is also a Command Line Interface (CLI) that can communicate with the daemon process. It is used to list, add or remove the hostnames to be syncronized.

# commands

Pleae, run the cli with `--help` option. It will be a lot better at explaining each command.

#