'use strict'

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const UglifyJS = require('uglify-js')
const UglifyES = require('uglify-es')
const PATHS = require('./paths')

let Uglifier = UglifyJS

glob(path.resolve(PATHS.DIST + '/*.js'), {}, function(err, files) {
    if (err) {
        throw err
    }

    files.forEach(file => {
        if (path.basename(file).indexOf('.min.js') !== -1) {
            return
        }

        if (path.basename(file).indexOf('.esm.js')) {
            Uglifier = UglifyES
        }

        // Define minified file path
        let minFilePath = path.basename(file).replace('.js', '.min.js')
        minFilePath = path.resolve(PATHS.DIST + '/' + minFilePath)

        // Define minified file's map path
        let minMapPath = path.basename(file).replace('.js', '.min.map')
        minMapPath = path.resolve(PATHS.DIST + '/' + minMapPath)

        // Minify
        let _c = fs.readFileSync(file, 'utf8')
        _c = Uglifier.minify(_c, { mangle: true, compress: true, sourceMap: true })

        // Write minified file and sourcemap
        fs.writeFileSync(minFilePath, _c.code)
        fs.writeFileSync(minMapPath, _c.map)
    })
})
