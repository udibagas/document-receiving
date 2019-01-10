'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://13.76.153.42/material-receiving-and-inspection-dev/api/"'
  // ROOT_API: '"http://minions.gmf-aeroasia.co.id/api/"'
  // ROOT_API: '"192.168.0.18:8000/api/"'
})
