'use strict';
// const Promise = require('bluebird');
module.exports = function (args, callback) {
    // console.log(this.watch())
    // new Promise((resolve, reject) => {
    // this.call('generate', args).then(resolve, reject);
    // })
    // addHook(this);
    // console.log(this.extend.console.get('server'))
    this.extend.filter.register('server_middleware', require('./route'));
    new Promise((resolve, reject) => {
        this.call('server', args).then(resolve, reject);
})
};

//1. check if server plugin, if the plugin is included,just add webhook uri , otherwise create http server.
//2.
function addHook(hexo){
    let config = hexo.config;

}