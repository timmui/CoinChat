var restify = require('restify');
var builder = require('botbuilder');
var api = require('./api_wrapper');
var config = require('./config');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
exports.server = server;

server.listen(config.port, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: config.MSAppId,
    appPassword: config.MSAppPassword,
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Static root page
server.get('/', (req, res) => {
    res.send(200, `API Version ${config.apiVersion} currently running.`);
});

// LUIS Setup
var model = `https://api.projectoxford.ai/luis/v1/application?id=${config.LuisAppId}&subscription-key=${config.LuisSubscriptionKey}`;
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', dialog);

//=========================================================
// Bots Dialogs
//=========================================================

dialog.matches('Greeting', [
    (session) => {
        session.send(['Greetings! How can I help you today?', 'Hello! How can I help you today?', 'Hi! How can I help you today?']);
    },
]);

dialog.matches('CreateAccount', [
    (session, args, next) => {
        var accountAction = builder.EntityRecognizer.findEntity(args.entities, 'AccountAction');
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'AccountType');
        if (!accountType) {
            builder.Prompts.choice(session, 'What type of account do you want to open?', ['Checking', 'Savings', 'Credit Card']);
        } else {
            return next({ response: accountType });
        }
    },
    (session, results) => {
        if (results.response) {
            session.userData = results.response.entity;
            builder.Prompts.text(session, 'Enter a name for your new ' + results.response.entity + ' account');
        } else {
            session.send('Something went wrong.');
        }
    },
    (session, results) => {
        var str = '';
        for (var i in session.userData) {
            str = str + session.userData[i];
        }
        api.createAccount(results.response, str, function (str) { 
            session.send(`${str} \n\nIs there anything else I can help you with?`);
        });
    },
]);

dialog.matches('ViewAccount', [
    (session, args, next) => {
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'AccountType');
        if (!accountType) {
            builder.Prompts.choice(session, 'Which account do you want to view?', ['Checking', 'Savings', 'Credit Card', 'All']);
        } else {
            return next({ response: accountType });
        }
    },
    (session, results) => {
        if (results.response) {
            if (results.response.entity == 'All'){
                session.send('Ok, here are all of your accounts.');
                api.getAccounts('Checking', function(str){ session.send(str); });
                api.getAccounts('Savings', function(str){ session.send(str); });
                api.getAccounts('Credit Card', function(str){
                    session.send(`${str} \n\nIs there anything else I can help you with?`);
                });
            } else {
                session.send(`Ok, here is your ${results.response.entity} account.`);
                api.getAccounts(results.response.entity, function (str) {
                    session.send(`${str} \n\nIs there anything else I can help you with?`);
                });
            }
        } else {
            session.send('Something went wrong.');
        }
    },
]);

dialog.matches('FindATM', [
    (session, args, next) => {
        session.send('Here are the nearest ATMs:');
        api.findAtms(function (str) {
            session.send(`${str} \n\nIs there anything else I can help you with?`);
        });
    },
]);

dialog.matches('ScanCheck', [
    (session, args) => {
        builder.Prompts.attachment(session, 'Please take a picture of the check.');
    },
    (session, results) => {
        console.error('Processing image: ' + session.message.attachments[0].contentUrl);
        api.scanCheck(session.message.attachments[0].contentUrl, (str) => {
            session.send(`${str} \n\nIs there anything else I can help you with?`);
        });
    },
]);

dialog.matches('NetWorth', [
    (session, args) => {
        //TODO add api call
    },
]);

dialog.matches('Confirm', [
    (session) => {
        session.send('What would you like to do?');
    },
]);

dialog.matches('Goodbye', [
    (session) => {
        session.send('Goodbye. Thank you for using ChatBot!');
    },
]);

dialog.onDefault(builder.DialogAction.send('I\'m sorry, I didn\'t quite catch that. How can I help you?'));
