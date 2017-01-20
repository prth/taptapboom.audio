'use strict'

const co = require('bluebird').coroutine

const Redis = require('src/db/redis')
const Spotify = require('src/spotify/app')
const Server = require('src/server')

co(function* () {

  yield Redis.init()
  yield Spotify.init()
  Server.init()
})()

const server = require('./src/server')
