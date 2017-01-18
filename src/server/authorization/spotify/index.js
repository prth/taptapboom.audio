'use strict'

const express = require('express')
const co = require('bluebird').coroutine
const Spotify = require('spotify/app')

const router = express.Router({ mergeParams: true })

router.get('/', (req, res) => {

  if (Spotify.client.getAccessToken()) {
    return res.send(`Looks like you're good to go!`);
  }

  return res.redirect('/api/auth/spotify/authorize');
})

router.get('/authorize', (req, res) => {

  const scopes = ['playlist-modify-public', 'playlist-modify-private']
  const state  = Date.now()
  const authoriseURL = Spotify.client.createAuthorizeURL(scopes, state)

  res.redirect(authoriseURL)
})

router.get('/callback', (req, res) => {

  co(function* () {

    const data = yield Spotify.client.authorizationCodeGrant(req.query.code)

    Spotify.client.setAccessToken(data.body['access_token'])
    Spotify.client.setRefreshToken(data.body['refresh_token'])

    return res.redirect('/')
  })()
    .catch(err => res.send(err))
})

module.exports = router
