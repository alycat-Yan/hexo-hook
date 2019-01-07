'use strict';

const bodyParser = require('body-parser');

module.exports = function(app) {
  const {webhook} = this.config;
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(webhook.path, (req, res) => {
    req.on('data', parseData);
    res.end();
  });
};

function parseData(data) {
  const hookInfo = JSON.parse(data);
  console.log('服务器端接收到数据' + decodeURIComponent(data));
}


function callGenerator(ctx, args) {
  return new Promise((resolve, reject) => {
    ctx.call('generate', args).then(resolve, reject);
  });
}
