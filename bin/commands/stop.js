/**
 * @file command `reload`
 * @author zdying
 */

'use strict';

module.exports = {
  command: 'stop',
  describe: 'Stop the local proxy server (In development)',
  usage: 'stop',
  fn: function () {
    console.log('hiProxyServer', global.hiServer);
    console.log('\ncoming soon...\n');
    // console.log();
    // console.log('Server stopped');
    // console.log();
  }
};
