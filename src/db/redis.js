'use strict'

const Promise = require('bluebird')
const co = Promise.coroutine
const redis = require('redis')

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype)

const Logger = require('util/logger')

const client = redis.createClient()

module.exports = {
  init: co(function* () {

    yield client.pingAsync()
    Logger.info(`Redis connection established.`)
  }),

  client
}
