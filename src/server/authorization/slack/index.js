'use strict'

const express = require('express')
const _ = require('lodash')
const co = require('bluebird').coroutine
const request = require('request-promise')
const config = require('config')

const Redis = require('src/db/redis')

const router = express.Router({ mergeParams: true })

router.get('/callback', (req, res) => {

  co(function* () {

    const code = req.query.code
    const state = req.query.state

    if (state !== config.get('slack.oAuthState')) {
      throw new Error(`Received state: ${state} does not match configured state.`)
    }

    const options = {
      uri: 'https://slack.com/api/oauth.access',
      qs: {
        code,
        client_id: config.get('slack.clientId'),
        client_secret: config.get('slack.clientSecret')
      }
    }

    const response = yield request(options)
    const accessToken = _.get(response, 'body.access_token')

    yield Redis.set('slack:access_token', accessToken)

    res.sendStatus(200)
  })()
    .catch(err => res.send(err))
})

module.exports = router
