#!/usr/bin/env node

require('colors');
var path = require('path');
// var color = require('../src/helpers/color');
// var log = require('../src/helpers/log');
var fs = require('fs');

var Args = require('hemsl');
var showImage = require('./showImage');
var packageInfo = require('../package');

var _args = new Args();

// global.log = log;

'start stop restart list open'.split(' ').forEach(function (cmd) {
  var cmdConfig = require(path.join(__dirname, 'commands', cmd));

  if (cmdConfig && cmdConfig.command) {
    _args.command(cmdConfig);
  }
});

_args
    .version(packageInfo.version)
    .bin('hiproxy')
    .option('debug', {
      alias: 'd',
      describe: '显示调试信息'
    })
    .option('detail', {
      alias: 'D',
      describe: '显示详细调试信息'
    })
    .option('log-time', {
      describe: '显示日志时间'
    })
    .option('log-level', {
      describe: '过滤日志级别，只有指定级别的日志才会显示',
      default: 'access,error'
    })
    .option('grep <content>', {
      describe: '过滤日志内容，只有保护过滤字符串的日志才会显示'
    });

// 解析参数，但是不执行命令
global.args = _args.parse(false);

if (global.args.daemon && !process.env.__daemon) {
  // 如果指定后台运行模块，并且不是child进程，启动child进程
  var spawn = require('child_process').spawn;
  var env = process.env;
  var out = fs.openSync(path.join(__dirname, /* '../logs/', */ 'out.log'), 'a');
  var err = fs.openSync(path.join(__dirname, /* '../logs/', */ 'err.log'), 'a');

  env.__daemon = true;

  const child = spawn('node', [__filename].concat(process.argv.slice(2)), {
    env: env,
    detached: true,
    stdio: ['ignore', out, err]
  });

  child.unref();
} else {
  // console.log('exe');
  // 没有指定后台运行，或者是child进程
  _args.execute();

  // TODO 如果启动失败，不能更新pid
  var pid = fs.openSync(path.join(__dirname, /* '../logs/', */ 'hiproxy.pid'), 'w');
  fs.write(pid, process.pid, function (err) {
    if (err) {
      console.log('pid write error');
    }
  });
}

if (global.args._.length === 0 && Object.keys(global.args).length === 1) {
  showImage([
    '',
    '',
    'welcome to use hiproxy'.bold,
    'current version is ' + packageInfo.version.bold.green,
    'You can try `' + 'hiproxy --help'.underline + '` for more info'
  ]);
}
