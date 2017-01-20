'use strict'

const debug = require('debug')('authorization')
const express = require('express')
const co = require('bluebird').coroutine

const Constants = require('src/constants')
const Spotify = require('src/spotify/app')
const Redis = require('src/db/redis')

const router = express.Router({ mergeParams: true })

router.get('/', (req, res) => {
  return co(function* () {

    let accessToken = Spotify.client.getAccessToken()

    if (accessToken) {
      debug(`Found Spotify access token in memory.`)
    } else {
      accessToken = yield Redis.client.getAsync(Constants.STORAGE_KEY.SPOTIFY.ACCESS_TOKEN)
      Spotify.client.setAccessToken(accessToken)
    }

    if (!accessToken) {
      debug(`Spotify access token not found in storage or memory. Beginning oAuth.`)
      return res.redirect('/api/auth/spotify/authorize')
    }

    return res.send(`Looks like you're good to go!`)
  })()
})

router.get('/authorize', (req, res) => {

  const scopes = ['playlist-modify-public', 'playlist-modify-private']
  const state  = Date.now()
  const authoriseURL = Spotify.client.createAuthorizeURL(scopes, state)

  res.redirect(authoriseURL)
})

router.get('/callback', (req, res) => {
  return co(function* () {

    const data = yield Spotify.client.authorizationCodeGrant(req.query.code)
    debug(`Spotify access and refresh tokens received.`)

    Spotify.client.setAccessToken(data.body['access_token'])
    Spotify.client.setRefreshToken(data.body['refresh_token'])

    yield Redis.client.setAsync(Constants.STORAGE_KEY.SPOTIFY.ACCESS_TOKEN, data.body['access_token'])
    yield Redis.client.setAsync(Constants.STORAGE_KEY.SPOTIFY.REFRESH_TOKEN, data.body['refresh_token'])
    debug(`Spotify access and refresh tokens stored.`)

    return res.redirect('/')
  })()
    .catch(err => res.send(err))
})

module.exports = router
