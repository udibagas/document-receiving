'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://192.168.43.230:8000/api/"',
  SAP_API_USERNAME: '"G580422"',
  SAP_API_PASSWORD: '"Welcome01"'
})
