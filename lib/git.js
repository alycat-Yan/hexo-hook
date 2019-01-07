'use strict';
const spawn = require('hexo-util/lib/spawn');
const events = require('events');
const pathFn = require('path');
const fs = require('hexo-fs');
const commandExistsSync = require('command-exists').sync;
const source_path = 'source/_posts';
var eventEmitter = new events.EventEmitter();
function initGit(ctx) {

  const {webhook} = ctx.config;
  let {source} = webhook.repository;
  let baseDir = ctx.base_dir;
  let target = baseDir + source_path;
  if (source.url == undefined) {
  }
  if (!checkGitFolder(target)) {

  } else {

  }

}
eventEmitter.on('event1', function(message) {
  console.log(message);
});

// to check folder is under git
function checkGitFolder(target) {

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
  return spawn('git', ['clone', '--recursive', source.url, target], {
    	  stdio: 'inherit'
    	}).then();
}
module.exports = initGit;
