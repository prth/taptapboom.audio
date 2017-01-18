'use strict'

const co = require('bluebird').coroutine

const Redis = require('db/redis')
const Server = require('server')

co(function* () {

  yield Redis.init()
  Server.init()
})()

const server = require('./src/server')
