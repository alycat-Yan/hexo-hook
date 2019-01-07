/* global hexo */

'use strict';
hexo.config.webhook = Object.assign({
  port: 8000,
  log: false,
  repository: {source: {
    url: 'https://github.com/rvagg/github-webhook-handler.git',
    secret: undefined
  }, themes:
  {
    url: undefined,
    secret: undefined

  }},
  path: '/hook',
  header: true
}, hexo.config.webhook);

hexo.extend.console.register('hook', 'Start the server.', {
  desc: 'Start the server and watch for file changes.',
  options: [
  ]
}, require('./lib/hook'));
