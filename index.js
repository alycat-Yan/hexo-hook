/* global hexo */

'use strict';
hexo.config.webhook = Object.assign({
  port: 4000,
  log: false,
  // `undefined` uses Node's default (try `::` with fallback to `0.0.0.0`)
  repository: [{
    type: 'github',
    url: undefined,
    local: 'source/_posts'
  }],
  path: undefined,
  header: true
}, hexo.config.webhook);

hexo.extend.console.register('hook', 'Start the server.', {
  desc: 'Start the server and watch for file changes.',
  options: [
  ]
}, require('./lib/hook'));
