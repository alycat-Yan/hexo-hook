'use strict';

const bodyParser = require('body-parser');
const git = require('./git');
module.exports = function(app) {
  const {webhook} = this.config;
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(webhook.path, (req, res) => {
    git(this);
    req.on('data', parseData);
    res.end();
  });
};

function parseData(data) {
  const hookInfo = JSON.parse(data);
  console.log('服务器端接收到数据' + decodeURIComponent(data));
}


function callGenerator(args) {
  return new Promise((resolve, reject) => {
    this.call('generate', args).then(resolve, reject);
  });
}
