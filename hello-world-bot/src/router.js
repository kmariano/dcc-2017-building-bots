const {ChatConnector, UniversalBot, Prompts } = require('botbuilder');
const _  = require('lodash');
const debug = require('debug')('hello-world-bot:router')


class Router {
  constructor({ appId, appSecret, geniusAccessToken }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.geniusAccessToken = geniusAccessToken;
    this.route = this.route.bind(this);
  }

  route(app) {
    const connector = new ChatConnector({
      appId: this.appId,
      appPassword: this.appSecret
    })

    //Connect your bot with a Default dialog
    const bot = new UniversalBot(connector, [
      function (session) {
          session.send('Hi! Welcome to Desert Code Camp 2017')
          Prompts.text(session, 'What is your name?');
      },
      // Step 2
      function (session, results) {
          session.userData.name = results.response
          session.endDialog(`Hello ${results.response}!`);
      }
    ])
    bot.dialog('Show my options', [
      function(session, args, next)
    ])
    app.post('/api/messages', connector.listen())


  }
}
module.exports = Router
