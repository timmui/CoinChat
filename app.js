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
        session.send(['Greetings!', 'Hello!', 'Hi!']);
    }
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
            session.send(`Ok, opening a ${results.response.entity} account.`);
        } else {
            session.send('Something went wrong.');
        }
    }
]);

dialog.matches('ViewAccount', [
    (session, args, next) => {
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'AccountType');
        if (!accountType) {
            builder.Prompts.choice(session, 'Which account do you want to view?', ['Checking', 'Savings', 'Credit Card']);
        } else {
            return next({ response: accountType });
        }
    },
    (session, results) => {
        if (results.response) {
            session.send(`Ok, here is your ${results.response.entity} account.`);
            api.getAccounts(results.response.entity, function (str) {session.send(str)});
        } else {
            session.send('Something went wrong.');
        }
    }
]);

dialog.matches('FindATM', [
    (session, args, next) => {
      session.send("Here are the nearest ATM's")
      api.findAtms(function (str) {session.send(str)});
    }
]);

dialog.matches('ScanCheck', [
    (session, args) => {
        builder.Prompts.attachment(session, 'Please take a picture of the check');
    },
    (session, results) => {
        console.error(session.message.attachments);
        session.send('Success');
    }
])

dialog.onDefault(builder.DialogAction.send('I\'m sorry, I didn\'t quite catch that.'));
