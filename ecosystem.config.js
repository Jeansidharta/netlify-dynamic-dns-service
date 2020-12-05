// This is a config file for the process manager `pm2`. See this link for more info:
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
	apps: [{
		name: 'netlify-worker-ddns',
		script: 'build/worker/index.js',
		watch: false,
		cwd: require.main.id,
		time: true,
	}],
};
