const _ = require('lodash');
const SigtermHandler = require('sigterm-handler');
const Server = require('./server');

class Command {
  constructor() {
    this.panic = this.panic.bind(this);
    this.run = this.run.bind(this);
    this.serverOptions = {
      port:           process.env.PORT || 3000,
      appId:          process.env.MS_APP_ID,
      appSecret:      process.env.MS_APP_SECRET,
      disableLogging: process.env.DISABLE_LOGGING === "true"
    };
  }

  panic(error) {
    console.error(error.stack);
    return process.exit(1);
  }

  run() {
    // Use this to require env
    console.log('Server options: ', this.serverOptions)
    if(_.isEmpty(this.serverOptions.appId))
      return this.panic(new Error('Missing required environment variable: APP_ID'))

    if(_.isEmpty(this.serverOptions.appSecret))
      return this.panic(new Error('Missing required environment variable: APP_PASSWORD'))

    let server = new Server(this.serverOptions);
    server.run(error => {
      if (error != null) { return this.panic(error); }

      let {address,port} = server.address();
      return console.log(`DCC 2017 Demo Bot listening on port: ${port}`);
    }
    );

    let sigtermHandler = new SigtermHandler();
    return sigtermHandler.register(server.stop);
  }
}

module.exports = Command;
