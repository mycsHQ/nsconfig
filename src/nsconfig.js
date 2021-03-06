'use strict';
var _ = {
        extend: require('lodash.assign')
    },
    osenv = require('osenv');

var parseConfig = require('./parse-config'),
    resolveEnv = require('./resolve-env'),
    resolveLocal = require('./resolve-local'),
    checkParams = require('./check-params');

module.exports = nsconfig;
function nsconfig(params, arg2 , arg3) {
    params = params || {};

    var custom = {};
    var nothrow = false;
    if ( arguments.length === 2 && typeof arg2 == 'boolean' ) {
        nothrow = arg2;
    } else if (arguments.length === 2) {
        custom = arg2;
    } else if (arguments.length === 3) {
        nothrow = arg3;
        custom = arg2 || {};
    }

    var confFileName = params.conffile || process.env.NSCONF || process.env.NSCONF_CONFFILE || 'nsconfig.json';
    var opt = { CONF_CWD : null };

    var confFileGlobal = parseConfig(`${osenv.home()}/.ns/${confFileName}`),
        confFileLocal = parseConfig(resolveLocal(confFileName, opt)),
        confEnvVars = resolveEnv();

    params = _.extend({}, confFileGlobal, confFileLocal, params, confEnvVars);
    params = checkParams(params, nothrow,custom);
    nsconfig.CONF_CWD = opt.CONF_CWD;
    return params;
}
