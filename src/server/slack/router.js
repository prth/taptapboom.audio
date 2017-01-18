'use strict'

const express = require('express')
const _ = require('lodash')
const request = require('request-promise')
const co = require('bluebird').coroutine
const Controller = require('server/slack/controller')
const Spotify = require('spotify/app')
const Serializer =  require('server/slack/serializer')

const router = express.Router({ mergeParams: true })

router.use(Controller.authorizeSlack)

router.post('/command', (req, res) => {
  return co(function* () {

    const text = _.get(req, 'body.text')

    const tokens = text.split(' ')
    const command = tokens.shift()
    const query = tokens.join(' ')

    switch (command) {
      case 'ping':
        return res.json({
          text: 'pong'
        })

      case 'help':
        return _displayHelp(req.body, query, res)

      case 'add':
        return _searchMusicFromSpotify(req.body, query, res)

      case 'play':
        return _addMusicToPlaylist(req.body, query, res)

      case 'nowplaying':
        return res.send('l')

      default:
        return res.json({
          text: `We don't support that yet.`
        })
    }
  })()
})

function _searchMusicFromSpotify(req, query, res) {
  return co(function* () {

    res.send({
      text: `Wait for it...`
    })

    const results = yield Spotify.search(query)
    const serialized = Serializer.serializeSearchResults(query, results.items)

    yield request({
      uri: req.response_url,
      method: 'POST',
      json: serialized
    })

    if (results.status === 'found') {
      yield request({
        uri: req.response_url,
        method: 'POST',
        json: {
          text: `Reply with \`/taptapboom-box play {{id}}\` where the id is from one of the songs.`
        }
      })
    }
  })()
}

function _addMusicToPlaylist(req, query, res) {
  return co(function* () {

    res.json({
      text: `Wait for it...`
    })

    const trackId = query.split(' ')[0]

    const result = yield Spotify.addTrackToTargetPlaylist(trackId)

    if (result.result === 'success') {
      yield request({
        uri: req.response_url,
        method: 'POST',
        json: {
          text: `Track added to playlist. Type \`/taptapboom-box nowplaying\` to see the currently playing song.`
        }
      }) 
    }
  })()
}

function _displayHelp(req, query, res) {
  res.json({
    text: 'massive'
  })
}

module.exports = router
