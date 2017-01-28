'use strict'

const co = require('bluebird').coroutine
const request = require('request-promise')

const Constants = require('src/constants')
const Serializer =  require('src/server/slack/serializer')
const Spotify = require('src/spotify/app')

const COMMAND_KEY = 'add'

function getSampleInput() {
  return 'add Sa Ni Dha Pa'
}

function getHelpText() {
  return 'Adds song to the playlist'
}

function execute(query, callbackUrl) {
  return co(function* () {
    _searchMusicFromSpotify(query, callbackUrl)

    return Constants.MESSAGING.WAIT_FOR_IT
  })()
}

function _searchMusicFromSpotify(query, callbackUrl) {
  return co(function* () {
    const results = yield Spotify.search(query)
    const serialized = Serializer.serializeSearchResults(query, results.items)

    yield request.post({ uri: callbackUrl, json: serialized })
  })()
}

module.exports = {
  COMMAND_KEY,
  getSampleInput,
  getHelpText,
  execute
}
