// This is a config file for the process manager `pm2`. See this link for more info:
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
	apps: [{
		name: 'netlify-domain-watch',
		script: 'build/src/cli.js',
		args: 'update --watch 60',
		watch: false,
		cwd: require.main.id,
		time: true,
	}],
};
