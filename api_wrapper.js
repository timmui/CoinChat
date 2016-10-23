var request = require('request')
var config = require('./config')
const username = '580ba86e360f81f104544d31';

function createAccount(name, type, cb) {
  var options = {
  uri: 'http://api.reimaginebanking.com/customers/'+username+'/accounts?key='+config.CapitalOneKey,
  method: 'POST',
  json:
    {
      "type": type,
      "nickname": name,
      "rewards": 0,
      "balance": 0
        }
  }
request(options, function (error, response, body) {
  if (!error && response.statusCode == 201) {
    console.log(body)
    cb('Account Successfully Created')
  }
  else {
    cb('Could not create account. Please try again')
  }
})};

exports.createAccount = createAccount;


function getAccounts(type,cb){
  request('http://api.reimaginebanking.com/customers/'+username+'/accounts?key='+config.CapitalOneKey
  , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonResponse = JSON.parse(body);
      returnString = '';
      for (var i = 0; i < jsonResponse.length; i++) {
        if (jsonResponse[i].type !== type) continue;
        var delimiter = ',';
        if (i==jsonResponse.length-1) delimiter = '';
        returnString = returnString + jsonResponse[i].type + ' (' + jsonResponse[i].nickname + ')'
        + '$' + jsonResponse[i].balance.toFixed(2) + delimiter + '\n\n';
      }
      return cb(returnString);
    }})};

  exports.getAccounts = getAccounts;

  function findAtms(cb) {
    request('http://api.reimaginebanking.com/atms?lat=38.9072&lng=-77.1753&rad=5&key='+config.CapitalOneKey, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonResponse = JSON.parse(body).data;
        var str = '';
        for (var i = 0; i < 4; i++) {
          str += + (i+1) + ') ' + jsonResponse[i].name + ' , ';
          str += str + ('Address: ' + jsonResponse[i].address.street_number + ' ' + jsonResponse[i].address.street_name + ', ' + jsonResponse[i].address.city) + ', ';
          str += str + ('Hours: ' + jsonResponse[i].hours[0]) + '\n\n';
        }
        return cb(str);
      }})}

  exports.findAtms = findAtms;