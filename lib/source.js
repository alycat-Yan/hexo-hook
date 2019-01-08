'use strict';

const origin_patch = 'source/_posts';
const temp_path = 'posts';
const pathFn = require('path');
const fs = require('hexo-fs');
const spawn = require('cross-spawn');
// 4. if received the notification, make sure to pull the source files from remote to locate, the locate git folder is posts and create link to source/_posts .
function sourceSync(baseDir, repository) {
  if (checkGitFolder(baseDir)) {
    pullRepository(baseDir);
  } else {
    initRepository(baseDir, repository);
  }
}


function checkGitFolder(baseDir) {
  var gitDir = pathFn.join(baseDir, temp_path);
  if (fs.existsSync(gitDir) && fs.readdirSync(gitDir).length !== 0) {
    return true;
  }
  return false;
}

function pullRepository(baseDir) {
  // spawn.sync('git', ['-c','core.quotepath=false','-c','log.showSignature=false','fetch','origin','--progress','--prune'], {stdio: 'inherit',cwd: baseDir+temp_path});
  spawn.sync('git', ['pull', 'origin', 'master'], {stdio: 'inherit', cwd: baseDir + temp_path});
}

function initRepository(baseDir, repository) {
  spawn.sync('git', ['init', temp_path], {stdio: 'inherit'});
  spawn.sync('echo', [repository.sub, '>>', temp_path + '/.git/info/sparse-checkout'], {stdio: 'inherit', cwd: baseDir + temp_path});
  spawn.sync('git', ['config', 'core.sparsecheckout', 'true'], {stdio: 'inherit', cwd: baseDir + temp_path});
  spawn.sync('git', ['remote', 'add', 'origin', repository.url], {stdio: 'inherit', cwd: baseDir + temp_path});
  spawn.sync('rm', ['-rf', origin_patch], {stdio: 'inherit', cwd: baseDir});
  spawn.sync('git', ['pull', 'origin', 'master'], {stdio: 'inherit', cwd: baseDir + temp_path});
  spawn.sync('git', ['branch', '--set-upstream-to=origin/master', 'master'], {stdio: 'inherit', cwd: baseDir + temp_path});
  spawn.sync('ln', ['-sf', baseDir + temp_path + repository.sub, origin_patch], {stdio: 'inherit'});
}


module.exports = sourceSync;
