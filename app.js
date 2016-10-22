var restify = require('restify');
var builder = require('botbuilder');

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
    res.send(200, 'API Version ${config.apiVersion} currently running.');
});

// LUIS Setup
var model = 'https://api.projectoxford.ai/luis/v1/application?id=6bfcb96e-0dbb-443d-8c75-36224da1b80f&subscription-key=70c5729403d64977871078f0c34e46ac';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] })
bot.dialog('/', dialog);

//=========================================================
// Bots Dialogs
//=========================================================
dialog.matches('CreateAccount', [
    (session, args, next) => {
        var accountAction = builder.EntityRecognizer.findEntity(args.entities, 'AccountAction');
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'AccountType');
        session.send('Receieved Account Action and Type', accountAction, accountType);
    }
]);

dialog.onDefault(builder.DialogAction.send('I\'m sorry, I didn\'t quite catch that.'));

