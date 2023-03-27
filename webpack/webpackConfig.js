const config = require('../.env-cmdrc.js');
module.exports = Object.assign(config.env, config[process.env.ENV_NODE]);
