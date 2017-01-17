'use strict'

const config = require('config')
const debug = require('debug')('spotify-app')

const Logger = require('util/logger')
const spotifyClient = require('spotify/client')

function search(queryString) {
  return spotifyClient.searchTracks(queryString)
    .then(r => {

      debug(JSON.stringify(r, null, 2))

      const items = r.body.tracks.items
      const response = {
        status: 'found',
        items
      }

      if (!items.length) {
        response.status = 'not_found'
      }

      return response
    })
}

function addTrackToTargetPlaylist(trackId) {

  debug(`Making request:`, config.get('spotify.playlistUser'),
    config.get('spotify.targetPlaylist'),
    trackId)

  return spotifyClient.addTracksToPlaylist(
    config.get('spotify.playlistUser'),
    config.get('spotify.targetPlaylist'),
    `spotify:track:${trackId}`
  )
    .then(r => {
      debug(JSON.stringify(r, null, 2))
      return {
        result: 'success'
      }
    })
    .catch(err => {
      Logger.error({err, stack: err.stack})
      return {
        result: 'failure'
      }
    })
}

module.exports = {
  client: spotifyClient,
  search,
  addTrackToTargetPlaylist
}
