# Netlify Dynamic DNS Service

This is a CLI (command line interface) for manipulating the DNS records in your Netlify's account. It can also be used to automatically update your Netlify's DNS records to match your own IP address. It supports IPV4 and IPV6 records.

# commands

running the cli with `--help` option will probably be of more help than this file

## update

usage: `netlify-domain-manager update [--watch $SECONDS] [--ipv4] [--ipv6]`

Updates all records in the `whitelist.json` file.

options:
- `--watch $SECONDS`: will keep the process running forever, calling the `update` command once every $SECONDS seconds.
- `--ipv4`: Updates DNS records with your IPV4
- `--ipv6`: Updates DNS records with your IPV6


## clear

usage: `netlify-domain-manager clear`

Deletes all DNS records from Netlify that match the hostnames in the `whitelist.json` file