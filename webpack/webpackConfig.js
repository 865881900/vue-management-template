const config = require('../.env-cmdrc.json');
module.exports = Object.assign(config.env, config[process.env.ENV_NODE]);
