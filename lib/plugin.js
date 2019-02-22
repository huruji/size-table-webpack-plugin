const gzipSize = require('gzip-size');
const filesize = require('filesize');
const herb = require('herb');

module.exports = class TablePlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        errorSize: 1024 * 1024 * 500
      },
      options
    );
  }

  apply(compiler) {
    const {
      errorSize, premessage, postmessage, clear
    } = this.options;
    compiler.hooks.done.tapPromise('table-plugin', async (stats) => {
      if (stats.hasErrors()) return;
      const assets = stats.compilation.assets;
      const gzipedSizes = await Promise.all(
        Object.keys(assets).map(async (name) => {
          const size = await gzipSize(assets[name].source());
          return size;
        })
      );
      const headers = ['asset', 'size', 'gziped'];
      const rows = Object.keys(assets).map((name, i) => {
        let row = [name, filesize(assets[name].size()), filesize(gzipedSizes[i])];
        if (assets[name].size() >= errorSize) {
          row = row.map(herb.red);
        }
        return row;
      });
      if (clear) console.clear();
      if (premessage) {
        console.log(premessage, '\n');
      }
      herb.table({
        headers,
        rows,
        borders: false
      });
      if (postmessage) {
        console.log('\n', postmessage);
      }
      return Promise.resolve();
    });
  }
};
