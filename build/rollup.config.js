'use strict'

import path from 'path'
import fs from 'fs'
import { name, dependencies, version } from '../package.json'

import cleanCSS from 'clean-css'
import buble from 'rollup-plugin-buble'
import vuePlugin from 'rollup-plugin-vue'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const PATHS = require('./paths')

const [major, minor] = process.versions.node.split('.').map(parseFloat)
if (major < 7 || (major === 7 && minor <= 5)) {
    utils.logError('Node 7.6+ is required.')
    process.exit()
}

// Converts strings into camelCase
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) {
            return ''
        }
        return index == 0 ? match.toLowerCase() : match.toUpperCase()
    })
}

const year = new Date().getFullYear()
const banner = `/*
* Shards Vue v${version} (https://designrevision.com/downloads/shards-vue/)
* Based on: Bootstrap ${dependencies.bootstrap} (https://getbootstrap.com)
* Based on: Shards ${dependencies['shards-ui']} (https://designrevision.com/downloads/shards/)
* Copyright 2017-${year} DesignRevision (https://designrevision.com)
* Copyright 2017-${year} Catalin Vasile (http://catalin.me)
*/`

module.exports = {
    input: PATHS.INPUT,
    external: Object.keys(dependencies).filter(dep => {
        return ['popper.js', 'lodash.xor'].indexOf(dep) === -1
    }),
    plugins: [
        vuePlugin({
            compileTemplate: true,
            cssModules: {
                generateScopedName: '[name]__[local]'
            },
            css(style) {
                fs.writeFileSync(
                    path.resolve(PATHS.DIST + `${name}.css`),
                    new cleanCSS().minify(style).styles
                )
            }
        }),
        nodeResolve({ external: ['vue'] }),
        commonjs(),
        buble({
            objectAssign: 'Object.assign'
        })
    ],
    output: [
        {
            banner,
            format: 'cjs',
            name: camelize(name),
            file: path.resolve(PATHS.DIST, name + '.common.js'),
            sourcemap: true
        },
        {
            banner,
            format: 'umd',
            name: camelize(name),
            modulename: camelize(name),
            file: path.resolve(PATHS.DIST, name + '.umd.js'),
            sourcemap: true
        },
        {
            banner,
            format: 'es',
            name: camelize(name),
            modulename: camelize(name),
            file: path.resolve(PATHS.DIST, name + '.esm.js'),
            sourcemap: true
        }
    ]
}
