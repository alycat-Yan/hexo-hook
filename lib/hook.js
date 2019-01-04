'use strict';

/**
 *  todo 1. check if hexo-server plugin included use it or create hook server
 *  todo 2. read the config file to check listen uri and type. ( for now this hook plugin only support github webhook syntax )
 *  todo 3. create webhook post data parser to listen the event of website.
 *  todo 4. if received the notification, make sure to pull the source files from remote to locate, the locate folder maybe the source/_posts or themes folder.
 *  todo 5. call the generate module in hexo to recreate the static files in public folder.
 */
const Promise = require('bluebird');
const chalk = require('chalk');

module.exports = function(args, callback) {

  const { config } = this;
  const { filter } = this.extend;
  if (!config.webhook) {
    let help = '';
    help += 'You should configure webhook settings in _config.yml first!\n\n';
    help += 'Available deployer plugins:\n';
    help += `  ${Object.keys(config.webhook).join(', ')}\n\n`;
    help += `For more help, you can check the online docs: ${chalk.underline('https://hexo.io/')}`;
    console.log(help);
    return;
  }
  let hasHexoServer = 1;
  if (hasHexoServer) {
    addHook(this);
  } else {
    this.extend.filter.register('', null).required('./lib/middleware/server');
  }
  // let hook_type = config.webhook.type || 'github';
  // let remote_repository = webhook_config.repository;
  // console.log(this.watch())
  // new Promise((resolve, reject) => {
  // this.call('generate', args).then(resolve, reject);
  // })
  // addHook(this);
  // console.log(this.extend.console.get('server'))
  //   if(filter)
  callGenerator(this, args);
  filter.register('server_middleware', require('./route'));
  return new Promise((resolve, reject) => {
    this.call('server', args).then(resolve, reject);
  });
};

// 1. check if server plugin, if the plugin is included,just add webhook uri , otherwise create http server.
// 2.
function addHook(hexo) {
  let config = hexo.config;
}

function callGenerator(ctx, args) {
  return new Promise((resolve, reject) => {
    ctx.call('generate', args).then(resolve, reject);
  });
}
