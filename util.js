var capitalOne = require('./api_wrapper');
var async = require('async');

function resetDemo() {
  capitalOne.deleteUser(()=>{});
}
exports.resetDemo = resetDemo;
