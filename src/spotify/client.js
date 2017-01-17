'use strict'

const SpotifyWebApi = require('spotify-web-api-node')
const config = require('config')

const client = new SpotifyWebApi({
  clientId : config.get('spotify.clientId'),
  clientSecret : config.get('spotify.clientSecret'),
  redirectUri : config.get('spotify.redirectUri')
})

module.exports = client
