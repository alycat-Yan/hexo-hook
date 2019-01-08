'use strict';

/**
 *   1. check if hexo-server plugin included use it or create hook server
 *   2. read the config file to check listen uri and type. ( for now this hook plugin only support github webhook syntax )
 *   3. create webhook post data parser to listen the event of website.
 *   4. if received the notification, make sure to pull the source files from remote to locate, the locate folder maybe the source/_posts or themes folder.
 *   5. call the generate module in hexo to recreate the static files in public folder.
 */
const Promise = require('bluebird');
module.exports = function(args, callback) {
  const { filter } = this.extend;
  let server_plugin = this.extend.console.get('server');

  // 1. check if hexo-server plugin included use it or create hook server
  if (server_plugin === undefined) {
    this.extend.console.register('server', 'Start the server.', {
      desc: 'Start the server and watch for file changes.',
      options: [
        {name: '-p, --port', desc: 'Override the default port.'}
      ]
    }, require('./middleware/server'));
  }

  filter.register('server_middleware', require('./route'));
  return new Promise((resolve, reject) => {
    this.call('server', args).then(resolve, reject);
  });
};
