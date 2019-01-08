/* global hexo */

'use strict';
hexo.config.webhook = Object.assign({
  port: 8000,
  log: false,
  repository: {
    source: {
      url: 'https://github.com/senchalabs/connect.git',
      sub: '/test',
      secret: undefined
    }
  },
  path: '/hook'
}, hexo.config.webhook);

hexo.extend.console.register('hook', 'Start web server to listen webhook events.', {
  desc: 'Start the server and listen webhook events.',
  options: [
    {name: '-p, --port', desc: 'Override the default port.'}
  ]
}, require('./lib/hook'));
