var capitalOne = require('./api_wrapper');
var async = require('async');

function resetDemo(callback) {
    async.waterfall([
        (next) => capitalOne.deleteUser(next),
        (next) => capitalOne.initAccounts(next),
    ], callback);
}
exports.resetDemo = resetDemo;
