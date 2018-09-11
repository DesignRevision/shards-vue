'use strict'

const path = require('path')

const PATHS = Object.create(null)

PATHS.BASE = path.resolve(__dirname, '..'),
PATHS.SRC  = path.resolve(PATHS.BASE, 'src'),
PATHS.DIST = path.resolve(PATHS.BASE, 'dist')
PATHS.INPUT = path.resolve(PATHS.SRC, 'index.js')

module.exports = PATHS
