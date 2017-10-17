const {ChatConnector, UniversalBot, Prompts } = require('botbuilder');
const _  = require('lodash');
const debug = require('debug')('hello-world-bot:router')
const topHeadlines = require('./dialogs/top-headlines')
const listSources = require('./dialogs/list-sources')
const searchStory = require('./dialogs/search-story')

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

    app.post('/api/messages', connector.listen())
    //Connect your bot with a Default dialog
    // const bot = new UniversalBot(connector, [
    //   function (session) {
    //       session.send('Hi! Welcome to Desert Code Camp 2017')
    //
    //   },
    //   // Step 2
    //   function (session, results) {
    //       session.endDialog(`Hello ${results.response}!`);
    //   }
    // ])

    const DialogLabels = {
        TopHeadLines: 'Top head lines',
        Search: 'Search for a story',
        ListSources: 'List Sources'
    };

    const bot = new UniversalBot(connector, [
        function (session) {
          session.send('Welcome to News Bot powererd by newsapi.org.')
          Prompts.choice(
                session,
                'Select a menu option',
                [DialogLabels.TopHeadLines, DialogLabels.search, DialogLabels.ListSources],
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option'
                });
        },
        function (session, result) {
            if (!result.response) {
                // exhausted attemps and no selection, start over
                session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
                return session.endDialog();
            }

            // on error, start over
            session.on('error', function (err) {
                session.send('Failed with message: %s', err.message);
                session.endDialog();
            });

            // continue on proper dialog
            const selection = result.response.entity;
            switch (selection) {
                case DialogLabels.TopHeadLines:
                    return session.beginDialog('topHeadlines');
                case DialogLabels.ListSources:
                    return session.beginDialog('listSources');
                case DialogLabels.Search:
                    return session.beginDialog('searchStory');
            }
        }
    ]);

    bot.dialog('topHeadlines', topHeadlines);
    bot.dialog('search', searchStory);
    bot.dialog('listSources', listSources)
        .triggerAction({
            matches: [/help/i, /cancel/i, /problem/i]
        });

    // log any bot errors into the console
    bot.on('error', function (e) {
        console.log('And error ocurred', e);
    });


  }
}
module.exports = Router
