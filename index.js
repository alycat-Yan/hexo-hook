/* global hexo */

'use strict';
hexo.config.webhook = Object.assign({
  port: 8000,
  log: false,
  repository: {source: {
    url: 'https://github.com/senchalabs/connect.git',
    sub:'/test',
    secret: undefined
  }, themes:
  {
    url: undefined,
    sub:'',
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
