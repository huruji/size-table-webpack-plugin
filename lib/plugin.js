const gzipSize = require('gzip-size')
const filesize = require('filesize');
const herb = require('herb')

module.exports = class TablePlugin {
    constructor(options = {
        errorSize: 1024 * 1024 * 500
    }) {
        this.options = options
    }
    apply(compiler) {
        const errorSize = this.options.errorSize
        compiler.hooks.done.tapPromise('table-plugin', async (stats) => {
            if (stats.hasErrors()) return
            const assets = stats.compilation.assets;
            const gzipedSizes = await Promise.all(Object.keys(assets).map(async name =>
                await gzipSize(assets[name].source())))
            const headers = ['asset', 'size', 'gziped']
            const rows = Object.keys(assets).map((name, i) => {
                let row = [
                    name,
                    filesize(assets[name].size()),
                    filesize(gzipedSizes[i])
                ]
                if (assets[name].size() >= errorSize) {
                    row = row.map(herb.red)
                }
                return row
            })
            herb.table({
                headers,
                rows,
                borders: false
            })
            return Promise.resolve()
        })
    }
}