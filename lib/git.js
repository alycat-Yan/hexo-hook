'use strict';
const spawn = require('cross-spawn');
const events = require('events');
const pathFn = require('path');
const fs = require('hexo-fs');
const commandExistsSync = require('command-exists').sync;
var eventEmitter = new events.EventEmitter();
function initGit(ctx) {

  const {webhook} = ctx.config;
  let {source} = webhook.repository;
  let baseDir = ctx.base_dir;
  if (source.url == undefined) {
  }
  
  pathGenerate(baseDir,source);

}
eventEmitter.on('event1', function(message) {
  console.log(message);
});

// to check folder is under git
function checkGitFolder(target) {
var gitDir = pathFn.join(target, '.git');
if (fs.existsSync(gitDir) && fs.readdirSync(gitDir).length !== 0){
  return true;
}
  return false;
}

function pathGenerate(baseDir,repository){
  var temp_folder = '';
  if(repository.sub){
    temp_folder = baseDir + repository.sub;
  }
  spawn('git', ['init','posts'], {stdio: 'inherit'});
  spawn('echo', ['"/test/*"','>>','posts/.git/info/sparse-checkout'], {stdio: 'inherit'});
  spawn('git', ['config','core.sparsecheckout','true'], {stdio: 'inherit'});
  spawn('git', ['remote','add','origin','https://github.com/senchalabs/connect.git'], {stdio: 'inherit'});
  spawn('git', ['pull','origin','master'], {stdio: 'inherit'});
  spawn('ln', ['-s','posts/test','../source/_posts'], {stdio: 'inherit'});
}

// if this folder is not under git , first start to remove all the files and clone from github.
function removeGitDir(target) {
  var gitDir = pathFn.join(target, '.');
  return fs.stat(gitDir).catch(function(err) {
    if (err.cause && err.cause.code === 'ENOENT') return;
    throw err;
  }).then(function(stats) {
    if (stats) {
      if (stats.isDirectory()) return fs.rmdir(gitDir);
      return fs.unlink(gitDir);
    }
  }).then(function() {
    return fs.readdir(target);
  }).map(function(path) {
    return pathFn.join(target, path);
  }).filter(function(path) {
    return fs.stat(path).then(function(stats) {
      return stats.isDirectory();
    });
  }).each(removeGitDir);
}
function cloneGithub() {
  return spawn('git', ['clone', '--recursive', source.url, target], {stdio: 'inherit'}).then();
}
module.exports = initGit;
