var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (process.env.NODE_ENV !== 'production') {
    // Load .env file
    require('dotenv').config();
}

module.exports = {
    port: process.env.port || process.env.PORT || 3978,
    environment: process.env.NODE_ENV || 'development',
    apiVersion: pkg.version,
    MSAppId: process.env.MICROSOFT_APP_ID,
    MSAppPassword: process.env.MICROSOFT_APP_PASSWORD,
    MSTextAnalyticsKey: process.env.MICROSOFT_TEXT_ANALYTICS_KEY,
    LuisSubscriptionKey: process.env.LUIS_SUBSCRIPTION_KEY,
};
