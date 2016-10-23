var request = require('request');
var config = require('./config');
var async = require('async');

function createNewUser(cb) {
    var options = {
        uri: 'http://api.reimaginebanking.com/customers/?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
          "first_name": "Red",
          "last_name": "Bull",
          "address": {
            "street_number": "109",
            "street_name": "Westmount Road",
            "city": "Waterloo",
            "state": "NY",
            "zip": "30074"
          }
        }
    };
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 201) {

            config.account = body.objectCreated._id
            console.log(body.objectCreated._id)
            console.log(config.account)
            createAccountBegin('Venture Rewards', 'Credit Card', 60, function (str) {})
            createAccountBegin('360 Checking®', 'Checking', 200, function (str) {})
            createAccountBegin('360 Savings®', 'Savings', 1500, function (str) {});
            return cb(true);

        }
        else {
            return cb(false);
        }
    });
}

exports.createNewUser = createNewUser;

function deleteUser(cb){
    var options = {
        uri: 'http://api.reimaginebanking.com/accounts/' + config.account + '?key=' + config.CapitalOneKey,
        method: 'DELETE',
    };
    request(options, (error, response) => {
        if (!error && response.statusCode == 204) {
            return createNewUser(cb);
        }
        else {
          return createNewUser(cb);
        }
    });
}
exports.deleteUser = deleteUser;

function initAccounts(cb) {
    var credit = {
        uri: 'http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
            'type': 'Credit Card',
            'nickname': 'Venture® Rewards',
            'rewards': 0,
            'balance': -60,
        },
    };
    var checking = {
        uri: 'http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
            'type': 'Checking',
            'nickname': '360 Checking® Account',
            'rewards': 0,
            'balance': 1000,
        },
    };
    var savings = {
        uri: 'http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
            'type': 'Savings',
            'nickname': '360 Savings® Account',
            'rewards': 0,
            'balance': 15000,
        },
    };

    async.waterfall([
        (next) => request(credit, (error, response) => {
            if (!error && response.statusCode == 201) {
                console.log('Added credit account');
                next();
            }
            else {
                console.error('Failed to create account.');
                next();
            }}),
            (next) => request(checking, (error, response) => {
                if (!error && response.statusCode == 201) {
                    console.log('Added credit account');
                    next();
                }
                else {
                    console.error('Failed to create account.');
                    next();
                }}),
                (next) => request(savings, (error, response) => {
                    if (!error && response.statusCode == 201) {
                        console.log('Added credit account');
                        next();
                    }
                    else {
                        console.error('Failed to create account.');
                        next();
                    }}),
                ], (error, response, body) => {

        if (!error && response.statusCode == 201) {
            console.log(body);
            cb(true);
        }
        else {
            console.error('Failed to create accounts.');
            cb(false);
        }
    });
}
exports.initAccounts = initAccounts;

function createAccountBegin(name, type, amount, cb) {
   console.log("calls here")
    var options = {
        uri: 'http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
            'type': type,
            'nickname': name,
            'rewards': 0,
            'balance': amount,
        },
    };
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 201) {
            console.log(body);
            cb('Account Successfully Created');
        }
        else {
            cb('Could not create account. Please try again');
        }

    });
}

exports.createAccountBegin = createAccountBegin;

function createAccount(name, type, cb) {
   console.log("calls here")
    var options = {
        uri: 'http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey,
        method: 'POST',
        json:
        {
            'type': type,
            'nickname': name,
            'rewards': 0,
            'balance': 0,
        },
    };
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 201) {
            console.log(body);
            cb('Account successfully created.');
        }
        else {
            cb('Could not create account. Please try again.');
        }
    });
}

exports.createAccount = createAccount;

function getAccountNumber(type, cb) {
    request('http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey
        , function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonResponse = JSON.parse(body);
                returnString = '';
                for (var i = 0; i < jsonResponse.length; i++) {
                    if (jsonResponse[i].type == type) {
                        return cb(jsonResponse[i]._id);
                    }
                }
            }
            return cb(null);
        });
}

function deposit(type, amount, cb) {
    getAccountNumber(type, function (res) {
        if (res == null) return cb(false);
        var options = {
            uri: 'http://api.reimaginebanking.com/accounts/' + res + '/deposits?key=' + config.CapitalOneKey,
            method: 'POST',
            json: {
                'medium': 'balance',
                'transaction_date': '2016-10-23',
                'amount': amount,
                'description': 'string',
            },
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 201) {
                cb(true);
            }
            else {
                cb(false);
            }
        });
    });
};
exports.deposit = deposit;

function getAccounts(type, cb) {
    request('http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey
        , (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var jsonResponse = JSON.parse(body);
                returnString = '';
                for (var i = 0; i < jsonResponse.length; i++) {
                    if (jsonResponse[i].type.toLowerCase() !== type.toLowerCase()) continue;
                    var delimiter = ',';
                    if (i == jsonResponse.length - 1) delimiter = '';
                    returnString = returnString + jsonResponse[i].type + ' (' + jsonResponse[i].nickname + ') '
                        + '$' + jsonResponse[i].balance.toFixed(2) + delimiter + '\n\n';
                }
                return cb(returnString);
            }
        });
};
exports.getAccounts = getAccounts;

function getNetWorth(cb) {
    request('http://api.reimaginebanking.com/customers/' + config.account + '/accounts?key=' + config.CapitalOneKey
        , (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var jsonResponse = JSON.parse(body);
                console.log(jsonResponse);
                
                // TODO: the math for this
                var totalAsset=0;
                var totalDebt=0;

                var netWorth = totalAsset - totalDebt;
                return cb(`Total Assets: $${totalAsset}\n\nTotal Debts: $${totalDebt}\n\nNet Worth: $${netWorth}`);
            }
        });
};
exports.getNetWorth = getNetWorth;


function findAtms(cb) {
    request('http://api.reimaginebanking.com/atms?lat=38.9072&lng=-77.1753&rad=5&key=' + config.CapitalOneKey, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var jsonResponse = JSON.parse(body).data;
            var str = '';
            for (var i = 0; i < 2; i++) {
                str += jsonResponse[i].name + ' , ';
                str += ('Address: ' + jsonResponse[i].address.street_number + ' ' + jsonResponse[i].address.street_name + ', ' + jsonResponse[i].address.city) + ', ';
                str += ('Hours: ' + jsonResponse[i].hours[0]) + '\n\n';
            }
            return cb(str);
        }
    });
}
exports.findAtms = findAtms;

function scanCheck(imageUrl, cb) {
    var options = {
        uri: 'https://api.projectoxford.ai/vision/v1.0/ocr?language=unk&detectOrientation=true',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': config.ComputerVisionSubscriptionKey,
        },
        body: JSON.stringify({
            'url': imageUrl,
        }),
    };
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var jsonResponse = body;
            //console.log("----------------\n\n"+jsonResponse);
            var dollarValue = '';
            var filteredJson = jsonResponse.match(/\$[^t]*.*/g);
            //console.log(filteredJson);
            var dollarValue = parseFloat(filteredJson[0].match(/\d+(\.\d{2})/g));
            console.log(dollarValue);

            // Deposit the amount
            deposit('Checking', dollarValue, (success) => {
                if (success) {
                    return cb(`$${dollarValue} was deposited into your checking account.`);
                }
                else {
                    return cb('Sorry, something went wrong. Can you please try again?');
                }

            });
        }
        else {
            cb('Sorry, I didn\'t catch that. Can you please try again?');
        }
    });
};
exports.scanCheck = scanCheck;
