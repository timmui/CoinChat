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
    res.send(200, `API Version ${config.apiVersion} currently running.`);
});

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', (session) => {
    session.send('Hello World');
});
