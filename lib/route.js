'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time');

module.exports = function(app) {
  var {webhook} = this.config;
  var {log} = this;
  const baseDir = this.base_dir;
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({type: 'application/*+json'}));
  // 2. read the config file to check listen uri and type. ( for now this hook plugin only support github webhook syntax )
  app.use(webhook.path, (req, res) => {
    var sig = req.headers['x-hub-signature'];
    var event = req.headers['x-github-event'];
    var id = req.headers['x-github-delivery'];

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
      res.writeHead(400, {'content-type': 'application/json'});
      res.end();
      return;
    }

    req.on('data', function(data, res) {
      if (webhook.repository.source.secret && !verify(sig, data, webhook.repository.source.secret)) {
        log.error('X-Hub-Signature does not match blob signature');
        return;
      }
      try {
        let {source} = webhook.repository;
        let {events} = JSON.parse(data).hook;

        if (source.url !== undefined && events[0] === 'push') {
          var sourceSync = require('./source');
          sourceSync(baseDir, source);
        } else {
          log.error('No Push Event found on request');
        }
      } catch (e) {
        log.error(e);
      }
    });
    // 5. call the generate module in hexo to recreate the static files in public folder.
    res.writeHead(200, {'content-type': 'application/json'});
    res.end();
  });
  return new Promise((resolve, reject) => {
    this.call('generate', {}).then(resolve, reject);
  });
};

function sign(data, secret) {
  return 'sha1=' + crypto.createHmac('sha1', secret).update(data).digest('hex');
}

function verify(signature, data, secret) {
  return bufferEq(Buffer.from(signature), Buffer.from(sign(data, secret)));
}
