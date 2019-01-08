'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time');
const EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
module.exports = function(app) {
  var {webhook} = this.config;
  var {log} = this;
  var ctx = this;
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({type: 'application/*+json'}));
  // 2. read the config file to check listen uri and type. ( for now this hook plugin only support github webhook syntax )
  app.use(webhook.path, (req, res) => {
    var sig = req.headers['x-hub-signature'];
    var event = req.headers['x-github-event'];
    var id = req.headers['x-github-delivery'];
    var response = res;
    if (!sig) {
      log.error('No X-Hub-Signature found on request');
    }
    if (!event) {
      log.error('No X-Github-Event found on request');
    }

    if (!id) {
      log.error('No X-Github-Delivery found on request');
    }
    if (!sig || !event || !id) {
      response.writeHead(400, {'content-type': 'application/json'});
      response.end();
      return;
    }
    if (event !== 'push') {
      log.error('No Push Event found on request');
      response.writeHead(200, {'content-type': 'application/json'});
      response.end();
      return;
    }
    var bodyChunks = [];
    req.on('data', function(data) {
      bodyChunks.push(data);
    }).on('end', function() {
      if (webhook.repository.source.secret && !verify(sig, Buffer.concat(bodyChunks), webhook.repository.source.secret)) {
        log.error('X-Hub-Signature does not match blob signature');
        return;
      }
      emitter.emit('git', ctx);
      response.writeHead(200, {'content-type': 'application/json'});
      response.end();
    });
  });
};
// 5. call the generate module in hexo to recreate the static files in public folder.
emitter.on('git', function(ctx) {
  let {source} = ctx.config.webhook.repository;
  const baseDir = ctx.base_dir;
  let {log} = ctx;
  if (source.url !== undefined) {
    var sourceSync = require('./source');
    sourceSync(baseDir, source);
  } else {
    log.error('No Push Event found on request');
  }
  return new Promise((resolve, reject) => {
    ctx.call('generate', {}).then(resolve, reject);
  });
});

function sign(data, secret) {
  return 'sha1=' + crypto.createHmac('sha1', secret).update(data).digest('hex');
}

function verify(signature, data, secret) {
  return bufferEq(Buffer.from(signature), Buffer.from(sign(data, secret)));
}
