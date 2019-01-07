/* global hexo */

'use strict';
hexo.config.webhook = Object.assign({
  port: 8000,
  log: false,
  repository: [{
    url: undefined,
    secret: undefined,
    local: 'source/_posts'
  },
  {
    url: undefined,
    secret: undefined,
    local: 'themes'
  }],
  path: '/hook',
  header: true
}, hexo.config.webhook);

hexo.extend.console.register('hook', 'Start the server.', {
  desc: 'Start the server and watch for file changes.',
  options: [
  ]
}, require('./lib/hook'));
