'use strict';
const pathFn = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');

module.exports = function(app) {
    const { config, route } = this;
    const { args = {} } = this.env;

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({ type: 'application/*+json' }));
    app.use("/hook", (req, res) => {
        console.log(req.method);
    req.on('data',parseData);
    res.end();
});
}

function parseData(data){
    console.log('服务器端接收到数据' + decodeURIComponent(data));
}